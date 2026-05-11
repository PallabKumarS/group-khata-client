/** biome-ignore-all lint/suspicious/noExplicitAny: <> */
"use server";

import { getValidToken } from "@/lib/verifyToken";
import { updateTag } from "next/cache";
import { TCreatePaymentInput } from "@/server/modules/payment/payment.validation";

/**
 * Submit a new payment proof
 */
export const submitPayment = async (data: TCreatePaymentInput) => {
  const token = await getValidToken();

  try {
    const res = await fetch(`${process.env.BASE_API}/payments`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
      },
      body: JSON.stringify(data),
    });

    updateTag("payments-sent");
    updateTag("payments-received");

    return await res.json();
  } catch (error: any) {
    return {
      success: false,
      message: error?.message || "Failed to submit payment",
    };
  }
};

/**
 * Manager verifies or rejects a payment
 */
export const handlePaymentStatus = async (
  id: string,
  status: "verified" | "rejected",
) => {
  const token = await getValidToken();

  try {
    const res = await fetch(`${process.env.BASE_API}/payments/${id}/status`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
      },
      body: JSON.stringify({ status }),
    });

    updateTag("payments-sent");
    updateTag("payments-received");

    return await res.json();
  } catch (error: any) {
    return {
      success: false,
      message: error?.message || "Failed to update payment status",
    };
  }
};

/**
 * Fetch payments sent by the logged-in user
 */
export const getSentPayments = async () => {
  const token = await getValidToken();

  try {
    const res = await fetch(`${process.env.BASE_API}/payments/sent`, {
      next: { tags: ["payments-sent"] },
      headers: { Authorization: token },
    });

    return await res.json();
  } catch (error: any) {
    return {
      success: false,
      message: error?.message || "Failed to fetch sent payments",
    };
  }
};

/**
 * Fetch payments received by the logged-in manager
 */
export const getReceivedPayments = async () => {
  const token = await getValidToken();

  try {
    const res = await fetch(`${process.env.BASE_API}/payments/received`, {
      next: { tags: ["payments-received"] },
      headers: { Authorization: token },
    });

    return await res.json();
  } catch (error: any) {
    return {
      success: false,
      message: error?.message || "Failed to fetch received payments",
    };
  }
};
