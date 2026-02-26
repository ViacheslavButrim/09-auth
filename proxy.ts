import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { cookies } from "next/headers";
import { checkSession } from "@/lib/api/serverApi";
export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("accessToken")?.value;
  const refreshToken = cookieStore.get("refreshToken")?.value;
  const isPrivate =
    pathname.startsWith("/profile") || pathname.startsWith("/notes");
  const isAuthRoute =
    pathname.startsWith("/sign-in") || pathname.startsWith("/sign-up");
  let isAuthenticated = !!accessToken;
  if (!accessToken && refreshToken) {
    try {
      const response = await checkSession();
      if (response?.status === 200) {
        const nextResponse = NextResponse.next();
        const rawSetCookie =
          response.headers && typeof response.headers.get === "function"
            ? response.headers.get("set-cookie")
            : undefined;
        if (rawSetCookie) {
          const cookieString = Array.isArray(rawSetCookie)
            ? rawSetCookie.join("; ")
            : String(rawSetCookie);
          nextResponse.headers.set("set-cookie", cookieString);
        }
        isAuthenticated = true;
        return nextResponse;
      }
    } catch {
      isAuthenticated = false;
    }
  }
  if (!isAuthenticated && isPrivate) {
    return NextResponse.redirect(new URL("/sign-in", request.url));
  }
  if (isAuthenticated && isAuthRoute) {
    return NextResponse.redirect(new URL("/", request.url));
  }
  return NextResponse.next();
}
export const config = {
  matcher: ['/profile'],
};

