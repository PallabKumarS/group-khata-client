"use client";

import { useState, useEffect } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Loader2, ChevronsUpDown } from "lucide-react";
import { format } from "date-fns";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { DragNDropUploader } from "@/components/shared/DragNDropUploader";
import {
  createPaymentSchema,
  TCreatePaymentInput,
} from "@/server/modules/payment/payment.validation";
import { submitPayment } from "@/services/paymentService";
import { TSubscription } from "@/types/subscription.type";

interface SubmitPaymentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  subscriptions: TSubscription[];
  onSuccess: () => void;
}

const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

export function SubmitPaymentDialog({
  open,
  onOpenChange,
  subscriptions,
  onSuccess,
}: SubmitPaymentDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const methods = useForm<TCreatePaymentInput>({
    resolver: zodResolver(createPaymentSchema),
    defaultValues: {
      subscription: "",
      paymentMethod: "",
      amount: 0,
      months: [format(new Date(), "MMMM")],
      year: new Date().getFullYear(),
      ss: "",
      note: "",
    },
  });

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
    watch,
    reset,
  } = methods;

  const selectedSubId = watch("subscription");
  const selectedMonths = watch("months") || [];
  const selectedSub = subscriptions.find((s) => s._id === selectedSubId);
  const managerPaymentMethods = selectedSub?.manager?.paymentMethods || [];

  // Auto-calculate amount
  useEffect(() => {
    if (selectedSub && selectedMonths.length > 0) {
      setValue("amount", selectedSub.amount * selectedMonths.length);
    } else {
      setValue("amount", 0);
    }
  }, [selectedMonths, selectedSub, setValue]);

  const onSubmit = async (data: TCreatePaymentInput) => {
    setIsSubmitting(true);
    try {
      const res = await submitPayment(data);
      if (res.success) {
        toast.success("Payment submitted successfully!");
        onOpenChange(false);
        reset();
        onSuccess();
      } else {
        toast.error(res.message || "Failed to submit payment");
      }
      // biome-ignore lint/suspicious/noExplicitAny: <>
    } catch (error: any) {
      toast.error(
        error.message || "An error occurred while submitting payment",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const toggleMonth = (month: string) => {
    const current = [...selectedMonths];
    const index = current.indexOf(month);
    if (index > -1) {
      if (current.length > 1) {
        current.splice(index, 1);
      } else {
        toast.error("At least one month must be selected");
        return;
      }
    } else {
      current.push(month);
    }
    // Sort months to keep them in order
    current.sort((a, b) => MONTHS.indexOf(a) - MONTHS.indexOf(b));
    setValue("months", current);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] border-border/40 bg-card/95 backdrop-blur-xl">
        <DialogHeader>
          <DialogTitle>Submit Payment</DialogTitle>
          <DialogDescription>
            Enter payment details and upload your screenshot proof.
          </DialogDescription>
        </DialogHeader>
        <FormProvider {...methods}>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 mt-4">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Group / Subscription</Label>
                <Select onValueChange={(val) => setValue("subscription", val)}>
                  <SelectTrigger className="bg-background/50">
                    <SelectValue placeholder="Select Group" />
                  </SelectTrigger>
                  <SelectContent>
                    {subscriptions.map((sub) => (
                      <SelectItem key={sub._id} value={sub._id}>
                        {sub.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.subscription && (
                  <p className="text-xs text-destructive">
                    {errors.subscription.message}
                  </p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Months</Label>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-full justify-between bg-background/50 font-normal"
                      >
                        {selectedMonths.length > 0
                          ? `${selectedMonths.length} month(s) selected`
                          : "Select Months"}
                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent className="w-56 bg-card/95 backdrop-blur-xl border-border/40">
                      {MONTHS.map((month) => (
                        <DropdownMenuCheckboxItem
                          key={month}
                          checked={selectedMonths.includes(month)}
                          onCheckedChange={() => toggleMonth(month)}
                          onSelect={(e) => e.preventDefault()}
                        >
                          {month}
                        </DropdownMenuCheckboxItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                  {errors.months && (
                    <p className="text-xs text-destructive">
                      {errors.months.message}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label>Year</Label>
                  <Input
                    type="number"
                    {...register("year", { valueAsNumber: true })}
                    className="bg-background/50"
                  />
                  {errors.year && (
                    <p className="text-xs text-destructive">
                      {errors.year.message}
                    </p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Total Amount (৳)</Label>
                  <Input
                    type="number"
                    {...register("amount", { valueAsNumber: true })}
                    readOnly
                    className="bg-muted/50 cursor-not-allowed font-bold text-violet-600"
                  />
                  {errors.amount && (
                    <p className="text-xs text-destructive">
                      {errors.amount.message}
                    </p>
                  )}
                </div>
                <div className="space-y-2">
                  <Label>Payment Method</Label>
                  <Select
                    onValueChange={(val) => setValue("paymentMethod", val)}
                  >
                    <SelectTrigger className="bg-background/50">
                      <SelectValue placeholder="Select Method" />
                    </SelectTrigger>
                    <SelectContent>
                      {managerPaymentMethods.length > 0 ? (
                        managerPaymentMethods.map((method, idx) => (
                          <SelectItem
                            key={idx}
                            value={`${method.type} - ${method.accountNumber || method.phoneNumber}`}
                          >
                            <div className="flex flex-col text-left">
                              <span className="capitalize font-medium">
                                {method.type}{" "}
                                {method.label ? `(${method.label})` : ""}
                              </span>
                              <span className="text-[10px] text-muted-foreground">
                                {method.accountNumber || method.phoneNumber} -{" "}
                                {method.accountName}
                              </span>
                            </div>
                          </SelectItem>
                        ))
                      ) : (
                        <SelectItem value="manual" disabled>
                          No methods added by manager
                        </SelectItem>
                      )}
                    </SelectContent>
                  </Select>
                  {errors.paymentMethod && (
                    <p className="text-xs text-destructive">
                      {errors.paymentMethod.message}
                    </p>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label>Screenshot Proof</Label>
                <div className="p-4 border border-dashed border-border/60 rounded-xl bg-muted/10">
                  <DragNDropUploader name="ss" folder="group-khata/payments" />
                </div>
                {errors.ss && (
                  <p className="text-xs text-destructive">
                    {errors.ss.message}
                  </p>
                )}
              </div>
            </div>

            <DialogFooter className="flex justify-end gap-3 pt-6 border-t border-border/40">
              <Button
                type="button"
                variant="ghost"
                onClick={() => onOpenChange(false)}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="bg-violet-600 hover:bg-violet-700 text-white rounded-xl"
              >
                {isSubmitting && (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                )}
                Submit Payment
              </Button>
            </DialogFooter>
          </form>
        </FormProvider>
      </DialogContent>
    </Dialog>
  );
}
