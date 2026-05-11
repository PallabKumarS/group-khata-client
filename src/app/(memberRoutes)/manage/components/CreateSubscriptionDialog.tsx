"use client";

import { useState } from "react";
import { FieldValues, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";
import { Loader2, Plus, Users, IndianRupee } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { createSubscription } from "@/services/subscriptionService";

const schema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters"),
  description: z.string().optional(),
  paymentType: z.enum(["monthly", "yearly", "custom"]),
  amount: z.number().min(1, "Amount must be greater than 0"),
  maxMembers: z.number().min(1, "Must allow at least 1 member"),
  includeManagerInLimit: z.boolean(),
});

type FormValues = z.infer<typeof schema>;

export function CreateSubscriptionDialog({
  onSuccess,
}: {
  onSuccess: () => void;
}) {
  const [open, setOpen] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: "",
      description: "",
      paymentType: "monthly",
      amount: 0,
      maxMembers: 10,
      includeManagerInLimit: true,
    },
  });

  const paymentType = watch("paymentType");
  const includeManager = watch("includeManagerInLimit");

  const onSubmit = async (data: FieldValues) => {
    const res = await createSubscription(data as FormValues);
    if (res?.success) {
      toast.success("Subscription group created!");
      reset();
      setOpen(false);
      onSuccess();
    } else {
      toast.error(res?.message || "Failed to create subscription");
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-violet-600 hover:bg-violet-700 text-white shadow-lg transition-all rounded-xl">
          <Plus className="w-4 h-4 mr-2" />
          Create New Group
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] border-border/40 bg-card/95 backdrop-blur-xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold bg-linear-to-r from-violet-600 to-indigo-600 bg-clip-text text-transparent">
            New Subscription
          </DialogTitle>
          <DialogDescription>
            Create a new group to manage members and track payments.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 mt-4">
          <div className="space-y-2">
            <Label>Group Name</Label>
            <Input
              placeholder="e.g. Netflix Premium Family"
              {...register("name")}
              className="bg-background/50"
            />
            {errors.name && (
              <p className="text-xs text-destructive">{errors.name.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label>Description (Optional)</Label>
            <Input
              placeholder="e.g. 4K HDR account sharing"
              {...register("description")}
              className="bg-background/50"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Payment Cycle</Label>
              <Select
                value={paymentType}
                onValueChange={(val) =>
                  setValue(
                    "paymentType",
                    val as "monthly" | "yearly" | "custom",
                  )
                }
              >
                <SelectTrigger className="bg-background/50">
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="monthly">Monthly</SelectItem>
                  <SelectItem value="yearly">Yearly</SelectItem>
                  <SelectItem value="custom">Custom</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="flex items-center gap-1">
                <IndianRupee className="w-3 h-3 text-violet-500" /> Amount
              </Label>
              <Input
                type="number"
                {...register("amount", { valueAsNumber: true })}
                className="bg-background/50"
              />
              {errors.amount && (
                <p className="text-xs text-destructive">
                  {errors.amount.message}
                </p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label className="flex items-center gap-1">
              <Users className="w-3 h-3 text-violet-500" /> Member Limit
            </Label>
            <Input
              type="number"
              {...register("maxMembers", { valueAsNumber: true })}
              className="bg-background/50"
            />
            {errors.maxMembers && (
              <p className="text-xs text-destructive">
                {errors.maxMembers.message}
              </p>
            )}
          </div>

          <div className="flex items-center justify-between p-3 rounded-xl border border-border/40 bg-muted/20">
            <div className="space-y-0.5">
              <Label>Include Manager</Label>
              <p className="text-xs text-muted-foreground">
                Does the manager count towards the member limit?
              </p>
            </div>
            <Switch
              checked={includeManager}
              onCheckedChange={(val) => setValue("includeManagerInLimit", val)}
            />
          </div>

          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-linear-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500"
          >
            {isSubmitting ? (
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : null}
            Create Subscription
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
