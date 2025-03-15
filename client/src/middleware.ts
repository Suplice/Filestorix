// src/middleware.ts
import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

export const middleware = async (req: NextRequest) => {
  const cookieStore = await cookies();
  const token = cookieStore.get("user_auth")?.value;

  const { pathname } = req.nextUrl;

  const isLoggedIn = !!token;

  if (pathname === "/") {
    if (isLoggedIn) {
      return NextResponse.redirect(new URL("/drive", req.url));
    } else {
      return NextResponse.redirect(new URL("/auth/signin", req.url));
    }
  }

  if (pathname.startsWith("/drive") && !isLoggedIn) {
    return NextResponse.redirect(new URL("/auth/signin", req.url));
  }

  if (pathname.startsWith("/auth") && isLoggedIn) {
    return NextResponse.redirect(new URL("/drive", req.url));
  }

  return NextResponse.next();
};

export const config = {
  matcher: ["/", "/drive/:path*", "/auth/:path*"],
};
