import Image from "next/image";
import { CtaBand } from "@/components/CtaBand";
import { PageHeader } from "@/components/PageHeader";
import { pageMetadata } from "@/lib/metadata";
import { site } from "@/lib/site";
import logo from "../../../public/brand/varun-industries-logo.png";

export const metadata = pageMetadata({
  title: "About Us",
  description:
    "Established in 2013 in Hyderabad, Varun Industries manufactures precision components for the space, defence, telecom and pharma sectors. Read our vision and mission.",
  path: "/about",
});

export default function AboutPage() {
  return (
    <>
      <PageHeader
        label="About Varun Industries"
        title="Precision components, built around your requirements"
        intro="Established in 2013, we manufacture precision components for customers in the space, defence, telecommunications and pharma sectors."
      />

      <section className="section" aria-labelledby="about-title">
        <div className="container split split--wide-left">
          <div className="prose">
            <h2 id="about-title">About us</h2>
            <p>
              At Varun Industries, we manufacture precision components for customers in the space, defence,
              telecommunications, and pharma sectors. Established in 2013, we combine CNC machining expertise with a practical
              understanding of the accuracy, inspection, and traceability these applications demand. We work closely
              with our customers to understand their drawings, specifications, quantities, and production
              requirements, then coordinate the machining processes needed to manufacture their components.
            </p>
            <p>
              Our in-house capabilities include CNC vertical milling, drilling, tapping, and engraving. Our
              manufacturing infrastructure includes BFW XTRON 544 and BFW Chandra CNC vertical milling centres,
              supported by dedicated drilling, tapping, and engraving equipment. We also coordinate with specialist
              vendors when a project requires additional processes, including wire EDM and wire-cut machining, CNC
              turning, special fasteners and hardware, surface treatment, plating, and other secondary operations.
            </p>
            <p>
              We place strong emphasis on careful inspection and systematic production documentation throughout the
              manufacturing cycle. By combining our in-house capabilities with coordinated support for additional
              processes, we help customers manage a broader range of component manufacturing requirements. At Varun
              Industries, our work is guided by three principles: precision, quality, and trust.
            </p>
          </div>
          <aside aria-label="Company at a glance">
            <div className="panel">
              <Image
                src={logo}
                alt="Varun Industries logo: a navy and silver V with a milling cutter, aircraft and rocket, and the words Precision Without Compromise"
                sizes="(min-width: 900px) 420px, 100vw"
              />
              <table className="spec-table spec-table--spaced">
                <caption>At a glance</caption>
                <tbody>
                  <tr>
                    <th scope="row">Established</th>
                    <td>{site.founded}</td>
                  </tr>
                  <tr>
                    <th scope="row">Location</th>
                    <td>Prashanth Nagar, Hyderabad, Telangana</td>
                  </tr>
                  <tr>
                    <th scope="row">Sectors</th>
                    <td>{site.sectors.join(", ")}</td>
                  </tr>
                  <tr>
                    <th scope="row">Contact</th>
                    <td>{site.contactPerson}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </aside>
        </div>
      </section>

      <section className="section section--tint" aria-labelledby="values-title">
        <div className="container">
          <div className="section-head">
            <p className="label">Our principles</p>
            <h2 id="values-title">Precision, quality and trust</h2>
          </div>
          <ul className="values">
            {site.values.map((value) => (
              <li key={value}>{value}</li>
            ))}
          </ul>
        </div>
      </section>

      <section className="section" aria-labelledby="vision-title">
        <div className="container split">
          <div className="prose">
            <p className="label">Our vision</p>
            <h2 id="vision-title">Lasting partnerships built on attention to detail</h2>
            <p>
              Our vision is to build lasting partnerships with customers who rely on precision-manufactured
              components for space, defence, telecommunications, and pharma applications. We aspire to be recognized for
              understanding customer requirements, approaching each project with care, and coordinating the
              manufacturing processes needed to meet its specifications.
            </p>
            <p>
              We believe a dependable manufacturing partnership is built through consistent attention to detail. That
              means listening carefully to the customer, understanding the drawings and production requirements,
              applying appropriate inspection procedures, and maintaining systematic documentation throughout the
              production cycle. As customer requirements evolve, we aim to strengthen our capabilities and our network
              of specialist process partners so we can support a wider range of machining and secondary-operation
              needs.
            </p>
            <p>
              Our goal is to make component manufacturing coordination more straightforward for our customers by
              bringing together in-house CNC milling, drilling, tapping, and engraving with access to additional
              processes through our vendor network. We will continue working toward a reputation grounded in technical
              care, responsive coordination, and the values that define us: precision, quality, and trust.
            </p>
          </div>
          <div className="prose">
            <p className="label">Our mission</p>
            <h2 id="mission-title">Components made to your drawings and specifications</h2>
            <p>
              Our mission is to manufacture precision components in line with the drawings, specifications,
              quantities, and production requirements provided by our customers. We begin by understanding the details
              of each requirement and identifying the machining and secondary operations needed to support it. Our
              in-house services include CNC vertical milling, drilling, tapping, and engraving, backed by inspection
              procedures and systematic production documentation.
            </p>
            <p>
              When a project calls for processes beyond our in-house capabilities, we coordinate with specialist
              vendors for services such as wire EDM and wire-cut machining, CNC turning, special fasteners and
              hardware, surface treatment, plating, and other secondary operations. This coordinated approach enables
              us to support a broader set of component manufacturing requirements while keeping the customer’s
              specifications at the centre of the work.
            </p>
            <p>
              We are committed to clear communication, careful coordination, and quality-conscious manufacturing
              throughout the production cycle. By combining our machining capabilities with suitable process support,
              we aim to help customers manage their component requirements with confidence. We serve the space,
              defence, telecommunications, and pharma sectors with a commitment to precision, quality, and trust.
            </p>
          </div>
        </div>
      </section>

      <CtaBand />
    </>
  );
}
