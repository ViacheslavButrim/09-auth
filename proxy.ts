import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isAuth = request.cookies.get("accessToken");

  const isPrivate =
    pathname.startsWith("/profile") || pathname.startsWith("/notes");

  const isAuthRoute =
    pathname.startsWith("/sign-in") || pathname.startsWith("/sign-up");

  if (!isAuth && isPrivate) {
    return NextResponse.redirect(new URL("/sign-in", request.url));
  }

  if (isAuth && isAuthRoute) {
    return NextResponse.redirect(new URL("/profile", request.url));
  }

  return NextResponse.next();
}