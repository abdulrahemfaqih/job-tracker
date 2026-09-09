import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

const COOKIE_NAME = "job_tracker_session";
const SECRET_KEY = new TextEncoder().encode(
  process.env.JWT_SECRET || "job_tracker_super_secret_jwt_key_2026_change_in_production"
);

async function isValidToken(token: string | undefined): Promise<boolean> {
  if (!token) return false;
  try {
    await jwtVerify(token, SECRET_KEY);
    return true;
  } catch {
    return false;
  }
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get(COOKIE_NAME)?.value;
  const authenticated = await isValidToken(token);

  const isAuthRoute = pathname === "/login" || pathname === "/register";
  const isProtectedRoute =
    pathname.startsWith("/dashboard") || pathname.startsWith("/applications");

  // Root route "/"
  if (pathname === "/") {
    if (authenticated) {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // Jika sudah login dan mengakses /login atau /register -> redirect ke /dashboard
  if (isAuthRoute && authenticated) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  // Jika belum login dan mengakses protected route -> redirect ke /login
  if (isProtectedRoute && !authenticated) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes, except if needed)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico, sitemap.xml, robots.txt (metadata files)
     */
    "/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt).*)",
  ],
};
