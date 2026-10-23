import Image from "next/image";
import cncPhoto from "../../../public/images/parts/cnc.jpg";
import drillingPhoto from "../../../public/images/parts/Drilling.jpg";
import engravingPhoto from "../../../public/images/parts/Engraving.jpg";
import styles from "./CncWorkshopFigure.module.css";

export function CncWorkshopFigure() {
  return (
    <div className={styles.gallery} data-reveal="">
      {/* Top Card: CNC Vertical Milling */}
      <figure className={`${styles.card} ${styles.topCard}`}>
        <div className={styles.imageWrapTop}>
          <Image
            src={cncPhoto}
            alt="Varun Industries CNC workshop floor with CNC vertical milling centres"
            sizes="(min-width: 1200px) 680px, (min-width: 900px) 58vw, 100vw"
            priority
            placeholder="blur"
            className={styles.image}
          />
        </div>
        <figcaption className={styles.caption}>CNC VERTICAL MILLING</figcaption>
      </figure>

      {/* Bottom Row: Drilling & Engraving side-by-side */}
      <div className={styles.bottomRow}>
        {/* Bottom-left: Drilling */}
        <figure className={`${styles.card} ${styles.subCard}`}>
          <div className={styles.imageWrapSub}>
            <Image
              src={drillingPhoto}
              alt="Dedicated drilling equipment and workbenches at Varun Industries"
              sizes="(min-width: 1200px) 340px, (min-width: 900px) 29vw, 50vw"
              placeholder="blur"
              className={styles.image}
            />
          </div>
          <figcaption className={styles.caption}>DRILLING</figcaption>
        </figure>

        {/* Bottom-right: Engraving */}
        <figure className={`${styles.card} ${styles.subCard}`}>
          <div className={styles.imageWrapSub}>
            <Image
              src={engravingPhoto}
              alt="In-house laser engraving machine and workstation at Varun Industries"
              sizes="(min-width: 1200px) 340px, (min-width: 900px) 29vw, 50vw"
              placeholder="blur"
              className={`${styles.image} ${styles.engravingImage}`}
            />
          </div>
          <figcaption className={styles.caption}>ENGRAVING</figcaption>
        </figure>
      </div>
    </div>
  );
}
