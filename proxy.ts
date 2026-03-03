import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { parse } from 'cookie';
import { checkServerSession } from './lib/api/serverApi';

const privateRoutes = ['/profile', '/notes'];
const publicRoutes = ['/sign-in', '/sign-up'];

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const cookieStore = await cookies();
  const accessToken = cookieStore.get('accessToken')?.value;
  const refreshToken = cookieStore.get('refreshToken')?.value;

  const isPublicRoute = publicRoutes.some((route) =>
    pathname.startsWith(route)
  );

  const isPrivateRoute = privateRoutes.some((route) =>
    pathname.startsWith(route)
  );

  if (accessToken) {
    if (isPublicRoute) {
      return NextResponse.redirect(new URL('/profile', request.url));
    }
    return NextResponse.next();
  }

  if (!accessToken && refreshToken && isPrivateRoute) {
    try {
      const data = await checkServerSession();

      const setCookie = data?.headers?.['set-cookie'];

      if (setCookie) {
        const response = NextResponse.next();

        const cookieArray = Array.isArray(setCookie)
          ? setCookie
          : [setCookie];

        for (const cookieStr of cookieArray) {
          const parsed = parse(cookieStr);

          const options = {
            expires: parsed.Expires
              ? new Date(parsed.Expires)
              : undefined,
            path: parsed.Path || '/',
            maxAge: parsed['Max-Age']
              ? Number(parsed['Max-Age'])
              : undefined,
            httpOnly: true,
          };

          if (parsed.accessToken) {
            response.cookies.set(
              'accessToken',
              parsed.accessToken,
              options
            );
          }

          if (parsed.refreshToken) {
            response.cookies.set(
              'refreshToken',
              parsed.refreshToken,
              options
            );
          }
        }

        return response;
      }
    } catch {
      const response = NextResponse.redirect(
        new URL('/sign-in', request.url)
      );

      response.cookies.delete('accessToken');
      response.cookies.delete('refreshToken');

      return response;
    }
  }

  if (!accessToken && isPrivateRoute) {
    return NextResponse.redirect(new URL('/sign-in', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/profile/:path*',
    '/notes/:path*',
    '/sign-in',
    '/sign-up',
  ],
};