"use client";

import styles from "./ManufacturingProcess.module.css";

type Stage = {
  num: string;
  title: string;
  desc: string;
};

const stages: Stage[] = [
  {
    num: "01",
    title: "Customer Enquiry & Purchase Order",
    desc: "Review customer requirements and confirm the purchase order.",
  },
  {
    num: "02",
    title: "Drawing Review & Production Planning",
    desc: "Review drawings, specifications and plan the manufacturing process.",
  },
  {
    num: "03",
    title: "Raw Material Procurement",
    desc: "Source approved raw materials from suitable suppliers.",
  },
  {
    num: "04",
    title: "Material Receipt & Inspection",
    desc: "Verify incoming material identification, dimensions and documentation.",
  },
  {
    num: "05",
    title: "Chemical Composition Testing",
    desc: "Verify the chemical composition as per material specifications.",
  },
  {
    num: "06",
    title: "Tensile Testing",
    desc: "Evaluate tensile strength and applicable mechanical properties.",
  },
  {
    num: "07",
    title: "Hardness Testing",
    desc: "Check hardness values as per customer requirements.",
  },
  {
    num: "08",
    title: "Metallurgical Testing",
    desc: "Examine material microstructure and metallurgical properties where required.",
  },
  {
    num: "09",
    title: "Material Approval & Test Report Review",
    desc: "Review material certificates and laboratory reports before approval.",
  },
  {
    num: "10",
    title: "CNC Machining",
    desc: "Machine precision components on our CNC milling centres with accuracy.",
  },
  {
    num: "11",
    title: "Drilling, Tapping & Engraving",
    desc: "Perform drilling, tapping and engraving according to drawings.",
  },
  {
    num: "12",
    title: "Deburring & Component Finishing",
    desc: "Remove burrs and finish component edges and surfaces.",
  },
  {
    num: "13",
    title: "Assembly",
    desc: "Assemble components where required and verify fit and alignment.",
  },
  {
    num: "14",
    title: "In-Process Inspection",
    desc: "Perform dimensional and visual checks during production.",
  },
  {
    num: "15",
    title: "Outside Processing & Surface Finishing",
    desc: "Coordinate heat treatment, coating or other processes through approved partners.",
  },
  {
    num: "16",
    title: "Coating & Plating Testing",
    desc: "Verify coating and plating for thickness, adhesion and quality.",
  },
  {
    num: "17",
    title: "Non-Destructive Testing (NDT)",
    desc: "Perform NDT methods as per customer and industry requirements.",
  },
  {
    num: "18",
    title: "Final Inspection & Quality Clearance",
    desc: "Complete final inspection and clear the component for dispatch.",
  },
  {
    num: "19",
    title: "Documentation & Traceability",
    desc: "Maintain all inspection reports and process documents for traceability.",
  },
  {
    num: "20",
    title: "Packing & Dispatch",
    desc: "Pack components securely and prepare delivery documents.",
  },
  {
    num: "21",
    title: "Customer Delivery",
    desc: "Deliver finished components as per the agreed schedule.",
  },
];

const qualityFeatures = [
  {
    title: "Quality-Driven Process",
    text: "Rigorous checks at every stage of manufacturing.",
    icon: (
      <svg
        width="22"
        height="22"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
        <path d="m9 12 2 2 4-4" />
      </svg>
    ),
  },
  {
    title: "Precision Manufacturing",
    text: "Advanced CNC capabilities for accurate and consistent results.",
    icon: (
      <svg
        width="22"
        height="22"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <circle cx="12" cy="12" r="3" />
        <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
      </svg>
    ),
  },
  {
    title: "Complete Traceability",
    text: "Full documentation from material to final delivery.",
    icon: (
      <svg
        width="22"
        height="22"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <polyline points="14 2 14 8 20 8" />
        <line x1="16" y1="13" x2="8" y2="13" />
        <line x1="16" y1="17" x2="8" y2="17" />
        <line x1="10" y1="9" x2="8" y2="9" />
      </svg>
    ),
  },
  {
    title: "Reliable Delivery",
    text: "Your components, delivered with quality and care.",
    icon: (
      <svg
        width="22"
        height="22"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="M16 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
        <circle cx="10" cy="7" r="4" />
        <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    ),
  },
];

export function ManufacturingProcess() {
  return (
    <section className={styles.section} aria-labelledby="manufacturing-process-title">
      <div className="container">
        {/* ---------- Section Header ---------- */}
        <div className={styles.header} data-reveal="">
          <p className={styles.eyebrow}>VARUN INDUSTRIES</p>
          <h2 id="manufacturing-process-title" className={styles.title}>
            Complete Manufacturing Process
          </h2>
          <p className={styles.description}>
            From your enquiry to final delivery, we follow a structured and quality-driven manufacturing process that ensures precision, reliability and complete traceability at every stage.
          </p>
        </div>

        {/* ---------- 3-Column × 7-Row Manufacturing Process Grid ---------- */}
        <div className={styles.grid}>
          {stages.map((stage) => (
            <div key={stage.num} className={styles.stageItem} data-reveal="">
              <span className={styles.stageNum}>{stage.num}</span>
              <div className={styles.stageBody}>
                <h3 className={styles.stageTitle}>{stage.title}</h3>
                <p className={styles.stageDesc}>{stage.desc}</p>
              </div>
            </div>
          ))}
        </div>

        {/* ---------- Our Commitment to Quality Panel ---------- */}
        <div className={styles.qualityPanel} data-reveal="">
          <div className={styles.qualityLead}>
            <h3 className={styles.qualityTitle}>
              Our Commitment<br />to Quality
            </h3>
          </div>
          <div className={styles.qualityFeatures}>
            {qualityFeatures.map((feat) => (
              <div key={feat.title} className={styles.qualityItem} data-reveal="">
                <div className={styles.qualityIconCircle} aria-hidden="true">
                  {feat.icon}
                </div>
                <h4 className={styles.qualityItemTitle}>{feat.title}</h4>
                <p className={styles.qualityItemText}>{feat.text}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
