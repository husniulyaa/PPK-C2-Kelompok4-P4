import { NextResponse } from "next/server";
import { THEME_COOKIE_NAME } from "@/lib/auth";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { theme } = body;

    const validatedTheme = theme === "light" ? "light" : "dark";

    const response = NextResponse.json({
      success: true,
      theme: validatedTheme,
    });

    // Store preference in cookie for 1 year
    response.cookies.set({
      name: THEME_COOKIE_NAME,
      value: validatedTheme,
      httpOnly: false, // accessible to client script if needed, but also sent on every HTTP request
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 365, // 1 year
    });

    return response;
  } catch (error: unknown) {
    console.error("Preference update error:", error);
    return NextResponse.json({ error: "Failed to update preference" }, { status: 500 });
  }
}
