import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import * as jose from 'jose';

export async function middleware(request: NextRequest) {
  const token = request.cookies.get("token")?.value;

  if (!token) {
    if (request.nextUrl.pathname.startsWith('/cv')) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
    return NextResponse.json({ message: "Missing authentication token" }, { status: 401 });
  }

  try {
    const secret = new TextEncoder().encode(process.env.JWT_SECRET);
    const { payload } = await jose.jwtVerify(token, secret);
    const requestHeaders = new Headers(request.headers);
    requestHeaders.set("user", JSON.stringify({ id: payload.userId, email: payload.email }));

    return NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    });
  } catch {
    if (request.nextUrl.pathname.startsWith('/cv')) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
    return NextResponse.json({ message: "Invalid authentication token" }, { status: 401 });
  }
}

export const config = {
  matcher: ["/api/cv/:path*", "/cv"],
};