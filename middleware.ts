import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import * as jose from 'jose';

export async function middleware(request: NextRequest) {
  // Check if the route is one of our public routes
  const isPublicApiRoute = /^\/api\/cv\/[^\/]+$/.test(request.nextUrl.pathname); // Matches /api/cv/{id}
  const isPublicCvRoute = /^\/cv\/[^\/]+$/.test(request.nextUrl.pathname); // Matches /cv/{id}
  
  // If it's a public route, allow access without authentication
  if (isPublicApiRoute || isPublicCvRoute) {
    return NextResponse.next();
  }

  const token = request.cookies.get("token")?.value;

  // Handle missing token
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
  matcher: [
    // Protected routes
    "/api/cv",
    "/cv",
    // Public routes (still need to go through middleware for consistent handling)
    "/api/cv/:id*",
    "/cv/:id*"
  ],
};