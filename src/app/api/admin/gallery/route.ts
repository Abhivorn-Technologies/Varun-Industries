import { NextResponse, type NextRequest } from "next/server";
import { isRequestAuthorized } from "@/lib/server/admin-auth";
import { connectToDatabase, isDbConfigured } from "@/lib/server/db";
import { GalleryItem } from "@/lib/server/models/GalleryItem";

export async function GET(request: NextRequest) {
  if (!isRequestAuthorized(request)) {
    return NextResponse.json({ ok: false, message: "Unauthorized" }, { status: 401 });
  }

  if (!isDbConfigured()) {
    return NextResponse.json({
      ok: false,
      message: "MongoDB not configured",
      items: [],
      dbConfigured: false,
    });
  }

  try {
    await connectToDatabase();
    const { searchParams } = new URL(request.url);
    const category = searchParams.get("category");
    const filter: Record<string, unknown> = {};

    if (category && category !== "all") {
      filter.category = category;
    }

    const items = await GalleryItem.find(filter).sort({ order: 1, createdAt: -1 }).lean();
    return NextResponse.json({ ok: true, items, dbConfigured: true });
  } catch (error) {
    return NextResponse.json(
      { ok: false, message: error instanceof Error ? error.message : "Failed to load gallery items" },
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

    if (!body.title || !body.imageUrl || !body.caption) {
      return NextResponse.json(
        { ok: false, message: "Title, image URL, and caption are required" },
        { status: 400 }
      );
    }

    const highestOrder = await GalleryItem.findOne().sort({ order: -1 }).select("order").lean();
    const nextOrder = (highestOrder?.order ?? 0) + 1;

    const item = await GalleryItem.create({
      title: body.title,
      caption: body.caption,
      alt: body.alt || body.title,
      imageUrl: body.imageUrl,
      category: body.category || "Machined Parts",
      dimensions: body.dimensions || "",
      order: typeof body.order === "number" ? body.order : nextOrder,
      isActive: body.isActive !== undefined ? Boolean(body.isActive) : true,
    });

    return NextResponse.json({ ok: true, item }, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      { ok: false, message: error instanceof Error ? error.message : "Failed to create gallery item" },
      { status: 500 }
    );
  }
}
