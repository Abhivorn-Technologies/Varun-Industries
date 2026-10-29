import { NextResponse, type NextRequest } from "next/server";
import { isRequestAuthorized } from "@/lib/server/admin-auth";
import { connectToDatabase, isDbConfigured } from "@/lib/server/db";

export async function GET(request: NextRequest) {
  const authorized = isRequestAuthorized(request);
  if (!authorized) {
    return NextResponse.json({ ok: false, authenticated: false }, { status: 401 });
  }

  let dbConnected = false;
  let dbError: string | null = null;

  if (isDbConfigured()) {
    try {
      const conn = await connectToDatabase();
      dbConnected = Boolean(conn && conn.connection.readyState === 1);
    } catch (err) {
      dbError = err instanceof Error ? err.message : "Connection failed";
    }
  }

  return NextResponse.json({
    ok: true,
    authenticated: true,
    dbConfigured: isDbConfigured(),
    dbConnected,
    dbError,
  });
}
