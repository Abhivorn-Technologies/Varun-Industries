import { NextResponse, type NextRequest } from "next/server";
import { isRequestAuthorized } from "@/lib/server/admin-auth";
import { connectToDatabase } from "@/lib/server/db";
import { GalleryItem } from "@/lib/server/models/GalleryItem";

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

    const allowed = ["title", "caption", "alt", "imageUrl", "category", "dimensions", "order", "isActive"];
    const updates: Record<string, unknown> = {};
    for (const key of allowed) {
      if (key in body) {
        updates[key] = body[key];
      }
    }

    const item = await GalleryItem.findByIdAndUpdate(id, updates, { new: true }).lean();
    if (!item) {
      return NextResponse.json({ ok: false, message: "Item not found" }, { status: 404 });
    }

    return NextResponse.json({ ok: true, item });
  } catch (error) {
    return NextResponse.json(
      { ok: false, message: error instanceof Error ? error.message : "Failed to update item" },
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
    const result = await GalleryItem.findByIdAndDelete(id);

    if (!result) {
      return NextResponse.json({ ok: false, message: "Item not found" }, { status: 404 });
    }

    return NextResponse.json({ ok: true, message: "Item deleted" });
  } catch (error) {
    return NextResponse.json(
      { ok: false, message: error instanceof Error ? error.message : "Failed to delete item" },
      { status: 500 }
    );
  }
}
