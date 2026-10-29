import { NextResponse, type NextRequest } from "next/server";
import { isRequestAuthorized } from "@/lib/server/admin-auth";
import { connectToDatabase } from "@/lib/server/db";
import { CareerJob } from "@/lib/server/models/CareerJob";

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

    if (body.requirements && typeof body.requirements === "string") {
      body.requirements = body.requirements.split("\n").map((s: string) => s.trim()).filter(Boolean);
    }
    if (body.responsibilities && typeof body.responsibilities === "string") {
      body.responsibilities = body.responsibilities.split("\n").map((s: string) => s.trim()).filter(Boolean);
    }

    const job = await CareerJob.findByIdAndUpdate(id, body, { new: true }).lean();
    if (!job) {
      return NextResponse.json({ ok: false, message: "Job not found" }, { status: 404 });
    }

    return NextResponse.json({ ok: true, job });
  } catch (error) {
    return NextResponse.json(
      { ok: false, message: error instanceof Error ? error.message : "Failed to update job" },
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
    const result = await CareerJob.findByIdAndDelete(id);

    if (!result) {
      return NextResponse.json({ ok: false, message: "Job not found" }, { status: 404 });
    }

    return NextResponse.json({ ok: true, message: "Job deleted" });
  } catch (error) {
    return NextResponse.json(
      { ok: false, message: error instanceof Error ? error.message : "Failed to delete job" },
      { status: 500 }
    );
  }
}
