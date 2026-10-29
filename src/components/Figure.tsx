import Image, { type StaticImageData } from "next/image";

type FigureProps = {
  photo: {
    src: StaticImageData | string;
    alt: string;
    caption?: string;
  };
  number?: number;
  sizes: string;
  priority?: boolean;
};

/** A photograph framed like a figure on an engineering drawing. */
export function Figure({ photo, sizes, priority = false }: FigureProps) {
  const isStatic = typeof photo.src === "object" && photo.src !== null && "src" in photo.src;

  return (
    <figure className="figure" data-reveal="">
      <div className="figure__frame">
        {isStatic ? (
          <Image src={photo.src as StaticImageData} alt={photo.alt} sizes={sizes} priority={priority} placeholder="blur" />
        ) : (
          <Image
            src={String(photo.src)}
            alt={photo.alt}
            sizes={sizes}
            priority={priority}
            width={600}
            height={450}
            style={{ width: "100%", height: "auto", objectFit: "cover" }}
          />
        )}
      </div>
    </figure>
  );
}
