import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

const SESSION_COOKIE_NAME = "student_expense_session";
const JWT_SECRET = process.env.JWT_SECRET || "student-expense-tracker-secret-key-super-secure-2026";
const key = new TextEncoder().encode(JWT_SECRET);


async function isValidSession(token?: string): Promise<boolean> {
  if (!token) return false;
  try {
    const { payload } = await jwtVerify(token, key, {
      algorithms: ["HS256"],
    });
    return !!payload?.id;
  } catch {
    return false;
  }
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get(SESSION_COOKIE_NAME)?.value;
  const isAuthenticated = await isValidSession(token);

  // Protected paths requiring login
  const isProtectedPath = pathname.startsWith("/dashboard");
  const isAuthPage = pathname === "/login" || pathname === "/register";

  if (isProtectedPath && !isAuthenticated) {
    const url = new URL("/login", request.url);
    url.searchParams.set("redirect", pathname);
    return NextResponse.redirect(url);
  }

  if (isAuthPage && isAuthenticated) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  // Protected API transactions route
  if (pathname.startsWith("/api/transactions") && !isAuthenticated) {
    return NextResponse.json(
      { error: "Unauthorized: Please log in to access transactions" },
      { status: 401 }
    );
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/login",
    "/register",
    "/api/transactions/:path*",
  ],
};
