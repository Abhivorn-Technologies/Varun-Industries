import { NextResponse } from "next/server";
import { connectToDatabase, isDbConfigured } from "@/lib/server/db";
import { CareerJob } from "@/lib/server/models/CareerJob";

export async function GET() {
  if (!isDbConfigured()) {
    return NextResponse.json({ ok: true, jobs: [] });
  }

  try {
    await connectToDatabase();
    const jobs = await CareerJob.find({ status: "active" })
      .sort({ order: 1, createdAt: -1 })
      .lean();

    return NextResponse.json({ ok: true, jobs });
  } catch (error) {
    console.error("[public-jobs] Error:", error);
    return NextResponse.json({ ok: true, jobs: [] });
  }
}
