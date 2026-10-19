import type { StaticImageData } from "next/image";
import housingRange from "../../public/images/parts/housing-and-component-range.jpg";
import platesFixtures from "../../public/images/parts/plates-and-fixtures.jpg";
import housingsPair from "../../public/images/parts/machined-housings-pair.jpg";
import multiCavity from "../../public/images/parts/multi-cavity-housing.jpg";
import housing300 from "../../public/images/parts/housing-300x420.jpg";
import flanged from "../../public/images/parts/flanged-enclosure.jpg";
import enclosureCovers from "../../public/images/parts/enclosure-with-covers.jpg";
import basePlates from "../../public/images/parts/machined-base-plates.jpg";
import plateRings from "../../public/images/parts/machined-plate-and-ring-fixtures.jpg";
import shopFloor from "../../public/images/parts/plate-on-shop-floor.jpg";

export type Photo = {
  src: StaticImageData;
  alt: string;
  caption: string;
};

/** Photographs of components supplied by Varun Industries. */
export const photos = {
  housingRange: {
    src: housingRange,
    alt: "A tall machined housing with ribbed cooling fins beside a range of smaller milled brackets, frames, vented covers and blocks.",
    caption: "Housing with a range of milled brackets, frames and vented covers",
  },
  platesFixtures: {
    src: platesFixtures,
    alt: "Two pocketed plates, a long profiled bar with three bored holes, an octagonal threaded ring and a threaded clamp ring on a dark background.",
    caption: "Pocketed plates, a profiled bar and threaded rings",
  },
  housingsPair: {
    src: housingsPair,
    alt: "Two large machined housings with many pockets, channels and drilled mounting holes, one standing behind the other.",
    caption: "Pair of multi-pocket housings",
  },
  multiCavity: {
    src: multiCavity,
    alt: "Upright machined housing with deep rectangular cavities, thin walls and finned sections along the top edge.",
    caption: "Multi-cavity housing with thin walls and finned sections",
  },
  housing300: {
    src: housing300,
    alt: "Machined housing with internal compartments and many tapped holes, annotated with overall dimensions of 300 mm by 420 mm.",
    caption: "Compartmented housing, 300 mm × 420 mm overall",
  },
  flanged: {
    src: flanged,
    alt: "Rectangular machined enclosure with a stepped rim, drilled mounting flanges at each corner and a square connector face on one side.",
    caption: "Enclosure with stepped rim and corner mounting flanges",
  },
  enclosureCovers: {
    src: enclosureCovers,
    alt: "A machined enclosure base with matching lids, trays, slotted frames and small covers laid out on a dark surface.",
    caption: "Enclosure base with matching covers, trays and frames",
  },
  basePlates: {
    src: basePlates,
    alt: "Two flat plates side by side, machined with raised walls, pockets and rows of drilled holes.",
    caption: "Base plates with raised walls, pockets and hole patterns",
  },
  plateRings: {
    src: plateRings,
    alt: "A long profiled plate with pockets and three bored holes, with an octagonal threaded ring and a threaded clamp ring in front of it.",
    caption: "Profiled plate with octagonal and clamp rings",
  },
  shopFloor: {
    src: shopFloor,
    alt: "A milled plate with fine tool-path marks and machined markings, photographed on the workshop floor.",
    caption: "Milled plate photographed on the workshop floor",
  },
} satisfies Record<string, Photo>;

export const galleryOrder: Photo[] = [
  photos.housingRange,
  photos.housing300,
  photos.housingsPair,
  photos.multiCavity,
  photos.flanged,
  photos.enclosureCovers,
  photos.basePlates,
  photos.plateRings,
  photos.shopFloor,
  photos.platesFixtures,
];
