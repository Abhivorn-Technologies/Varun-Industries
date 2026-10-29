import { cookies } from "next/headers";
import { type NextRequest } from "next/server";
import crypto from "crypto";
import { connectToDatabase, isDbConfigured } from "./db";
import {
  AdminUser,
  hashAdminPassword,
  generateSalt,
  verifyAdminPassword,
} from "./models/AdminUser";

const SESSION_COOKIE_NAME = "varun_admin_session";
// Token lifetime ceiling (12 hours) while cookie is stored in memory as a browser session
const SESSION_MAX_AGE_SECONDS = 12 * 60 * 60;
const CLIENT_DEFAULT_EMAIL = "varunindustries2013@gmail.com";

function getSecretKey(): string {
  return process.env.ADMIN_SECRET || "varun-industries-fallback-admin-secret-2026-key";
}

export function getAdminCredentials() {
  const username = process.env.ADMIN_USERNAME || "admin";
  const password = process.env.ADMIN_PASSWORD || "admin123";
  return { username, password, email: CLIENT_DEFAULT_EMAIL };
}

/**
 * Validates admin credentials against MongoDB AdminUser, falling back to .env / client email.
 * If no admin exists in MongoDB, it seeds the initial admin user with client email.
 */
export async function validateAdminCredentials(
  userOrEmail: string,
  pass: string
): Promise<{ valid: boolean; user?: { username: string; email: string } }> {
  const normalized = userOrEmail.trim().toLowerCase();

  if (isDbConfigured()) {
    try {
      await connectToDatabase();
      const existingUser = await AdminUser.findOne({
        $or: [{ username: normalized }, { email: normalized }],
      });

      if (existingUser) {
        const isValid = verifyAdminPassword(pass, existingUser.salt, existingUser.passwordHash);
        if (isValid) {
          return {
            valid: true,
            user: { username: existingUser.username, email: existingUser.email },
          };
        }
        return { valid: false };
      }

      // If no admin user is in DB yet, check against default credentials
      const totalAdmins = await AdminUser.countDocuments();
      if (totalAdmins === 0) {
        const defaultUser = (process.env.ADMIN_USERNAME || "admin").toLowerCase();
        const defaultPass = process.env.ADMIN_PASSWORD || "admin123";
        const defaultEmail = CLIENT_DEFAULT_EMAIL.toLowerCase();

        if ((normalized === defaultUser || normalized === defaultEmail) && pass === defaultPass) {
          // Auto-seed this admin user into MongoDB
          const salt = generateSalt();
          const passwordHash = hashAdminPassword(pass, salt);
          const newAdmin = await AdminUser.create({
            username: defaultUser,
            email: defaultEmail,
            passwordHash,
            salt,
            role: "superadmin",
          });

          return {
            valid: true,
            user: { username: newAdmin.username, email: newAdmin.email },
          };
        }
      }
    } catch (err) {
      console.error("[admin-auth] DB validation error, falling back to env:", err);
    }
  }

  // Fallback if DB is unavailable
  const envUser = (process.env.ADMIN_USERNAME || "admin").toLowerCase();
  const envPass = process.env.ADMIN_PASSWORD || "admin123";
  const clientEmail = CLIENT_DEFAULT_EMAIL.toLowerCase();

  if ((normalized === envUser || normalized === clientEmail) && pass === envPass) {
    return {
      valid: true,
      user: { username: envUser, email: clientEmail },
    };
  }

  return { valid: false };
}

/**
 * Creates a signed token: payload.signature (base64)
 */
export function signSession(user: string): string {
  const payload = JSON.stringify({
    user,
    exp: Date.now() + SESSION_MAX_AGE_SECONDS * 1000,
  });
  const encodedPayload = Buffer.from(payload).toString("base64url");
  const signature = crypto
    .createHmac("sha256", getSecretKey())
    .update(encodedPayload)
    .digest("base64url");
  return `${encodedPayload}.${signature}`;
}

export function verifySessionToken(token: string): { user: string } | null {
  try {
    const parts = token.split(".");
    if (parts.length !== 2) return null;
    const [encodedPayload, signature] = parts;

    const expectedSignature = crypto
      .createHmac("sha256", getSecretKey())
      .update(encodedPayload)
      .digest("base64url");

    if (signature !== expectedSignature) {
      return null;
    }

    const json = Buffer.from(encodedPayload, "base64url").toString("utf8");
    const data = JSON.parse(json);

    if (typeof data.exp !== "number" || data.exp < Date.now()) {
      return null;
    }

    return { user: data.user };
  } catch {
    return null;
  }
}

/**
 * Check if the current request has a valid admin session cookie
 */
export function isRequestAuthorized(request: NextRequest): boolean {
  const cookie = request.cookies.get(SESSION_COOKIE_NAME);
  if (!cookie?.value) return false;
  return Boolean(verifySessionToken(cookie.value));
}

/**
 * Check admin session for Server Components or Server Actions
 */
export async function getServerAdminSession(): Promise<{ user: string } | null> {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get(SESSION_COOKIE_NAME);
  if (!sessionCookie?.value) return null;
  return verifySessionToken(sessionCookie.value);
}

export const ADMIN_COOKIE_NAME = SESSION_COOKIE_NAME;
export const ADMIN_COOKIE_OPTIONS = {
  name: SESSION_COOKIE_NAME,
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax" as const,
  path: "/",
  // Pure session cookie: automatically expires and logs out when user closes browser tab/window
};
