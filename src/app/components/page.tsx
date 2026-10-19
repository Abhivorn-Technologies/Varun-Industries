import { CtaBand } from "@/components/CtaBand";
import { Figure } from "@/components/Figure";
import { PageHeader } from "@/components/PageHeader";
import { pageMetadata } from "@/lib/metadata";
import { galleryOrder } from "@/lib/photos";

export const metadata = pageMetadata({
  title: "Components",
  description:
    "Photographs of precision components machined by Varun Industries in Hyderabad: housings, enclosures, covers, base plates, brackets and threaded rings.",
  path: "/components",
});

export default function ComponentsPage() {
  return (
    <>
      <PageHeader
        label="Components"
        title="Components from our shop"
        intro="A selection of housings, enclosures, plates and fixtures machined by Varun Industries."
      />

      <section className="section" aria-label="Component photographs">
        <div className="container">
          <div className="gallery">
            {galleryOrder.map((photo, index) => (
              <Figure
                key={photo.caption}
                photo={photo}
                number={index + 1}
                priority={index < 2}
                sizes="(min-width: 1200px) 560px, (min-width: 640px) 50vw, 100vw"
              />
            ))}
          </div>
        </div>
      </section>

      <CtaBand />
    </>
  );
}
