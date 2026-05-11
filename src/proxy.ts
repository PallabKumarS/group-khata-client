import { NextResponse, type NextRequest } from "next/server";
import { jwtDecode } from "jwt-decode";
import { TUserRole } from "./types/user.type";

interface DecodedToken {
  userId: string;
  role: TUserRole;
  email: string;
  iat: number;
  exp: number;
}

export function proxy(request: NextRequest) {
  const token = request.cookies.get("accessToken")?.value;
  const { pathname } = request.nextUrl;

  // If no token exists, redirect unauthenticated users trying to access protected routes
  if (!token) {
    if (
      pathname.startsWith("/dashboard") ||
      pathname.startsWith("/users") ||
      pathname.startsWith("/manage")
    ) {
      return NextResponse.redirect(new URL("/login", request.url));
    }
    return NextResponse.next();
  }

  try {
    const decoded = jwtDecode<DecodedToken>(token);

    // Admin guard for /users
    if (pathname.startsWith("/users") && decoded.role !== "admin") {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }

    // Manager/Admin guard for /manage
    if (
      pathname.startsWith("/manage") &&
      decoded.role !== "manager" &&
      decoded.role !== "admin"
    ) {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
    // biome-ignore lint/suspicious/noExplicitAny: <>
  } catch (error: any) {
    // If token is invalid or expired, clear it by redirecting to login
    console.log(error?.message);
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/users/:path*", "/manage/:path*"],
};
