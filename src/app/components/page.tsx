import Link from "next/link";
import { CtaBand } from "@/components/CtaBand";
import { Figure } from "@/components/Figure";
import { PageHero } from "@/components/PageHero";
import { pageMetadata } from "@/lib/metadata";
import { galleryOrder } from "@/lib/photos";
import { connectToDatabase, isDbConfigured } from "@/lib/server/db";
import { GalleryItem } from "@/lib/server/models/GalleryItem";
import type { StaticImageData } from "next/image";

export const metadata = pageMetadata({
  title: "Precision Parts Gallery",
  description:
    "Photographs of precision components machined by Varun Industries in Hyderabad: housings, enclosures, covers, base plates, brackets and threaded rings.",
  path: "/components",
});

export const revalidate = 60; // Revalidate every 60 seconds

interface PageProps {
  searchParams: Promise<{ page?: string }>;
}

export default async function ComponentsPage({ searchParams }: PageProps) {
  const resolvedParams = await searchParams;
  const currentPage = Math.max(1, parseInt(resolvedParams.page || "1", 10) || 1);
  const itemsPerPage = 6;

  let displayPhotos: Array<{ src: StaticImageData | string; alt: string; caption: string }> = galleryOrder;

  if (isDbConfigured()) {
    try {
      await connectToDatabase();
      const dynamicItems = await GalleryItem.find({ isActive: true })
        .sort({ order: 1, createdAt: -1 })
        .lean();

      if (dynamicItems.length > 0) {
        displayPhotos = dynamicItems.map((item) => ({
          src: item.imageUrl,
          alt: item.alt || item.title,
          caption: item.caption,
        }));
      }
    } catch (err) {
      console.error("[components-page] Fallback to static gallery:", err);
    }
  }

  const totalItems = displayPhotos.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / itemsPerPage));
  const safePage = Math.min(currentPage, totalPages);
  const startIndex = (safePage - 1) * itemsPerPage;
  const paginatedPhotos = displayPhotos.slice(startIndex, startIndex + itemsPerPage);

  const startNum = startIndex + 1;
  const endNum = Math.min(startIndex + itemsPerPage, totalItems);

  return (
    <>
      <PageHero
        label="Gallery"
        title="Precision parts gallery"
        intro="A selection of housings, enclosures, plates and fixtures machined by Varun Industries."
      />

      <section className="section" aria-label="Component photographs">
        <div className="container">
          <div className="gallery">
            {paginatedPhotos.map((photo, index) => (
              <Figure
                key={photo.caption + (startIndex + index)}
                photo={photo}
                number={startIndex + index + 1}
                priority={index < 2}
                sizes="(min-width: 1200px) 560px, (min-width: 640px) 50vw, 100vw"
              />
            ))}
          </div>

          {totalPages > 1 && (
            <div className="gallery-pagination">
              <div className="gallery-pagination__info">
                Showing {startNum}–{endNum} of {totalItems} precision components
              </div>

              <div className="gallery-pagination__nav">
                <Link
                  href={safePage > 1 ? `/components?page=${safePage - 1}` : "#"}
                  className={`gallery-pagination__link ${safePage <= 1 ? "is-disabled" : ""}`}
                  aria-label="Previous page"
                >
                  ← Prev
                </Link>

                {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                  <Link
                    key={p}
                    href={`/components?page=${p}`}
                    className={`gallery-pagination__link ${p === safePage ? "is-active" : ""}`}
                    aria-label={`Page ${p}`}
                  >
                    {p}
                  </Link>
                ))}

                <Link
                  href={safePage < totalPages ? `/components?page=${safePage + 1}` : "#"}
                  className={`gallery-pagination__link ${safePage >= totalPages ? "is-disabled" : ""}`}
                  aria-label="Next page"
                >
                  Next →
                </Link>
              </div>
            </div>
          )}
        </div>
      </section>

      <CtaBand />
    </>
  );
}
