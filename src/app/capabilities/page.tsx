import Link from "next/link";
import { CtaBand } from "@/components/CtaBand";
import { PageHeader } from "@/components/PageHeader";
import { CncWorkshopFigure } from "./CncWorkshopFigure";
import { InspectionComposition } from "./InspectionComposition";
import styles from "./capabilities.module.css";
import { pageMetadata } from "@/lib/metadata";
import { equipmentList, inHouse, site, vendorProcesses } from "@/lib/site";

export const metadata = pageMetadata({
  title: "Capabilities",
  description:
    "In-house CNC milling, drilling, tapping and engraving on BFW machining centres, with wire EDM, turning, plating and surface treatment via specialist vendors.",
  path: "/capabilities",
});

export default function CapabilitiesPage() {
  return (
    <>
      <PageHeader
        label="Capabilities"
        title="In-house machining, with coordinated secondary operations"
        intro="We machine components in our own shop and coordinate specialist vendors for the processes a project needs beyond that."
      />

      <section className="section" aria-labelledby="inhouse-title">
        <div className={`container ${styles.inhouseSplit}`}>
          <div>
            <p className="label">In-house services</p>
            <h2 id="inhouse-title">CNC vertical milling, drilling, tapping and engraving</h2>
            <ol className="process-list">
              {inHouse.map((item, index) => (
                <li key={item.title}>
                  <span className="index">{String(index + 1).padStart(2, "0")}</span>
                  <div>
                    <h3>{item.title}</h3>
                    <p>{item.text}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
          <CncWorkshopFigure />
        </div>
      </section>

      <section className="section section--tint" aria-labelledby="machines-title">
        <div className="container split">
          <div>
            <p className="label">Infrastructure</p>
            <h2 id="machines-title">Machining centres and equipment</h2>
            <p className="lead">
              Our manufacturing infrastructure includes two CNC vertical milling centres, supported by dedicated
              drilling, tapping and engraving equipment.
            </p>
          </div>
          <div className="panel">
            <p className="spec-list__title">Equipment list</p>
            <ul className="spec-list">
              {equipmentList.map((item) => (
                <li key={item.name} className="spec-list__item">
                  <div className="spec-list__name">{item.name}</div>
                  <p className="spec-list__desc">{item.usedFor}</p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="section section--dark" aria-labelledby="vendor-title">
        <div className="container split split--center">
          <div>
            <p className="label">Vendor network</p>
            <h2 id="vendor-title">Processes coordinated with specialist vendors</h2>
            <p>
              When a project calls for processes beyond our in-house capabilities, we coordinate with specialist
              vendors. This lets us support a broader set of component manufacturing requirements while keeping your
              specifications at the centre of the work.
            </p>
          </div>
          <ul className="tick-list tick-list--two">
            {vendorProcesses.map((process) => (
              <li key={process}>{process}</li>
            ))}
          </ul>
        </div>
      </section>

      <section className="section" aria-labelledby="quality-title">
        <div className="container split split--center">
          <InspectionComposition />
          <div>
            <p className="label">Inspection and documentation</p>
            <h2 id="quality-title">Careful inspection, systematic records</h2>
            <p className="lead">
              Space, defence and telecommunications components demand accuracy, inspection and traceability.
            </p>
            <p>
              We place strong emphasis on careful inspection and systematic production documentation throughout the
              manufacturing cycle, from understanding your drawings and production requirements through to the
              finished component.
            </p>
            <p>
              Sectors we serve: <strong>{site.sectors.join(", ")}</strong>.
            </p>
            <p className="more-link">
              <Link href="/components" className="text-link">
                See components we have machined
              </Link>
            </p>
          </div>
        </div>
      </section>

      <CtaBand />
    </>
  );
}
