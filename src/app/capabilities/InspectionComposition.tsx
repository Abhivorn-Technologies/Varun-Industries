import Image from "next/image";
import inspection1 from "../../../public/images/parts/inspection 1.jpg";
import inspection2 from "../../../public/images/parts/inspection 2.jpg";
import styles from "./InspectionComposition.module.css";

export function InspectionComposition() {
  return (
    <div className={styles.composition} data-reveal="">
      {/* Thin blue decorative corner line behind top-left of main image */}
      <div className={styles.cornerLine} aria-hidden="true" />

      {/* Main background image: inspection 1 (larger, back, left) */}
      <div className={styles.mainFrame}>
        <Image
          src={inspection1}
          alt="Varun Industries engineer inspecting a precision machined housing with digital vernier calipers against technical drawings"
          sizes="(min-width: 1200px) 440px, (min-width: 900px) 380px, 80vw"
          placeholder="blur"
          className={styles.mainImage}
        />
      </div>

      {/* Overlapping foreground image: inspection 2 (smaller, front, bottom-right) */}
      <div className={styles.overlapFrame}>
        <Image
          src={inspection2}
          alt="Varun Industries engineer measuring a precision milled enclosure using a digital height gauge on a granite surface plate"
          sizes="(min-width: 1200px) 270px, (min-width: 900px) 240px, 50vw"
          placeholder="blur"
          className={styles.overlapImage}
        />
      </div>
    </div>
  );
}
