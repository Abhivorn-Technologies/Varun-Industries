import { NextResponse, type NextRequest } from "next/server";
import { isRequestAuthorized } from "@/lib/server/admin-auth";
import { connectToDatabase, isDbConfigured } from "@/lib/server/db";
import { CareerApplication } from "@/lib/server/models/CareerApplication";

export async function GET(request: NextRequest) {
  if (!isRequestAuthorized(request)) {
    return NextResponse.json({ ok: false, message: "Unauthorized" }, { status: 401 });
  }

  if (!isDbConfigured()) {
    return NextResponse.json({
      ok: false,
      message: "MongoDB not configured",
      applications: [],
      dbConfigured: false,
    });
  }

  try {
    await connectToDatabase();
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");
    const search = searchParams.get("search")?.trim();

    const filter: Record<string, unknown> = {};
    if (status && status !== "all") {
      filter.status = status;
    }
    if (search) {
      filter.$or = [
        { fullName: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
        { phone: { $regex: search, $options: "i" } },
        { position: { $regex: search, $options: "i" } },
        { reference: { $regex: search, $options: "i" } },
      ];
    }

    const applications = await CareerApplication.find(filter)
      .sort({ createdAt: -1 })
      .limit(100)
      .lean();

    const counts = {
      all: await CareerApplication.countDocuments({}),
      new: await CareerApplication.countDocuments({ status: "new" }),
      reviewing: await CareerApplication.countDocuments({ status: "reviewing" }),
      shortlisted: await CareerApplication.countDocuments({ status: "shortlisted" }),
      interviewed: await CareerApplication.countDocuments({ status: "interviewed" }),
      hired: await CareerApplication.countDocuments({ status: "hired" }),
      rejected: await CareerApplication.countDocuments({ status: "rejected" }),
    };

    return NextResponse.json({
      ok: true,
      applications,
      counts,
      dbConfigured: true,
    });
  } catch (error) {
    return NextResponse.json(
      { ok: false, message: error instanceof Error ? error.message : "Failed to load applications" },
      { status: 500 }
    );
  }
}
