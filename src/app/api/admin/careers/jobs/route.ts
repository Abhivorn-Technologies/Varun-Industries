import { NextResponse, type NextRequest } from "next/server";
import { isRequestAuthorized } from "@/lib/server/admin-auth";
import { connectToDatabase, isDbConfigured } from "@/lib/server/db";
import { CareerJob } from "@/lib/server/models/CareerJob";

export async function GET(request: NextRequest) {
  if (!isRequestAuthorized(request)) {
    return NextResponse.json({ ok: false, message: "Unauthorized" }, { status: 401 });
  }

  if (!isDbConfigured()) {
    return NextResponse.json({
      ok: false,
      message: "MongoDB not configured",
      jobs: [],
      dbConfigured: false,
    });
  }

  try {
    await connectToDatabase();
    const jobs = await CareerJob.find({}).sort({ order: 1, createdAt: -1 }).lean();
    return NextResponse.json({ ok: true, jobs, dbConfigured: true });
  } catch (error) {
    return NextResponse.json(
      { ok: false, message: error instanceof Error ? error.message : "Failed to load jobs" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  if (!isRequestAuthorized(request)) {
    return NextResponse.json({ ok: false, message: "Unauthorized" }, { status: 401 });
  }

  try {
    await connectToDatabase();
    const body = await request.json();

    const requirements = Array.isArray(body.requirements)
      ? body.requirements
      : typeof body.requirements === "string"
      ? body.requirements.split("\n").map((s: string) => s.trim()).filter(Boolean)
      : [];

    const responsibilities = Array.isArray(body.responsibilities)
      ? body.responsibilities
      : typeof body.responsibilities === "string"
      ? body.responsibilities.split("\n").map((s: string) => s.trim()).filter(Boolean)
      : [];

    const job = await CareerJob.create({
      title: body.title,
      department: body.department || "Machining & Production",
      location: body.location || "Hyderabad, Telangana",
      jobType: body.jobType || "Full Time",
      experience: body.experience || "1–3 years",
      openings: Number(body.openings) || 1,
      description: body.description,
      requirements,
      responsibilities,
      status: body.status || "active",
      order: Number(body.order) || 0,
    });

    return NextResponse.json({ ok: true, job }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { ok: false, message: error instanceof Error ? error.message : "Failed to create job" },
      { status: 500 }
    );
  }
}
