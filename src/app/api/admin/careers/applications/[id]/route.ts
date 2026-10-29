import { NextResponse, type NextRequest } from "next/server";
import { isRequestAuthorized } from "@/lib/server/admin-auth";
import { connectToDatabase } from "@/lib/server/db";
import { CareerApplication } from "@/lib/server/models/CareerApplication";

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function PATCH(request: NextRequest, { params }: RouteParams) {
  if (!isRequestAuthorized(request)) {
    return NextResponse.json({ ok: false, message: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id } = await params;
    await connectToDatabase();
    const body = await request.json();

    const allowed = ["status", "notes"];
    const updates: Record<string, unknown> = {};
    for (const key of allowed) {
      if (key in body) {
        updates[key] = body[key];
      }
    }

    const application = await CareerApplication.findByIdAndUpdate(id, updates, { new: true }).lean();
    if (!application) {
      return NextResponse.json({ ok: false, message: "Application not found" }, { status: 404 });
    }

    return NextResponse.json({ ok: true, application });
  } catch (error) {
    return NextResponse.json(
      { ok: false, message: error instanceof Error ? error.message : "Failed to update application" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest, { params }: RouteParams) {
  if (!isRequestAuthorized(request)) {
    return NextResponse.json({ ok: false, message: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id } = await params;
    await connectToDatabase();
    const result = await CareerApplication.findByIdAndDelete(id);

    if (!result) {
      return NextResponse.json({ ok: false, message: "Application not found" }, { status: 404 });
    }

    return NextResponse.json({ ok: true, message: "Application deleted" });
  } catch (error) {
    return NextResponse.json(
      { ok: false, message: error instanceof Error ? error.message : "Failed to delete application" },
      { status: 500 }
    );
  }
}
