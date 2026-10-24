import { SpaceBackdrop } from "./SpaceBackdrop";
import styles from "./PageHero.module.css";

type PageHeroProps = {
  label: string;
  title: string;
  intro?: string;
  id?: string;
  asSection?: boolean;
};

/**
 * Reusable hero component for inner pages featuring:
 * - 3D space scene (planet, atmospheric glow, starfield, satellite, HUD blueprint)
 * - Deep navy/midnight-blue gradient backdrop
 * - Fluid responsive typography & entrance animations
 */
export function PageHero({ label, title, intro, id }: PageHeroProps) {
  const headingId = id || "hero-title";

  return (
    <section className={styles.hero} aria-labelledby={headingId}>
      <SpaceBackdrop />
      <div className={`container ${styles.container}`}>
        <div className={styles.heroBody}>
          <p className={styles.eyebrow}>
            {label}
          </p>
          <h1 id={headingId} className={styles.title}>
            {title}
          </h1>
          {intro && (
            <p className={styles.intro}>
              {intro}
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
