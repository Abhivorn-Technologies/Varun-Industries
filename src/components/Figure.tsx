import Image from "next/image";
import type { Photo } from "@/lib/photos";

type FigureProps = {
  photo: Photo;
  number: number;
  sizes: string;
  priority?: boolean;
};

/** A photograph framed like a figure on an engineering drawing. */
export function Figure({ photo, number, sizes, priority = false }: FigureProps) {
  return (
    <figure className="figure">
      <div className="figure__frame">
        <Image src={photo.src} alt={photo.alt} sizes={sizes} priority={priority} placeholder="blur" />
      </div>
      <figcaption>
        <span>Fig. {String(number).padStart(2, "0")}</span>
        <span>{photo.caption}</span>
      </figcaption>
    </figure>
  );
}
