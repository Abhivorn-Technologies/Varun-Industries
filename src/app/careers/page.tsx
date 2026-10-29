import Link from "next/link";
import { PageHero } from "@/components/PageHero";
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

import { connectToDatabase, isDbConfigured } from "@/lib/server/db";
import { CareerJob } from "@/lib/server/models/CareerJob";

export const revalidate = 60;

export default async function CareersPage() {
  let activeJobs: Array<{
    _id: string;
    title: string;
    department: string;
    location: string;
    jobType: string;
    experience: string;
    openings: number;
    description: string;
    requirements: string[];
  }> = [];

  if (isDbConfigured()) {
    try {
      await connectToDatabase();
      const docs = await CareerJob.find({ status: "active" })
        .sort({ order: 1, createdAt: -1 })
        .lean();
      activeJobs = JSON.parse(JSON.stringify(docs));
    } catch (err) {
      console.error("[careers-page] Could not load active jobs:", err);
    }
  }

  return (
    <>
      {/* ---------- Careers Hero Section ---------- */}
      <PageHero
        asSection
        id="careers-heading"
        label="CAREERS · VARUN INDUSTRIES"
        title="Build Your Career With Us"
        intro="Grow your skills in precision manufacturing and contribute to quality-driven engineering."
      />

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

          {/* ---------- Live Job Openings ---------- */}
          {activeJobs.length > 0 && (
            <div className={styles.openingsSection}>
              <div className={styles.openingsHeader}>
                <div>
                  <h2 className={styles.openingsTitle}>
                    Open Positions
                  </h2>
                  <p className={styles.openingsSubtitle}>
                    Explore precision manufacturing career opportunities at our Hyderabad manufacturing facility.
                  </p>
                </div>
              </div>

              <div className={styles.jobsGrid}>
                {activeJobs.map((job) => (
                  <div key={job._id} className={styles.jobCard}>
                    <div>
                      <div className={styles.jobMetaRow}>
                        <span className={styles.jobDeptPill}>{job.department}</span>
                      </div>

                      <h3 className={styles.jobTitle}>{job.title}</h3>

                      <div className={styles.jobDetailsRow}>
                        <span className={styles.jobDetailItem}>
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
                            <circle cx="12" cy="10" r="3" />
                          </svg>
                          {job.location || "Hyderabad, Telangana"}
                        </span>
                        <span className={styles.jobDetailItem}>
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
                            <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
                          </svg>
                          {job.jobType}
                        </span>
                        <span className={styles.jobDetailItem}>
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <circle cx="12" cy="12" r="10" />
                            <polyline points="12 6 12 12 16 14" />
                          </svg>
                          {job.experience}
                        </span>
                      </div>

                      <p className={styles.jobDesc}>{job.description}</p>

                      {job.requirements && job.requirements.length > 0 && (
                        <ul className={styles.jobReqsList}>
                          {job.requirements.slice(0, 3).map((r, i) => (
                            <li key={i} className={styles.jobReqItem}>
                              <svg className={styles.jobReqIcon} width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                                <polyline points="20 6 9 17 4 12" />
                              </svg>
                              <span>{r}</span>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>

                    <Link
                      href={`/careers/apply?position=${encodeURIComponent(job.title)}`}
                      className={styles.jobApplyBtn}
                    >
                      <span>Apply for this Position</span>
                      <svg width="16" height="16" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M4 10h12M11 5l5 5-5 5" />
                      </svg>
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          )}

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
