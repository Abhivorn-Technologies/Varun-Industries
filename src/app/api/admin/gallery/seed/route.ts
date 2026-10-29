import { NextResponse, type NextRequest } from "next/server";
import { isRequestAuthorized } from "@/lib/server/admin-auth";
import { connectToDatabase, isDbConfigured } from "@/lib/server/db";
import { GalleryItem } from "@/lib/server/models/GalleryItem";

const DEFAULT_PARTS = [
  {
    title: "Housing Range & Milled Brackets",
    caption: "Housing with a range of milled brackets, frames and vented covers",
    alt: "A tall machined housing with ribbed cooling fins beside a range of smaller milled brackets, frames, vented covers and blocks.",
    imageUrl: "/images/parts/housing-and-component-range.jpg",
    category: "Housings",
    order: 1,
    isActive: true,
  },
  {
    title: "Compartmented Housing (300mm × 420mm)",
    caption: "Compartmented housing, 300 mm × 420 mm overall",
    alt: "Machined housing with internal compartments and many tapped holes, annotated with overall dimensions of 300 mm by 420 mm.",
    imageUrl: "/images/parts/housing-300x420.jpg",
    category: "Housings",
    dimensions: "300 mm × 420 mm",
    order: 2,
    isActive: true,
  },
  {
    title: "Pair of Multi-Pocket Housings",
    caption: "Pair of multi-pocket housings",
    alt: "Two large machined housings with many pockets, channels and drilled mounting holes, one standing behind the other.",
    imageUrl: "/images/parts/machined-housings-pair.jpg",
    category: "Housings",
    order: 3,
    isActive: true,
  },
  {
    title: "Multi-Cavity Finned Housing",
    caption: "Multi-cavity housing with thin walls and finned sections",
    alt: "Upright machined housing with deep rectangular cavities, thin walls and finned sections along the top edge.",
    imageUrl: "/images/parts/multi-cavity-housing.jpg",
    category: "Housings",
    order: 4,
    isActive: true,
  },
  {
    title: "Flanged Machined Enclosure",
    caption: "Enclosure with stepped rim and corner mounting flanges",
    alt: "Rectangular machined enclosure with a stepped rim, drilled mounting flanges at each corner and a square connector face on one side.",
    imageUrl: "/images/parts/flanged-enclosure.jpg",
    category: "Enclosures",
    order: 5,
    isActive: true,
  },
  {
    title: "Enclosure with Matching Covers",
    caption: "Enclosure base with matching covers, trays and frames",
    alt: "A machined enclosure base with matching lids, trays, slotted frames and small covers laid out on a dark surface.",
    imageUrl: "/images/parts/enclosure-with-covers.jpg",
    category: "Enclosures",
    order: 6,
    isActive: true,
  },
  {
    title: "Precision Base Plates",
    caption: "Base plates with raised walls, pockets and hole patterns",
    alt: "Two flat plates side by side, machined with raised walls, pockets and rows of drilled holes.",
    imageUrl: "/images/parts/machined-base-plates.jpg",
    category: "Plates & Fixtures",
    order: 7,
    isActive: true,
  },
  {
    title: "Profiled Plate & Threaded Rings",
    caption: "Profiled plate with octagonal and clamp rings",
    alt: "A long profiled plate with pockets and three bored holes, with an octagonal threaded ring and a threaded clamp ring in front of it.",
    imageUrl: "/images/parts/machined-plate-and-ring-fixtures.jpg",
    category: "Rings & Fixtures",
    order: 8,
    isActive: true,
  },
  {
    title: "Milled Plate on Shop Floor",
    caption: "Milled plate photographed on the workshop floor",
    alt: "A milled plate with fine tool-path marks and machined markings, photographed on the workshop floor.",
    imageUrl: "/images/parts/plate-on-shop-floor.jpg",
    category: "Shop Floor",
    order: 9,
    isActive: true,
  },
  {
    title: "Pocketed Plates & Bar Fixtures",
    caption: "Pocketed plates, a profiled bar and threaded rings",
    alt: "Two pocketed plates, a long profiled bar with three bored holes, an octagonal threaded ring and a threaded clamp ring on a dark background.",
    imageUrl: "/images/parts/plates-and-fixtures.jpg",
    category: "Plates & Fixtures",
    order: 10,
    isActive: true,
  },
];

export async function POST(request: NextRequest) {
  if (!isRequestAuthorized(request)) {
    return NextResponse.json({ ok: false, message: "Unauthorized" }, { status: 401 });
  }

  if (!isDbConfigured()) {
    return NextResponse.json({
      ok: false,
      message: "MongoDB is not configured yet in .env.local",
    }, { status: 400 });
  }

  try {
    await connectToDatabase();
    let seededCount = 0;

    for (const part of DEFAULT_PARTS) {
      const exists = await GalleryItem.findOne({ imageUrl: part.imageUrl });
      if (!exists) {
        await GalleryItem.create(part);
        seededCount++;
      }
    }

    return NextResponse.json({
      ok: true,
      message: `Successfully seeded ${seededCount} catalogue items to MongoDB.`,
      seededCount,
    });
  } catch (error) {
    return NextResponse.json(
      { ok: false, message: error instanceof Error ? error.message : "Failed to seed gallery" },
      { status: 500 }
    );
  }
}
