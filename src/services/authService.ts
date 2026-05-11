/** biome-ignore-all lint/suspicious/noExplicitAny: <> */
"use server";

import { getValidToken } from "@/lib/verifyToken";
import { cookies } from "next/headers";
import { FieldValues } from "react-hook-form";

export const setCookies = async (accessToken: string, refreshToken: string) => {
  (await cookies()).set("accessToken", accessToken, {
    maxAge: 60 * 60 * 24 * 7,
    path: "/",
  });
  (await cookies()).set("refreshToken", refreshToken, {
    maxAge: 60 * 60 * 24 * 30,
    path: "/",
  });
};

export const setAccessToken = async (accessToken: string) => {
  (await cookies()).set("accessToken", accessToken, {
    maxAge: 60 * 60 * 24 * 7,
    path: "/",
  });
};

export const deleteCookie = async () => {
  (await cookies()).delete("accessToken");
  (await cookies()).delete("refreshToken");
};

// login user
export const loginUser = async (data: { email: string; password: string }) => {
  try {
    const res = await fetch(`${process.env.BASE_API}/auth/login`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    const resData = await res.json();

    await setCookies(resData?.data?.accessToken, resData?.data?.refreshToken);

    return resData;
  } catch (error) {
    return error;
  }
};

// region register user
export const registerUser = async (data: {
  name: string;
  email: string;
  password: string;
  role: "staff" | "admin" | "guest";
}) => {
  try {
    const res = await fetch(`${process.env.BASE_API}/auth/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    const resData = await res.json();

    return resData;
  } catch (error) {
    return error;
  }
};

// change password
export const passwordChange = async (userData: FieldValues) => {
  try {
    const res = await fetch(`${process.env.BASE_API}/auth/change-password`, {
      method: "PATCH",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        Authorization: await getValidToken(),
      },
      body: JSON.stringify(userData),
    });

    const result = await res.json();

    return result;
  } catch (error: any) {
    return error;
  }
};

export const forgotPassword = async (email: string) => {
  try {
    const res = await fetch(`${process.env.BASE_API}/auth/forgot-password`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email }),
    });

    return await res.json();
  } catch (error: any) {
    return error;
  }
};

// reset password
export const resetPassword = async (data: {
  code: number;
  password: string;
  email: string;
}) => {
  try {
    const res = await fetch(`${process.env.BASE_API}/auth/reset-password`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    return await res.json();
  } catch (error: any) {
    return error;
  }
};
