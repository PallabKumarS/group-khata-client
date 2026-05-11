import { NextRequest } from "next/server";

export const proxy = async (req: NextRequest) => {};

export const config = {
  matcher: ["/dashboard/:path*"],
};
