import Link from "next/link";
import { pageMetadata } from "@/lib/metadata";
import { careersApplicationHref } from "@/lib/site";
import styles from "./careers.module.css";

export const metadata = pageMetadata({
  title: "Careers",
  description:
    "Build your career with Varun Industries. Grow your skills in precision CNC manufacturing and contribute to quality-driven engineering in Hyderabad.",
  path: "/careers",
});

const benefits = [
  {
    title: "Precision-driven environment",
    description: "Work with CNC machining, drilling, tapping and engraving operations.",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <circle cx="12" cy="12" r="9" />
        <circle cx="12" cy="12" r="3" />
        <path d="M12 3v3M12 18v3M3 12h3M18 12h3" />
      </svg>
    ),
  },
  {
    title: "Learning and development",
    description: "Build technical skills and develop manufacturing knowledge.",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M12 2v4M4.93 4.93l2.83 2.83M2 12h4M4.93 19.07l2.83-2.83" />
        <path d="M9 18h6M10 22h4" />
        <path d="M15.09 14c.6-.8 1-1.8 1-2.9a5 5 0 0 0-10 0c0 1.1.4 2.1 1 2.9.8 1 1.4 2.1 1.4 3.1h5.2c0-1 .6-2.1 1.4-3.1z" />
      </svg>
    ),
  },
  {
    title: "Quality and responsibility",
    description: "Contribute to disciplined production and quality-focused processes.",
    icon: (
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
        <path d="M9 12l2 2 4-4" />
      </svg>
    ),
  },
];

export default function CareersPage() {
  return (
    <>
      {/* ---------- Careers Hero Section ---------- */}
      <section className={styles.hero} aria-labelledby="careers-heading">
        <div className={`container ${styles.heroContainer}`}>
          <div className={styles.heroContent}>
            <p className={styles.eyebrow} data-reveal="">
              CAREERS · VARUN INDUSTRIES
            </p>
            <h1 id="careers-heading" className={styles.heading} data-reveal="">
              Build Your Career With Us
            </h1>
            <p className={styles.description} data-reveal="">
              Grow your skills in precision manufacturing and contribute to quality-driven engineering.
            </p>
          </div>
        </div>
      </section>

      {/* ---------- "Why Work With Us?" Card & Application CTA ---------- */}
      <section className={styles.benefitsSection} aria-labelledby="benefits-heading">
        <div className="container">
          <div className={styles.benefitsCard} data-reveal="">
            <h2 id="benefits-heading" className={styles.benefitsTitle} data-reveal="">
              Why Work With Us?
            </h2>

            <div className={styles.featuresGrid}>
              {benefits.map((benefit) => (
                <div key={benefit.title} className={styles.featureItem} data-reveal="">
                  <div className={styles.iconBox}>{benefit.icon}</div>
                  <h3 className={styles.featureTitle}>{benefit.title}</h3>
                  <p className={styles.featureText}>{benefit.description}</p>
                </div>
              ))}
            </div>
          </div>

          <div className={styles.ctaCard} data-reveal="">
            <div className={styles.ctaTextCol}>
              <h2 className={styles.ctaTitle}>Ready to Join Our Team?</h2>
              <p className={styles.ctaDesc}>
                Share your skills and experience. We welcome applications for relevant current or future opportunities.
              </p>
            </div>
            <Link href={careersApplicationHref} className={styles.ctaBtn}>
              Apply for a Position
              <svg width="18" height="18" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M4 10h12M11 5l5 5-5 5" />
              </svg>
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
