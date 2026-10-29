import { NextResponse, type NextRequest } from "next/server";
import { isRequestAuthorized } from "@/lib/server/admin-auth";
import { connectToDatabase } from "@/lib/server/db";
import { ContactLead } from "@/lib/server/models/ContactLead";

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
    const updates = await request.json();

    const allowedFields = ["status", "starred", "notes", "fullName", "email", "phone", "company", "service"];
    const filteredUpdates: Record<string, unknown> = {};

    for (const key of allowedFields) {
      if (key in updates) {
        filteredUpdates[key] = updates[key];
      }
    }

    const lead = await ContactLead.findByIdAndUpdate(id, filteredUpdates, { new: true }).lean();
    if (!lead) {
      return NextResponse.json({ ok: false, message: "Lead not found" }, { status: 404 });
    }

    return NextResponse.json({ ok: true, lead });
  } catch (error) {
    return NextResponse.json(
      { ok: false, message: error instanceof Error ? error.message : "Failed to update lead" },
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
    const result = await ContactLead.findByIdAndDelete(id);

    if (!result) {
      return NextResponse.json({ ok: false, message: "Lead not found" }, { status: 404 });
    }

    return NextResponse.json({ ok: true, message: "Lead deleted" });
  } catch (error) {
    return NextResponse.json(
      { ok: false, message: error instanceof Error ? error.message : "Failed to delete lead" },
      { status: 500 }
    );
  }
}
