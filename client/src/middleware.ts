// src/middleware.ts
import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

export const middleware = async (req: NextRequest) => {
  const cookieStore = await cookies();
  const token = cookieStore.get("user_auth")?.value;

  if (!token && req.nextUrl.pathname.startsWith("/drive")) {
    return NextResponse.redirect(new URL("/auth/signin", req.url));
  }

  return NextResponse.next();
};

export const config = {
  matcher: ["/drive/:path*"],
};
