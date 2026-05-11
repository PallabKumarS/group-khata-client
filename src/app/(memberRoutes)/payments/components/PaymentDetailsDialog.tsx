"use client";

import { format } from "date-fns";
import { CheckCircle2, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { StatusBadge } from "./PaymentHistoryTable";
import { TPayment } from "@/types/payment.type";
import Image from "next/image";

interface PaymentDetailsDialogProps {
  payment: TPayment | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  isManager: boolean;
  onStatusUpdate?: (
    id: string,
    status: "verified" | "rejected",
  ) => Promise<void>;
}

export function PaymentDetailsDialog({
  payment,
  open,
  onOpenChange,
  isManager,
  onStatusUpdate,
}: PaymentDetailsDialogProps) {
  if (!payment) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] border-border/40 bg-card/95 backdrop-blur-xl overflow-hidden">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            Payment for {payment.subscription?.name}
            <StatusBadge status={payment.status} />
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-6 mt-4">
          <div className="grid grid-cols-2 gap-6 p-4 rounded-2xl bg-muted/20">
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">
                Amount
              </p>
              <p className="text-2xl font-bold">৳{payment.amount}</p>
            </div>
            <div className="space-y-1 text-right">
              <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">
                Period
              </p>
              <p className="font-medium">
                {payment.months.join(", ")} {payment.year}
              </p>
            </div>
            <div className="space-y-1">
              <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">
                Method
              </p>
              <p className="font-medium">{payment.paymentMethod}</p>
            </div>
            <div className="space-y-1 text-right">
              <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">
                Date
              </p>
              <p className="font-medium text-sm">
                {payment.createdAt
                  ? format(new Date(payment.createdAt), "PPP")
                  : "N/A"}
              </p>
            </div>
          </div>

          <div className="space-y-2">
            <p className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">
              Proof Screenshot
            </p>
            <div className="relative rounded-2xl overflow-hidden border border-border/40 bg-black/10 group cursor-zoom-in">
              <Image
                src={payment.ss}
                alt="Payment proof"
                width={700}
                height={350}
                className="mx-auto w-80"
              />
            </div>
          </div>

          {isManager && payment.status === "pending" && onStatusUpdate && (
            <div className="flex gap-3 pt-2">
              <Button
                className="flex-1 bg-green-600 hover:bg-green-700 gap-2"
                onClick={() => onStatusUpdate(payment._id, "verified")}
              >
                <CheckCircle2 className="w-4 h-4" /> Verify Payment
              </Button>
              <Button
                variant="destructive"
                className="flex-1 gap-2"
                onClick={() => onStatusUpdate(payment._id, "rejected")}
              >
                <XCircle className="w-4 h-4" /> Reject
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
