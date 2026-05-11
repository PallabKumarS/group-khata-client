"use client";

import { useState, useEffect, useCallback } from "react";
import { CreditCard, History, Plus, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  getSentPayments,
  getReceivedPayments,
  handlePaymentStatus,
} from "@/services/paymentService";
import { getJoinedSubscriptions } from "@/services/subscriptionService";
import { PaymentHistoryTable } from "./components/PaymentHistoryTable";
import { SubmitPaymentDialog } from "./components/SubmitPaymentDialog";
import { PaymentDetailsDialog } from "./components/PaymentDetailsDialog";
import { TPayment } from "@/types/payment.type";
import { TSubscription } from "@/types/subscription.type";
import Container from "@/components/shared/Container";

export default function PaymentsPage() {
  const [activeTab, setActiveTab] = useState("sent");
  const [sentPayments, setSentPayments] = useState<TPayment[]>([]);
  const [receivedPayments, setReceivedPayments] = useState<TPayment[]>([]);
  const [mySubscriptions, setMySubscriptions] = useState<TSubscription[]>([]);
  const [loading, setLoading] = useState(true);
  const [payDialogOpen, setPayDialogOpen] = useState(false);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [selectedPayment, setSelectedPayment] = useState<TPayment | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [sent, received, subs] = await Promise.all([
        getSentPayments(),
        getReceivedPayments(),
        getJoinedSubscriptions(),
      ]);

      if (sent.success) setSentPayments(sent.data);
      if (received.success) setReceivedPayments(received.data);
      if (subs.success) setMySubscriptions(subs.data);
      // biome-ignore lint/suspicious/noExplicitAny: <>
    } catch (error: any) {
      toast.error(error?.message || "Failed to fetch payment data");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const onStatusUpdate = async (
    id: string,
    status: "verified" | "rejected",
  ) => {
    const res = await handlePaymentStatus(id, status);
    if (res.success) {
      toast.success(`Payment ${status} successfully`);
      setViewDialogOpen(false);
      fetchData();
    } else {
      toast.error(res.message || "Failed to update status");
    }
  };

  const handleViewPayment = (payment: TPayment) => {
    setSelectedPayment(payment);
    setViewDialogOpen(true);
  };

  return (
    <Container>
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-4xl font-bold bg-linear-to-r from-violet-600 to-indigo-600 bg-clip-text text-transparent">
            Payment History
          </h1>
          <p className="text-muted-foreground mt-2">
            Manage your subscriptions and track your payments
          </p>
        </div>
        <Button
          onClick={() => setPayDialogOpen(true)}
          className="bg-violet-600 hover:bg-violet-700 text-white rounded-2xl px-6 py-6 h-auto shadow-lg shadow-violet-500/20 gap-2"
        >
          <Plus className="w-5 h-5" />
          Submit Payment
        </Button>
      </div>

      {/* Tabs Section */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full max-w-md grid-cols-2 bg-muted/20 p-1 rounded-2xl h-12">
          <TabsTrigger
            value="sent"
            className="rounded-xl data-[state=active]:bg-card data-[state=active]:shadow-sm"
          >
            <History className="w-4 h-4 mr-2" />
            Sent
          </TabsTrigger>
          <TabsTrigger
            value="received"
            className="rounded-xl data-[state=active]:bg-card data-[state=active]:shadow-sm"
          >
            <CreditCard className="w-4 h-4 mr-2" />
            Received
          </TabsTrigger>
        </TabsList>

        <div className="mt-8">
          {loading ? (
            <div className="flex justify-center py-20">
              <Loader2 className="w-10 h-10 animate-spin text-violet-500" />
            </div>
          ) : (
            <>
              <TabsContent value="sent">
                <PaymentHistoryTable
                  payments={sentPayments}
                  onView={handleViewPayment}
                />
              </TabsContent>

              <TabsContent value="received">
                <PaymentHistoryTable
                  payments={receivedPayments}
                  onView={handleViewPayment}
                />
              </TabsContent>
            </>
          )}
        </div>
      </Tabs>

      {/* Modals */}
      <SubmitPaymentDialog
        open={payDialogOpen}
        onOpenChange={setPayDialogOpen}
        subscriptions={mySubscriptions}
        onSuccess={fetchData}
      />

      <PaymentDetailsDialog
        open={viewDialogOpen}
        onOpenChange={setViewDialogOpen}
        payment={selectedPayment}
        isManager={activeTab === "received"}
        onStatusUpdate={onStatusUpdate}
      />
    </Container>
  );
}
