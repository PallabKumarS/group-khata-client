/** biome-ignore-all lint/suspicious/noExplicitAny: <> */
"use server";

import { getValidToken } from "@/lib/verifyToken";
import { updateTag } from "next/cache";
import {
  TCreateSubscriptionInput,
  TUpdateSubscriptionInput,
} from "@/server/modules/subscription/subscription.validation";

/**
 * Fetch all public active subscriptions
 */
export const getAllSubscriptions = async (query?: Record<string, unknown>) => {
  const queryString = new URLSearchParams(
    query as Record<string, string>,
  ).toString();
  const token = await getValidToken();

  try {
    const res = await fetch(
      `${process.env.BASE_API}/subscriptions?${queryString}`,
      {
        next: { tags: ["subscriptions"] },
        headers: { Authorization: token },
      },
    );
    return await res.json();
  } catch (error: any) {
    return {
      success: false,
      message: error?.message || "Failed to fetch subscriptions",
    };
  }
};

/**
 * Fetch subscriptions managed by the logged-in user
 */
export const getManagerSubscriptions = async () => {
  const token = await getValidToken();

  try {
    const res = await fetch(`${process.env.BASE_API}/subscriptions/me`, {
      next: { tags: ["manager-subscriptions"] },
      headers: { Authorization: token },
    });
    return await res.json();
  } catch (error: any) {
    return {
      success: false,
      message: error?.message || "Failed to fetch manager subscriptions",
    };
  }
};

/**
 * Fetch subscriptions where the logged-in user is a member
 */
export const getJoinedSubscriptions = async () => {
  const token = await getValidToken();

  try {
    const res = await fetch(`${process.env.BASE_API}/subscriptions/joined`, {
      next: { tags: ["joined-subscriptions"] },
      headers: { Authorization: token },
    });
    return await res.json();
  } catch (error: any) {
    return {
      success: false,
      message: error?.message || "Failed to fetch joined subscriptions",
    };
  }
};

/**
 * Create a new subscription group
 */
export const createSubscription = async (data: TCreateSubscriptionInput) => {
  const token = await getValidToken();

  try {
    const res = await fetch(`${process.env.BASE_API}/subscriptions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
      },
      body: JSON.stringify(data),
    });

    updateTag("subscriptions");
    updateTag("manager-subscriptions");

    return await res.json();
  } catch (error: any) {
    return {
      success: false,
      message: error?.message || "Failed to create subscription",
    };
  }
};

/**
 * Send a request to join a subscription
 */
export const requestToJoin = async (id: string) => {
  const token = await getValidToken();

  try {
    const res = await fetch(
      `${process.env.BASE_API}/subscriptions/${id}/join`,
      {
        method: "POST",
        headers: { Authorization: token },
      },
    );

    updateTag("subscriptions");

    return await res.json();
  } catch (error: any) {
    return {
      success: false,
      message: error?.message || "Failed to send join request",
    };
  }
};

/**
 * Manager accepts or rejects a join request
 */
export const handleJoinRequest = async (
  subId: string,
  reqId: string,
  status: "accepted" | "rejected",
) => {
  const token = await getValidToken();

  try {
    const res = await fetch(
      `${process.env.BASE_API}/subscriptions/${subId}/requests/${reqId}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
        body: JSON.stringify({ status }),
      },
    );

    updateTag("manager-subscriptions");

    return await res.json();
  } catch (error: any) {
    return {
      success: false,
      message: error?.message || "Failed to process request",
    };
  }
};

/**
 * Manager kicks a member from the group
 */
export const kickMember = async (
  subId: string,
  userId: string,
  reason: string,
  ss?: string,
) => {
  const token = await getValidToken();

  try {
    const res = await fetch(
      `${process.env.BASE_API}/subscriptions/${subId}/kick`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
        body: JSON.stringify({ userId, reason, ss }),
      },
    );

    updateTag("manager-subscriptions");

    return await res.json();
  } catch (error: any) {
    return {
      success: false,
      message: error?.message || "Failed to kick member",
    };
  }
};

/**
 * Manager sends payment reminders to unpaid members
 */
export const sendReminders = async (id: string) => {
  const token = await getValidToken();

  try {
    const res = await fetch(
      `${process.env.BASE_API}/subscriptions/${id}/reminders`,
      {
        method: "POST",
        headers: { Authorization: token },
      },
    );

    return await res.json();
  } catch (error: any) {
    return {
      success: false,
      message: error?.message || "Failed to send reminders",
    };
  }
};

/**
 * Update subscription details
 */
export const updateSubscription = async (
  id: string,
  data: TUpdateSubscriptionInput,
) => {
  const token = await getValidToken();

  try {
    const res = await fetch(`${process.env.BASE_API}/subscriptions/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
      },
      body: JSON.stringify(data),
    });

    updateTag("subscriptions");
    updateTag("manager-subscriptions");

    return await res.json();
  } catch (error: any) {
    return {
      success: false,
      message: error?.message || "Failed to update subscription",
    };
  }
};

/**
 * Delete a subscription group
 */
export const deleteSubscription = async (id: string) => {
  const token = await getValidToken();

  try {
    const res = await fetch(`${process.env.BASE_API}/subscriptions/${id}`, {
      method: "DELETE",
      headers: { Authorization: token },
    });

    updateTag("subscriptions");
    updateTag("manager-subscriptions");

    return await res.json();
  } catch (error: any) {
    return {
      success: false,
      message: error?.message || "Failed to delete subscription",
    };
  }
};
