import { NextResponse, type NextRequest } from "next/server";
import {
  validateAdminCredentials,
  signSession,
  ADMIN_COOKIE_OPTIONS,
} from "@/lib/server/admin-auth";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { username, password } = body;

    if (!username || !password) {
      return NextResponse.json(
        { ok: false, message: "Username and password are required" },
        { status: 400 }
      );
    }

    const { valid, user } = await validateAdminCredentials(String(username), String(password));
    if (!valid || !user) {
      return NextResponse.json(
        { ok: false, message: "Invalid username/email or password." },
        { status: 401 }
      );
    }

    const token = signSession(user.username);
    const response = NextResponse.json({
      ok: true,
      message: "Logged in successfully",
      user: { username: user.username, email: user.email },
    });

    response.cookies.set({
      ...ADMIN_COOKIE_OPTIONS,
      value: token,
    });

    return response;
  } catch (error) {
    console.error("[admin-login] Error:", error);
    return NextResponse.json(
      { ok: false, message: "An unexpected error occurred during login" },
      { status: 500 }
    );
  }
}
