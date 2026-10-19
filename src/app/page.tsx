import type { Metadata } from "next";
import Link from "next/link";
import { CtaBand } from "@/components/CtaBand";
import { Figure } from "@/components/Figure";
import { baseOpenGraph } from "@/lib/metadata";
import { photos } from "@/lib/photos";
import { inHouse, machines, site, vendorProcesses } from "@/lib/site";

const title = "Varun Industries | CNC Precision Machining in Hyderabad";
const description =
  "CNC precision machining in Hyderabad for space, defence and telecom. Components made to your drawings with in-house milling, drilling, tapping and engraving.";

export const metadata: Metadata = {
  title: { absolute: title },
  description,
  alternates: { canonical: "/" },
  openGraph: { ...baseOpenGraph, title, description, url: "/" },
  twitter: { card: "summary_large_image", title, description, images: ["/og-image.jpg"] },
};

const workflow = [
  {
    title: "Understand the requirement",
    text: "We go through your drawings, specifications, quantities and production requirements with you.",
  },
  {
    title: "Plan the operations",
    text: "We identify the machining and secondary operations the component needs, in-house and through partners.",
  },
  {
    title: "Machine and coordinate",
    text: "We machine the component on our CNC milling centres and coordinate any additional processes with specialist vendors.",
  },
  {
    title: "Inspect and document",
    text: "Inspection procedures and systematic production documentation are applied throughout the production cycle.",
  },
];

export default function HomePage() {
  return (
    <>
      <section className="hero" aria-labelledby="hero-title">
        <div className="container hero__grid">
          <div>
            <p className="label">CNC precision machining · Hyderabad</p>
            <h1 id="hero-title">Precision components for space, defence and telecommunications.</h1>
            <p className="hero__text">
              We manufacture components to your drawings, specifications and quantities, with CNC vertical milling,
              drilling, tapping and engraving in-house and coordinated support for wire EDM, turning, plating and
              other secondary operations.
            </p>
            <div className="hero__actions">
              <Link href="/contact#enquiry" className="btn btn--light">
                Request a quote
              </Link>
              <Link href="/capabilities" className="btn btn--outline-light">
                See our capabilities
              </Link>
            </div>
            <dl className="hero__meta">
              <div>
                <dt>Established</dt>
                <dd>{site.founded}</dd>
              </div>
              <div>
                <dt>In-house</dt>
                <dd>Milling, drilling, tapping, engraving</dd>
              </div>
              <div>
                <dt>Location</dt>
                <dd>Prashanth Nagar, Hyderabad</dd>
              </div>
            </dl>
          </div>
          <Figure
            photo={photos.housingRange}
            number={1}
            priority
            sizes="(min-width: 1200px) 560px, (min-width: 960px) 46vw, 100vw"
          />
        </div>
      </section>

      <section className="sectors" aria-label="Sectors served">
        <div className="container sectors__inner">
          <p className="sectors__title">Sectors we serve</p>
          <ul>
            {site.sectors.map((sector) => (
              <li key={sector}>{sector}</li>
            ))}
          </ul>
        </div>
      </section>

      <section className="section" aria-labelledby="inhouse-title">
        <div className="container split split--wide-left">
          <div>
            <p className="label">01 · In-house</p>
            <h2 id="inhouse-title">Machining we carry out ourselves</h2>
            <p className="lead">
              The core machining operations on your component are carried out in our own shop in Hyderabad.
            </p>
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
          <div>
            <div className="panel panel--tint sticky-aside">
              <table className="spec-table">
                <caption>Machining centres</caption>
                <thead>
                  <tr>
                    <th scope="col">Machine</th>
                    <th scope="col">Type</th>
                  </tr>
                </thead>
                <tbody>
                  {machines.map((machine) => (
                    <tr key={machine.name}>
                      <th scope="row">{machine.name}</th>
                      <td>{machine.type}</td>
                    </tr>
                  ))}
                  <tr>
                    <th scope="row">Dedicated equipment</th>
                    <td>Drilling, tapping and engraving</td>
                  </tr>
                </tbody>
              </table>
              <p className="more-link">
                <Link href="/capabilities" className="text-link">
                  Full capabilities
                </Link>
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="section section--dark" aria-labelledby="vendor-title">
        <div className="container split split--center">
          <div>
            <p className="label">02 · Coordinated processes</p>
            <h2 id="vendor-title">When a part needs more than milling</h2>
            <p>
              Many components need further work before they are complete. When a project calls for processes beyond
              our in-house capabilities, we coordinate them with specialist vendors, keeping your specifications at
              the centre of the work.
            </p>
          </div>
          <ul className="tick-list tick-list--two">
            {vendorProcesses.map((process) => (
              <li key={process}>{process}</li>
            ))}
          </ul>
        </div>
      </section>

      <section className="section" aria-labelledby="workflow-title">
        <div className="container">
          <div className="section-head">
            <p className="label">03 · How we work</p>
            <h2 id="workflow-title">From your drawing to a documented component</h2>
          </div>
          <ol className="steps">
            {workflow.map((step) => (
              <li key={step.title}>
                <h3>{step.title}</h3>
                <p>{step.text}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="section section--tint" aria-labelledby="work-title">
        <div className="container">
          <div className="section-head">
            <p className="label">04 · Components</p>
            <h2 id="work-title">Components from our shop</h2>
            <p>Housings, enclosures, plates and fixtures machined by Varun Industries.</p>
          </div>
          <div className="gallery gallery--three">
            <Figure photo={photos.housing300} number={2} sizes="(min-width: 1040px) 380px, (min-width: 640px) 50vw, 100vw" />
            <Figure photo={photos.flanged} number={3} sizes="(min-width: 1040px) 380px, (min-width: 640px) 50vw, 100vw" />
            <Figure photo={photos.basePlates} number={4} sizes="(min-width: 1040px) 380px, (min-width: 640px) 50vw, 100vw" />
          </div>
          <p className="more-link">
            <Link href="/components" className="text-link">
              View all components
            </Link>
          </p>
        </div>
      </section>

      <CtaBand />
    </>
  );
}
