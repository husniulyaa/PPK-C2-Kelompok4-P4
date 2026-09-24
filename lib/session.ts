import { cookies } from "next/headers";
import { SESSION_COOKIE_NAME, THEME_COOKIE_NAME, verifyToken } from "./auth";
import { UserSession } from "./types";

// Retrieve current authenticated user from HTTP-only session cookie
export async function getCurrentUser(): Promise<UserSession | null> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;
    if (!token) return null;
    return await verifyToken(token);
  } catch {
    return null;
  }
}

// Retrieve theme preference from cookie
export async function getThemePreference(): Promise<"light" | "dark"> {
  try {
    const cookieStore = await cookies();
    const theme = cookieStore.get(THEME_COOKIE_NAME)?.value;
    return theme === "light" ? "light" : "dark";
  } catch {
    return "dark";
  }
}
