/** biome-ignore-all lint/suspicious/noExplicitAny: <> */
"use server";

import { getValidToken } from "@/lib/verifyToken";
import { updateTag } from "next/cache";

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
      message: error.message || "Failed to fetch subscriptions",
    };
  }
};

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
      message: error.message || "Failed to fetch manager subscriptions",
    };
  }
};

export const createSubscription = async (data: any) => {
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
      message: error.message || "Failed to create subscription",
    };
  }
};

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
      message: error.message || "Failed to send join request",
    };
  }
};

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
      message: error.message || "Failed to process request",
    };
  }
};

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
      message: error.message || "Failed to kick member",
    };
  }
};
