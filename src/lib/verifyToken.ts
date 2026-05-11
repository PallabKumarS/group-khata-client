/** biome-ignore-all lint/suspicious/noExplicitAny: <> */
"use server";

import { setAccessToken } from "@/services/authService";
import { jwtDecode } from "jwt-decode";
import { cookies } from "next/headers";

export const isTokenExpired = async (token: string): Promise<boolean> => {
  if (!token) return true;

  try {
    const decoded: { exp: number } = jwtDecode(token);

    return decoded.exp * 1000 < Date.now();
  } catch (err: any) {
    console.error(err);
    return true;
  }
};

export const getValidToken = async (): Promise<string> => {
  const cookieStore = await cookies();

  let token = cookieStore.get("accessToken")?.value;

  if (!token || (await isTokenExpired(token))) {
    const { data } = await getNewToken();
    token = data?.accessToken;
    await setAccessToken(token as string);
  }

  return (token as string) || "";
};

const getNewToken = async () => {
  try {
    const res = await fetch(`${process.env.BASE_API}/auth/refresh-token`, {
      method: "POST",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        Authorization: (await cookies()).get("refreshToken")!.value,
      },
    });

    return await res.json();
  } catch (error: any) {
    return Error(error);
  }
};

export const getCurrentUser = async () => {
  const accessToken = await getValidToken();
  let decodedData = null;

  if (accessToken) {
    decodedData = jwtDecode(accessToken) as DecodedUser;
    return decodedData;
  } else {
    return null;
  }
};

type DecodedUser = {
  id: string;
  role: "admin" | "buyer" | "staff";
  email: string;
  iat: number;
  exp: number;
};
