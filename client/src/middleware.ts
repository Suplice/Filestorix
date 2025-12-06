import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

export const middleware = async (req: NextRequest) => {
  const cookieStore = await cookies();
  const token = cookieStore.get("user_auth")?.value;

  const { pathname } = req.nextUrl;

  const isLoggedIn = !!token;

  if (pathname === "/") {
    if (isLoggedIn) {
      return NextResponse.redirect(new URL("/home", req.url));
    } else {
      return NextResponse.redirect(new URL("/auth/signin", req.url));
    }
  }

  if (pathname.startsWith("/home") && !isLoggedIn) {
    return NextResponse.redirect(new URL("/auth/signin", req.url));
  }

  if (pathname.startsWith("/auth") && isLoggedIn) {
    return NextResponse.redirect(new URL("/home", req.url));
  }

  return NextResponse.next();
};

export const config = {
  matcher: ["/", "/home/:path*", "/auth/:path*"],
};
