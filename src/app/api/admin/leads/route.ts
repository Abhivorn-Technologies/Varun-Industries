import { NextResponse, type NextRequest } from "next/server";
import { isRequestAuthorized } from "@/lib/server/admin-auth";
import { connectToDatabase, isDbConfigured } from "@/lib/server/db";
import { ContactLead } from "@/lib/server/models/ContactLead";

export async function GET(request: NextRequest) {
  if (!isRequestAuthorized(request)) {
    return NextResponse.json({ ok: false, message: "Unauthorized" }, { status: 401 });
  }

  if (!isDbConfigured()) {
    return NextResponse.json({
      ok: false,
      message: "MongoDB is not configured yet. Please add MONGODB_URI in .env.local",
      leads: [],
      dbConfigured: false,
    });
  }

  try {
    await connectToDatabase();
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");
    const search = searchParams.get("search")?.trim();
    const limit = Math.min(Number(searchParams.get("limit") || 100), 200);

    const filter: Record<string, unknown> = {};

    if (status && status !== "all") {
      filter.status = status;
    }

    if (search) {
      filter.$or = [
        { fullName: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
        { phone: { $regex: search, $options: "i" } },
        { company: { $regex: search, $options: "i" } },
        { message: { $regex: search, $options: "i" } },
      ];
    }

    const leads = await ContactLead.find(filter)
      .sort({ createdAt: -1 })
      .limit(limit)
      .lean();

    const counts = {
      all: await ContactLead.countDocuments({}),
      new: await ContactLead.countDocuments({ status: "new" }),
      contacted: await ContactLead.countDocuments({ status: "contacted" }),
      in_progress: await ContactLead.countDocuments({ status: "in_progress" }),
      closed: await ContactLead.countDocuments({ status: "closed" }),
      archived: await ContactLead.countDocuments({ status: "archived" }),
    };

    return NextResponse.json({
      ok: true,
      leads,
      counts,
      dbConfigured: true,
    });
  } catch (error) {
    console.error("[admin-leads] Error:", error);
    return NextResponse.json(
      { ok: false, message: error instanceof Error ? error.message : "Failed to load leads" },
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

    const lead = await ContactLead.create({
      fullName: body.fullName,
      email: body.email,
      phone: body.phone,
      company: body.company || "",
      service: body.service || "General Machining",
      message: body.message,
      status: body.status || "new",
      notes: body.notes || "",
    });

    return NextResponse.json({ ok: true, lead }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { ok: false, message: error instanceof Error ? error.message : "Failed to create lead" },
      { status: 500 }
    );
  }
}
