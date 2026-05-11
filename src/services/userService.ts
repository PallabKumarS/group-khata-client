/** biome-ignore-all lint/suspicious/noExplicitAny: <> */
"use server";

import { getValidToken } from "@/lib/verifyToken";
import { updateTag } from "next/cache";

/**
 * Fetch all users with optional filtering
 */
export const getAllUsers = async (query?: Record<string, unknown>) => {
  const queryString = new URLSearchParams(
    query as Record<string, string>,
  ).toString();
  const token = await getValidToken();

  try {
    const res = await fetch(`${process.env.BASE_API}/users?${queryString}`, {
      next: { tags: ["users"] },
      headers: { Authorization: token },
    });
    return await res.json();
  } catch (error: any) {
    return {
      success: false,
      message: error?.message || "Failed to fetch users",
    };
  }
};

/**
 * Fetch a single user by ID
 */
export const getSingleUser = async (id: string) => {
  const token = await getValidToken();
  try {
    const res = await fetch(`${process.env.BASE_API}/users/${id}`, {
      next: { tags: ["user"] },
      headers: { Authorization: token },
    });
    return await res.json();
  } catch (error: any) {
    return {
      success: false,
      message: error?.message || "Failed to fetch user",
    };
  }
};

/**
 * Fetch currently logged in user info
 */
export const getMe = async () => {
  const token = await getValidToken();

  try {
    const res = await fetch(`${process.env.BASE_API}/users/me`, {
      next: { tags: ["me"] },
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
      },
    });

    return await res.json();
  } catch (error: any) {
    return {
      success: false,
      message: error?.message || "Failed to fetch profile",
    };
  }
};

/**
 * Update user information
 */
export const updateUser = async (id: string, data: any) => {
  const token = await getValidToken();
  try {
    const res = await fetch(`${process.env.BASE_API}/users/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
      },
      body: JSON.stringify(data),
    });

    updateTag("users");
    updateTag("user");
    updateTag("me");

    return await res.json();
  } catch (error: any) {
    return {
      success: false,
      message: error?.message || "Failed to update user",
    };
  }
};

/**
 * Toggle user status (Active/Blocked)
 */
export const toggleUserStatus = async (id: string) => {
  const token = await getValidToken();

  try {
    const res = await fetch(`${process.env.BASE_API}/users/${id}/status`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
      },
    });

    updateTag("users");
    updateTag("user");

    return await res.json();
  } catch (error: any) {
    return {
      success: false,
      message: error?.message || "Failed to update status",
    };
  }
};

/**
 * Update user role (Admin, Manager, User)
 */
export const updateUserRole = async (id: string, role: string) => {
  const token = await getValidToken();

  try {
    const res = await fetch(`${process.env.BASE_API}/users/${id}/role`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: token,
      },
      body: JSON.stringify({ role }),
    });

    updateTag("users");
    updateTag("user");

    return await res.json();
  } catch (error: any) {
    return {
      success: false,
      message: error?.message || "Failed to update role",
    };
  }
};

/**
 * Delete a user account
 */
export const deleteUser = async (id: string) => {
  const token = await getValidToken();

  try {
    const res = await fetch(`${process.env.BASE_API}/users/${id}`, {
      method: "DELETE",
      headers: { Authorization: token },
    });

    updateTag("users");
    updateTag("user");

    return await res.json();
  } catch (error: any) {
    return {
      success: false,
      message: error?.message || "Failed to delete user",
    };
  }
};
