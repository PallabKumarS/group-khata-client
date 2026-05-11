"use client";

import {
  CheckCircle2,
  XCircle,
  Clock,
  Eye,
  Calendar,
  Wallet,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { TPayment } from "@/types/payment.type";

interface PaymentHistoryTableProps {
  payments: TPayment[];
  onView: (payment: TPayment) => void;
}

export function PaymentHistoryTable({
  payments,
  onView,
}: PaymentHistoryTableProps) {
  if (payments.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 px-4 rounded-3xl border border-dashed border-border/60 bg-muted/10 text-center space-y-4">
        <div className="text-muted-foreground/30">
          <Wallet className="w-12 h-12" />
        </div>
        <p className="text-muted-foreground font-medium">
          No payment history found.
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-4">
      {payments.map((payment) => (
        <div
          key={payment._id}
          className="group flex items-center justify-between p-4 rounded-2xl border border-border/40 bg-card/40 backdrop-blur-md hover:bg-card/60 transition-all"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-violet-600/10 flex items-center justify-center text-violet-600 group-hover:bg-violet-600 group-hover:text-white transition-colors">
              <Wallet className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-foreground">
                {payment.subscription?.name || "Unknown Group"}
              </h4>
              <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
                <span className="flex items-center gap-1">
                  <Calendar className="w-3 h-3" /> {payment.month}{" "}
                  {payment.year}
                </span>
                <span>•</span>
                <span className="font-semibold text-violet-600">
                  ৳{payment.amount}
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <StatusBadge status={payment.status} />
            <Button
              size="icon"
              variant="ghost"
              onClick={() => onView(payment)}
              className="rounded-full hover:bg-violet-600/10 hover:text-violet-600"
            >
              <Eye className="w-4 h-4" />
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
}

export function StatusBadge({ status }: { status: string }) {
  switch (status) {
    case "verified":
      return (
        <Badge className="bg-green-500/10 text-green-600 border-green-500/20 gap-1">
          <CheckCircle2 className="w-3 h-3" /> Verified
        </Badge>
      );
    case "rejected":
      return (
        <Badge className="bg-red-500/10 text-red-600 border-red-500/20 gap-1">
          <XCircle className="w-3 h-3" /> Rejected
        </Badge>
      );
    default:
      return (
        <Badge className="bg-orange-500/10 text-orange-600 border-orange-500/20 gap-1">
          <Clock className="w-3 h-3" /> Pending
        </Badge>
      );
  }
}
