import Image from "next/image";
import Link from "next/link";
import { galleryOrder } from "@/lib/photos";
import { site } from "@/lib/site";
import styles from "./Hero.module.css";
import { SpaceBackdrop } from "./SpaceBackdrop";

const iconProps = {
  width: 36,
  height: 36,
  viewBox: "0 0 36 36",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 1.8,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  "aria-hidden": true,
};

const features = [
  {
    label: "High precision",
    icon: (
      <svg {...iconProps}>
        <circle cx="18" cy="18" r="10" />
        <circle cx="18" cy="18" r="3.5" />
        <path d="M18 3v6M18 27v6M3 18h6M27 18h6" />
      </svg>
    ),
  },
  {
    label: "Defence grade",
    icon: (
      <svg {...iconProps}>
        <path d="M18 4l11 4v9c0 7-4.6 12.2-11 15-6.4-2.8-11-8-11-15V8z" />
        <path d="M13 18l3.5 3.5L23.5 14" />
      </svg>
    ),
  },
  {
    label: "Space ready",
    icon: (
      <svg {...iconProps}>
        <path d="M18 4c5 3.5 7 9 6 16h-12c-1-7 1-12.5 6-16z" />
        <circle cx="18" cy="13.5" r="2.5" />
        <path d="M12 20l-4 5h5M24 20l4 5h-5M15.5 24.5 18 31l2.5-6.5" />
      </svg>
    ),
  },
  {
    label: "Custom manufacturing",
    icon: (
      <svg {...iconProps}>
        <circle cx="18" cy="18" r="4.5" />
        <path d="M18 4.5v4M18 27.5v4M4.5 18h4M27.5 18h4M8.5 8.5l2.8 2.8M24.7 24.7l2.8 2.8M8.5 27.5l2.8-2.8M24.7 11.3l2.8-2.8" />
        <circle cx="18" cy="18" r="9.5" />
      </svg>
    ),
  },
];

export function Hero() {
  return (
    <section className={styles.hero} aria-labelledby="hero-title">
      <SpaceBackdrop />

      <div className={`container ${styles.content}`}>
        <p className={styles.eyebrow}>
          <span>
            <span>CNC precision machining</span> <span>Hyderabad · Est. {site.founded}</span>
          </span>
        </p>
        <h1 id="hero-title" className={styles.title}>
          Precision components <span className={styles.accent}>for a brighter tomorrow</span>
        </h1>
        <p className={styles.text}>
          We manufacture high-precision components for space, defence and telecommunications as per your drawings,
          specifications and quantities.
        </p>

        <ul className={styles.features}>
          {features.map((feature) => (
            <li key={feature.label}>
              {feature.icon}
              <span>{feature.label}</span>
            </li>
          ))}
        </ul>

        <div className={styles.actions}>
          <Link href="/contact#enquiry" className={styles.primary}>
            Request a quote
            <svg width="20" height="20" viewBox="0 0 20 20" aria-hidden="true">
              <path d="M3 10h13M11 5l5 5-5 5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </Link>
          <Link href="/capabilities" className={styles.secondary}>
            See our capabilities
          </Link>
        </div>
      </div>

      <div className={styles.gallery}>
        <div className={`container ${styles.galleryHead}`}>
          <h2 id="gallery-title" className={styles.galleryTitle}>
            Precision parts gallery
          </h2>
          <Link href="/components" className={styles.galleryLink}>
            View all parts
          </Link>
        </div>
        <div className={styles.marquee}>
          <ul className={styles.track}>
            {[...galleryOrder, ...galleryOrder].map((photo, index) => {
              const duplicate = index >= galleryOrder.length;
              return (
                <li key={index} className={styles.card} aria-hidden={duplicate || undefined}>
                  <Image
                    src={photo.src}
                    alt={duplicate ? "" : photo.alt}
                    sizes="(min-width: 900px) 360px, 260px"
                    placeholder="blur"
                    priority={index < 3}
                  />
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </section>
  );
}
