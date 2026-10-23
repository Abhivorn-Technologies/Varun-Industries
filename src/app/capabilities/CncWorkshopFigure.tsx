import Image from "next/image";
import cncPhoto from "../../../public/images/parts/cnc.jpg";
import styles from "./CncWorkshopFigure.module.css";

export function CncWorkshopFigure() {
  return (
    <figure className={styles.cncFigure} data-reveal="">
      <div className={styles.cncFrame}>
        <div className={styles.cncImageWrap}>
          <Image
            src={cncPhoto}
            alt="Varun Industries CNC workshop floor with CNC vertical milling centres"
            sizes="(min-width: 1200px) 680px, (min-width: 900px) 58vw, 100vw"
            priority
            placeholder="blur"
            className={styles.cncImage}
          />
        </div>
      </div>
    </figure>
  );
}
