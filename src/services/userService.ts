/** biome-ignore-all lint/suspicious/noExplicitAny: <> */
"use server";

import { getValidToken } from "@/lib/verifyToken";
import { updateTag } from "next/cache";

// Get all users
export const getAllUsers = async (
  query?: Record<string, unknown>,
): Promise<any> => {
  const queryString = new URLSearchParams(
    query as Record<string, string>,
  ).toString();

  try {
    const res = await fetch(`${process.env.BASE_API}/users?${queryString}`, {
      next: {
        tags: ["users"],
      },
      headers: {
        Authorization: await getValidToken(),
      },
    });
    return await res.json();
  } catch (error: any) {
    return error;
  }
};

// Get single user
export const getSingleUser = async (id: string): Promise<any> => {
  const token = await getValidToken();
  try {
    const res = await fetch(`${process.env.BASE_API}/users/${id}`, {
      next: {
        tags: ["user"],
      },
      headers: {
        Authorization: token,
      },
    });
    return await res.json();
  } catch (error: any) {
    return error;
  }
};

// get personal info
export const getMe = async (): Promise<any> => {
  const token = await getValidToken();

  try {
    const res = await fetch(`${process.env.BASE_API}/users/me`, {
      next: {
        tags: ["me"],
      },
      headers: {
        "content-type": "application/json",
        Authorization: token,
      },
    });

    const data = await res.json();

    return data;
  } catch (error: any) {
    return error;
  }
};

// update user
export const updateUser = async (id: string, data: any): Promise<any> => {
  const token = await getValidToken();
  try {
    const res = await fetch(`${process.env.BASE_API}/users/${id}`, {
      method: "PATCH",
      headers: {
        "content-type": "application/json",
        Authorization: token,
      },
      body: JSON.stringify(data),
    });

    updateTag("users");
    updateTag("user");
    updateTag("me");

    return await res.json();
  } catch (error: any) {
    return error;
  }
};

// update user status
export const updateUserStatus = async (
  id: string,
  status: string,
): Promise<any> => {
  const token = await getValidToken();

  try {
    const res = await fetch(`${process.env.BASE_API}/users/${id}/status`, {
      method: "PATCH",
      headers: {
        "content-type": "application/json",
        Authorization: token,
      },

      body: JSON.stringify({ status }),
    });

    updateTag("users");
    updateTag("user");
    updateTag("me");

    return await res.json();
  } catch (error: any) {
    return error;
  }
};

// update user role
export const updateUserRole = async (
  id: string,
  role: string,
): Promise<any> => {
  const token = await getValidToken();

  try {
    const res = await fetch(`${process.env.BASE_API}/users/${id}/role`, {
      method: "PATCH",
      headers: {
        "content-type": "application/json",
        Authorization: token,
      },
      body: JSON.stringify({ role }),
    });

    updateTag("users");
    updateTag("user");
    updateTag("me");

    return await res.json();
  } catch (error: any) {
    return error;
  }
};

// Delete user
export const deleteUser = async (id: string): Promise<any> => {
  const token = await getValidToken();

  try {
    const res = await fetch(`${process.env.BASE_API}/users/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: token,
      },
    });

    updateTag("users");
    updateTag("user");
    updateTag("me");

    return await res.json();
  } catch (error: any) {
    return error;
  }
};
