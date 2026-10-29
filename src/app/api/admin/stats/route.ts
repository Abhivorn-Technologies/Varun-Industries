import { NextResponse, type NextRequest } from "next/server";
import { isRequestAuthorized } from "@/lib/server/admin-auth";
import { connectToDatabase, isDbConfigured } from "@/lib/server/db";
import { ContactLead } from "@/lib/server/models/ContactLead";
import { CareerApplication } from "@/lib/server/models/CareerApplication";
import { CareerJob } from "@/lib/server/models/CareerJob";
import { GalleryItem } from "@/lib/server/models/GalleryItem";

export async function GET(request: NextRequest) {
  if (!isRequestAuthorized(request)) {
    return NextResponse.json({ ok: false, message: "Unauthorized" }, { status: 401 });
  }

  const dbConfigured = isDbConfigured();
  if (!dbConfigured) {
    return NextResponse.json({
      ok: true,
      dbConfigured: false,
      dbConnected: false,
      stats: {
        totalLeads: 0,
        newLeads: 0,
        totalApplications: 0,
        newApplications: 0,
        activeJobs: 0,
        totalGalleryItems: 0,
      },
      recentLeads: [],
      recentApplications: [],
    });
  }

  try {
    const conn = await connectToDatabase();
    const dbConnected = Boolean(conn && conn.connection.readyState === 1);

    const [
      totalLeads,
      newLeads,
      totalApplications,
      newApplications,
      activeJobs,
      totalGalleryItems,
      recentLeads,
      recentApplications,
    ] = await Promise.all([
      ContactLead.countDocuments({}),
      ContactLead.countDocuments({ status: "new" }),
      CareerApplication.countDocuments({}),
      CareerApplication.countDocuments({ status: "new" }),
      CareerJob.countDocuments({ status: "active" }),
      GalleryItem.countDocuments({}),
      ContactLead.find({}).sort({ createdAt: -1 }).limit(5).lean(),
      CareerApplication.find({}).sort({ createdAt: -1 }).limit(5).lean(),
    ]);

    return NextResponse.json({
      ok: true,
      dbConfigured: true,
      dbConnected,
      stats: {
        totalLeads,
        newLeads,
        totalApplications,
        newApplications,
        activeJobs,
        totalGalleryItems,
      },
      recentLeads,
      recentApplications,
    });
  } catch (error) {
    return NextResponse.json({
      ok: true,
      dbConfigured: true,
      dbConnected: false,
      dbError: error instanceof Error ? error.message : "Database error",
      stats: {
        totalLeads: 0,
        newLeads: 0,
        totalApplications: 0,
        newApplications: 0,
        activeJobs: 0,
        totalGalleryItems: 0,
      },
      recentLeads: [],
      recentApplications: [],
    });
  }
}
