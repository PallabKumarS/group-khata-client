import { useFormContext, useFieldArray } from "react-hook-form";
import { CreditCard, Plus, Trash2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { ProfileInput } from "./dashboard-schemas";

export function PaymentMethodsCard() {
  const { register, control, watch, setValue } = useFormContext<ProfileInput>();

  const { fields, append, remove } = useFieldArray({
    control,
    name: "paymentMethods",
  });

  return (
    <div className="pt-6 mt-6 border-t border-border/40 space-y-6">
      <div className="flex items-center justify-between">
        <Label className="text-xl font-bold flex items-center gap-2 bg-linear-to-r from-violet-600 to-indigo-600 bg-clip-text text-transparent">
          <CreditCard className="w-6 h-6 text-violet-500" />
          Payment Methods
        </Label>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => append({ type: "bkash", isPrimary: false })}
          className="gap-2 border-violet-500/30 hover:bg-violet-500/10 hover:text-violet-600 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add Method
        </Button>
      </div>

      <div className="space-y-4">
        <AnimatePresence initial={false}>
          {fields.map((item, index) => {
            const methodType = watch(`paymentMethods.${index}.type`);

            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, height: 0, y: -20 }}
                animate={{ opacity: 1, height: "auto", y: 0 }}
                exit={{
                  opacity: 0,
                  height: 0,
                  y: -20,
                  transition: { duration: 0.2 },
                }}
                className="overflow-hidden"
              >
                <div className="p-5 rounded-2xl border border-border/40 bg-white/5 backdrop-blur-xl shadow-sm space-y-4 relative group hover:border-violet-500/30 transition-all duration-300">
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => remove(index)}
                    className="absolute right-3 top-3 opacity-0 group-hover:opacity-100 hover:bg-destructive/10 hover:text-destructive transition-all duration-300"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mr-8">
                    <div className="grid gap-2">
                      <Label className="text-foreground/80">Type</Label>
                      <Select
                        value={methodType}
                        onValueChange={(val) => {
                          setValue(
                            `paymentMethods.${index}.type`,
                            // biome-ignore lint/suspicious/noExplicitAny: <>
                            val as any,
                            { shouldDirty: true },
                          );
                        }}
                      >
                        <SelectTrigger className="bg-background/50 focus:ring-violet-500/50">
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="bkash">bKash</SelectItem>
                          <SelectItem value="nagad">Nagad</SelectItem>
                          <SelectItem value="dbbl">DBBL</SelectItem>
                          <SelectItem value="bank">Bank Transfer</SelectItem>
                          <SelectItem value="cash">Cash</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {(methodType === "bkash" ||
                      methodType === "nagad" ||
                      methodType === "dbbl") && (
                      <motion.div
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="grid gap-2"
                      >
                        <Label className="text-foreground/80">
                          Phone / Account Number
                        </Label>
                        <Input
                          placeholder="e.g. 017xxxxxxxx"
                          {...register(`paymentMethods.${index}.phoneNumber`)}
                          className="bg-background/50 focus-visible:ring-violet-500/50"
                        />
                      </motion.div>
                    )}

                    {methodType === "bank" && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="grid grid-cols-1 md:grid-cols-2 gap-4 col-span-1 md:col-span-2"
                      >
                        <div className="grid gap-2">
                          <Label className="text-foreground/80">
                            Bank Name
                          </Label>
                          <Input
                            placeholder="e.g. City Bank"
                            {...register(`paymentMethods.${index}.bankName`)}
                            className="bg-background/50 focus-visible:ring-violet-500/50"
                          />
                        </div>
                        <div className="grid gap-2">
                          <Label className="text-foreground/80">
                            Account Name
                          </Label>
                          <Input
                            placeholder="e.g. John Doe"
                            {...register(`paymentMethods.${index}.accountName`)}
                            className="bg-background/50 focus-visible:ring-violet-500/50"
                          />
                        </div>
                        <div className="grid gap-2">
                          <Label className="text-foreground/80">
                            Account Number
                          </Label>
                          <Input
                            placeholder="e.g. 1122334455"
                            {...register(
                              `paymentMethods.${index}.accountNumber`,
                            )}
                            className="bg-background/50 focus-visible:ring-violet-500/50"
                          />
                        </div>
                        <div className="grid gap-2">
                          <Label className="text-foreground/80">
                            Branch Name
                          </Label>
                          <Input
                            placeholder="e.g. Banani"
                            {...register(`paymentMethods.${index}.branchName`)}
                            className="bg-background/50 focus-visible:ring-violet-500/50"
                          />
                        </div>
                      </motion.div>
                    )}

                    {(methodType === "cash" || methodType === "other") && (
                      <motion.div
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="grid gap-2 md:col-span-2"
                      >
                        <Label className="text-foreground/80">
                          Instructions / Details
                        </Label>
                        <Input
                          placeholder="e.g. Hand to hand"
                          {...register(`paymentMethods.${index}.label`)}
                          className="bg-background/50 focus-visible:ring-violet-500/50"
                        />
                      </motion.div>
                    )}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>

        {fields.length === 0 && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-sm text-muted-foreground italic p-8 text-center border-2 border-dashed rounded-2xl border-border/40 bg-muted/10"
          >
            No payment methods added yet. Click "Add Method" to start receiving
            payments.
          </motion.p>
        )}
      </div>
    </div>
  );
}
