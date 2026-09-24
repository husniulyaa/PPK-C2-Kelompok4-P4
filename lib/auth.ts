import bcrypt from "bcryptjs";
import { SignJWT, jwtVerify } from "jose";
import { UserSession } from "./types";

const JWT_SECRET = process.env.JWT_SECRET || "student-expense-tracker-secret-key-super-secure-2026";
const key = new TextEncoder().encode(JWT_SECRET);

export const SESSION_COOKIE_NAME = "student_expense_session";
export const THEME_COOKIE_NAME = "theme_preference";

// Hash plain text password using bcrypt
export async function hashPassword(password: string): Promise<string> {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
}

// Compare plain text password with hashed password
export async function verifyPassword(password: string, hashed: string): Promise<boolean> {
  return bcrypt.compare(password, hashed);
}

// Sign JWT token for user session
export async function signToken(payload: UserSession): Promise<string> {
  return new SignJWT({ ...payload })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(key);
}

// Verify JWT token and extract session
export async function verifyToken(token: string): Promise<UserSession | null> {
  try {
    const { payload } = await jwtVerify(token, key, {
      algorithms: ["HS256"],
    });
    return {
      id: Number(payload.id),
      email: String(payload.email),
      name: String(payload.name),
    };
  } catch {
    return null;
  }
}
