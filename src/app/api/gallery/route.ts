import { NextResponse } from "next/server";
import { connectToDatabase, isDbConfigured } from "@/lib/server/db";
import { GalleryItem } from "@/lib/server/models/GalleryItem";

export async function GET() {
  if (!isDbConfigured()) {
    // Return empty list; frontend falls back gracefully to static photos.ts
    return NextResponse.json({ ok: true, items: [], dbConfigured: false });
  }

  try {
    await connectToDatabase();
    const items = await GalleryItem.find({ isActive: true })
      .sort({ order: 1, createdAt: -1 })
      .lean();

    return NextResponse.json({ ok: true, items, dbConfigured: true });
  } catch (error) {
    console.error("[public-gallery] Error:", error);
    return NextResponse.json({ ok: true, items: [], dbConfigured: false });
  }
}
