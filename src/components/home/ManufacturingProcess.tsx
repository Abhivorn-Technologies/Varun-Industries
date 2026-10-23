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
    desc: "We receive customer enquiries, technical drawings, specifications and purchase orders. Our team reviews the component requirements, quantities, material specifications and delivery schedules to understand customer expectations and establish the scope of manufacturing.",
  },
  {
    num: "02",
    title: "Drawing Review & Production Planning",
    desc: "Engineering drawings and technical specifications are carefully reviewed to identify critical dimensions, tolerances, material requirements and special processes. Production planning includes operation sequencing, machine allocation, resource planning and delivery scheduling to support efficient manufacturing.",
  },
  {
    num: "03",
    title: "Raw Material Procurement",
    desc: "Raw materials are procured according to customer-approved specifications, including material grade, dimensions and applicable standards. We coordinate with suitable suppliers to ensure the required material is available with relevant certificates and identification records.",
  },
  {
    num: "04",
    title: "Material Receipt & Inspection",
    desc: "Upon receipt, raw materials are inspected for identification, quantity, dimensions, material grade and applicable documentation. Material test certificates are reviewed where required, and accepted materials are identified and released for production in accordance with established procedures.",
  },
  {
    num: "05",
    title: "Chemical Composition Testing",
    desc: "Chemical composition testing verifies the elemental composition of metals and alloys to determine whether the material conforms to the specified grade. Suitable analytical methods, such as optical emission spectroscopy or X-ray fluorescence, may be used depending on the material and specification. Test reports are reviewed against the applicable acceptance criteria.",
  },
  {
    num: "06",
    title: "Tensile Testing",
    desc: "Tensile testing evaluates the mechanical properties of materials under an applied pulling force. Depending on the applicable standard, the test can determine ultimate tensile strength, yield strength and elongation. These results help verify that the material meets the required mechanical property specifications.",
  },
  {
    num: "07",
    title: "Hardness Testing",
    desc: "Hardness testing evaluates a material's resistance to indentation or deformation using an appropriate testing method, such as Rockwell, Brinell or Vickers. The results are compared with the specified hardness requirements to confirm suitability for the intended application.",
  },
  {
    num: "08",
    title: "Metallurgical Testing",
    desc: "Metallurgical testing examines material characteristics such as microstructure, grain structure and other properties when required. These examinations can help assess material condition and verify compliance with specified metallurgical requirements, heat-treatment conditions or applicable customer standards.",
  },
  {
    num: "09",
    title: "Material Approval & Test Report Review",
    desc: "Applicable material certificates and laboratory test reports are reviewed before material release. Results are checked against customer specifications and relevant standards, and the associated records are maintained to support material identification, traceability and production control.",
  },
  {
    num: "10",
    title: "CNC Machining",
    desc: "Our CNC vertical milling centres are used to manufacture precision components according to approved engineering drawings. Machining operations are planned to achieve the specified dimensions, tolerances and surface requirements. Appropriate process controls and inspection checks help maintain consistency and repeatability throughout production.",
  },
  {
    num: "11",
    title: "Drilling, Tapping & Engraving",
    desc: "Secondary machining operations are performed according to component requirements. Drilling produces specified holes, tapping creates internal threads, and engraving provides required identification marks, part numbers or other specified information. Each operation is carried out with reference to approved drawings and technical requirements.",
  },
  {
    num: "12",
    title: "Deburring & Component Finishing",
    desc: "Machined components undergo deburring to remove unwanted burrs and sharp edges resulting from manufacturing operations. Edges and surfaces are finished as specified to support safe handling, proper assembly and compliance with drawing requirements.",
  },
  {
    num: "13",
    title: "Assembly",
    desc: "Where required, components are assembled according to approved drawings, assembly instructions and customer specifications. Fit, alignment, completeness and workmanship are checked to ensure the assembled product meets the defined requirements.",
  },
  {
    num: "14",
    title: "In-Process Inspection",
    desc: "Dimensional and visual checks are performed at appropriate stages during manufacturing. Suitable inspection instruments, including digital vernier calipers, micrometers and height gauges, are used according to the measurement requirements. Identified deviations are addressed through the established nonconformance and corrective-action process.",
  },
  {
    num: "15",
    title: "Outside Processing & Surface Finishing",
    desc: "Specialized operations such as plating, anodizing, coating and other surface treatments are coordinated with supporting vendors when required. Processing requirements are communicated according to the applicable specifications, and relevant certificates and reports are reviewed upon completion.",
  },
  {
    num: "16",
    title: "Coating & Plating Testing",
    desc: "Where specified, finished surfaces are evaluated for applicable requirements such as coating thickness, adhesion, corrosion resistance and visual appearance. Appropriate tests and acceptance criteria are selected according to the coating type, customer drawings and applicable standards. Required reports and process certificates are collected and reviewed.",
  },
  {
    num: "17",
    title: "Non-Destructive Testing (NDT)",
    desc: "Non-destructive testing methods are used where specified to evaluate components for certain discontinuities without damaging their intended usability. Depending on the material and application, methods may include dye penetrant testing, magnetic particle testing, ultrasonic testing or radiographic testing. Testing and acceptance are carried out according to the applicable requirements.",
  },
  {
    num: "18",
    title: "Final Inspection & Quality Clearance",
    desc: "Completed components undergo final inspection to verify dimensional accuracy, workmanship, surface condition, identification and compliance with approved drawings. Applicable laboratory reports, inspection results and outside-processing certificates are reviewed before the components are approved for dispatch.",
  },
  {
    num: "19",
    title: "Documentation & Traceability",
    desc: "Relevant records are maintained throughout the manufacturing cycle, including material certificates, laboratory test reports, inspection records, outside-processing documents and dispatch documentation, as applicable. These records support product traceability, quality verification and customer documentation requirements.",
  },
  {
    num: "20",
    title: "Packing & Dispatch",
    desc: "Approved components are packed using suitable protective materials to minimize damage, contamination and handling risks during transportation. Required labels, quantities, delivery documents and inspection records are verified before dispatch.",
  },
  {
    num: "21",
    title: "Customer Delivery",
    desc: "Finished components are dispatched according to the agreed delivery schedule and customer requirements. Dispatch details and relevant delivery records are maintained to support order tracking, traceability and reliable customer service.",
  },
];

export function ManufacturingProcess() {
  return (
    <section className={styles.section} aria-labelledby="manufacturing-process-title">
      <div className="container">
        {/* ---------- Section Header ---------- */}
        <div className={styles.header}>
          <p className={styles.eyebrow} data-reveal="">
            VARUN INDUSTRIES
          </p>
          <h2 id="manufacturing-process-title" className={styles.title} data-reveal="">
            Complete Manufacturing Process
          </h2>
          <p className={styles.description} data-reveal="">
            At Varun Industries, we follow a systematic manufacturing process from customer enquiry and raw material procurement to precision machining, laboratory testing, quality inspection and final delivery. Every stage is managed according to customer drawings, technical specifications and applicable quality requirements to ensure accuracy, reliability, traceability and timely delivery.
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
            <p className={styles.qualityEyebrow}>STANDARDS &amp; RELIABILITY</p>
            <h3 className={styles.qualityTitle}>Our Commitment to Quality</h3>
          </div>
          <div className={styles.qualityBody}>
            <p className={styles.qualityText}>
              At Varun Industries, our focus is on precision manufacturing, controlled production processes, material verification, dimensional accuracy and reliable delivery. We coordinate specialized laboratory testing and outside processing as required by customer specifications, while maintaining applicable inspection records and traceability throughout the manufacturing cycle.
            </p>
            <p className={styles.qualityText}>
              Our objective is to deliver components that conform to approved drawings, technical specifications and agreed quality requirements for Space, Defence, Telecom, Pharma and other engineering applications.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
