import { NextResponse, type NextRequest } from "next/server";
import { isRequestAuthorized } from "@/lib/server/admin-auth";
import fs from "fs/promises";
import path from "path";

const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp", "image/avif"];
const MAX_IMAGE_SIZE = 10 * 1024 * 1024; // 10MB

export async function POST(request: NextRequest) {
  if (!isRequestAuthorized(request)) {
    return NextResponse.json({ ok: false, message: "Unauthorized" }, { status: 401 });
  }

  try {
    const formData = await request.formData();
    const file = formData.get("file");
    const folder = (formData.get("folder") as string) || "gallery";

    if (!file || !(file instanceof File)) {
      return NextResponse.json({ ok: false, message: "No file provided" }, { status: 400 });
    }

    if (file.size > MAX_IMAGE_SIZE) {
      return NextResponse.json({ ok: false, message: "File exceeds 10MB limit" }, { status: 400 });
    }

    if (!ALLOWED_IMAGE_TYPES.includes(file.type) && !file.type.includes("pdf")) {
      return NextResponse.json({ ok: false, message: "File format not supported" }, { status: 400 });
    }

    const safeFolder = folder === "resumes" ? "resumes" : "gallery";
    const uploadDir = path.join(process.cwd(), "public", "uploads", safeFolder);

    await fs.mkdir(uploadDir, { recursive: true });

    const originalName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
    const ext = path.extname(originalName) || ".jpg";
    const base = path.basename(originalName, ext);
    const fileName = `${base}-${Date.now()}${ext}`;
    const filePath = path.join(uploadDir, fileName);

    const buffer = Buffer.from(await file.arrayBuffer());
    await fs.writeFile(filePath, buffer);

    const publicUrl = `/uploads/${safeFolder}/${fileName}`;

    return NextResponse.json({
      ok: true,
      url: publicUrl,
      fileName,
      size: file.size,
    });
  } catch (error) {
    console.error("[upload] Upload error:", error);
    return NextResponse.json(
      { ok: false, message: error instanceof Error ? error.message : "Upload failed" },
      { status: 500 }
    );
  }
}
