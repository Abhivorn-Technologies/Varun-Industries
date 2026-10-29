import { NextResponse, type NextRequest } from "next/server";
import {
  isRequestAuthorized,
  signSession,
  ADMIN_COOKIE_OPTIONS,
} from "@/lib/server/admin-auth";
import { connectToDatabase, isDbConfigured } from "@/lib/server/db";
import {
  AdminUser,
  hashAdminPassword,
  generateSalt,
  verifyAdminPassword,
} from "@/lib/server/models/AdminUser";

const CLIENT_DEFAULT_EMAIL = "varunindustries2013@gmail.com";

export async function GET(request: NextRequest) {
  if (!isRequestAuthorized(request)) {
    return NextResponse.json({ ok: false, message: "Unauthorized" }, { status: 401 });
  }

  try {
    if (isDbConfigured()) {
      await connectToDatabase();
      let admin = await AdminUser.findOne().lean();

      if (!admin) {
        // Auto-seed initial admin
        const salt = generateSalt();
        const initialPass = process.env.ADMIN_PASSWORD || "admin123";
        const initialUser = (process.env.ADMIN_USERNAME || "admin").toLowerCase();
        const passwordHash = hashAdminPassword(initialPass, salt);

        admin = await AdminUser.create({
          username: initialUser,
          email: CLIENT_DEFAULT_EMAIL,
          passwordHash,
          salt,
          role: "superadmin",
        });
      }

      return NextResponse.json({
        ok: true,
        profile: {
          username: admin.username,
          email: admin.email || CLIENT_DEFAULT_EMAIL,
          role: admin.role,
          updatedAt: admin.updatedAt,
        },
      });
    }

    return NextResponse.json({
      ok: true,
      profile: {
        username: process.env.ADMIN_USERNAME || "admin",
        email: CLIENT_DEFAULT_EMAIL,
        role: "superadmin",
      },
    });
  } catch (error) {
    return NextResponse.json(
      { ok: false, message: error instanceof Error ? error.message : "Failed to load profile" },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest) {
  if (!isRequestAuthorized(request)) {
    return NextResponse.json({ ok: false, message: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { username, email, currentPassword, newPassword } = body;

    if (!currentPassword) {
      return NextResponse.json(
        { ok: false, message: "Current password is required to verify your identity." },
        { status: 400 }
      );
    }

    if (!username || !email) {
      return NextResponse.json(
        { ok: false, message: "Username and email are required." },
        { status: 400 }
      );
    }

    const cleanUsername = String(username).trim().toLowerCase();
    const cleanEmail = String(email).trim().toLowerCase();

    // Basic email format check
    if (!cleanEmail.includes("@") || !cleanEmail.includes(".")) {
      return NextResponse.json(
        { ok: false, message: "Please provide a valid email address." },
        { status: 400 }
      );
    }

    await connectToDatabase();
    let admin = await AdminUser.findOne();

    if (!admin) {
      // Check current password against env default
      const defaultPass = process.env.ADMIN_PASSWORD || "admin123";
      if (currentPassword !== defaultPass) {
        return NextResponse.json(
          { ok: false, message: "Incorrect current password." },
          { status: 401 }
        );
      }

      const salt = generateSalt();
      const finalPass = newPassword && newPassword.trim().length >= 6 ? newPassword.trim() : currentPassword;
      const passwordHash = hashAdminPassword(finalPass, salt);

      admin = await AdminUser.create({
        username: cleanUsername,
        email: cleanEmail,
        passwordHash,
        salt,
        role: "superadmin",
      });
    } else {
      // Verify against stored passwordHash
      const isValid = verifyAdminPassword(currentPassword, admin.salt, admin.passwordHash);
      if (!isValid) {
        return NextResponse.json(
          { ok: false, message: "Incorrect current password." },
          { status: 401 }
        );
      }

      admin.username = cleanUsername;
      admin.email = cleanEmail;

      if (newPassword && newPassword.trim()) {
        if (newPassword.trim().length < 6) {
          return NextResponse.json(
            { ok: false, message: "New password must be at least 6 characters long." },
            { status: 400 }
          );
        }
        const newSalt = generateSalt();
        admin.salt = newSalt;
        admin.passwordHash = hashAdminPassword(newPassword.trim(), newSalt);
      }

      await admin.save();
    }

    // Refresh session cookie with the new username
    const token = signSession(admin.username);
    const response = NextResponse.json({
      ok: true,
      message: "Credentials updated successfully.",
      profile: {
        username: admin.username,
        email: admin.email,
        updatedAt: admin.updatedAt,
      },
    });

    response.cookies.set({
      ...ADMIN_COOKIE_OPTIONS,
      value: token,
    });

    return response;
  } catch (error) {
    return NextResponse.json(
      { ok: false, message: error instanceof Error ? error.message : "Failed to update profile" },
      { status: 500 }
    );
  }
}
