import Link from "next/link";
import { PageHeader } from "@/components/PageHeader";
import { pageMetadata } from "@/lib/metadata";
import { site } from "@/lib/site";

export const metadata = pageMetadata({
  title: "Terms and Conditions",
  description: "Terms and conditions for using the Varun Industries website and submitting enquiries.",
  path: "/terms-and-conditions",
});

const LAST_UPDATED = "19 October 2026";

export default function TermsPage() {
  return (
    <>
      <PageHeader label="Legal" title="Terms and Conditions" />
      <section className="section">
        <div className="container prose">
          <p className="updated">Last updated: {LAST_UPDATED}</p>

          <p>
            These terms apply to your use of this website, operated by {site.legalName}, {site.address.lines.join(", ")}
            . By using the website, you agree to these terms. If you do not agree, please do not use the website.
          </p>

          <h2>Use of the website</h2>
          <p>
            You may use this website to learn about our services and to contact us. You must not misuse the website,
            including by attempting to gain unauthorised access to it, interfering with its operation, submitting
            false or misleading information, or sending unsolicited or automated messages through the enquiry form.
          </p>

          <h2>Information on this website</h2>
          <p>
            The content of this website is provided for general information about {site.name} and its services. We
            take care to keep it accurate, but it may not always be complete or current, and it does not form an
            offer or a contract. Photographs show examples of components and are for illustration only.
          </p>

          <h2>Enquiries, quotations and orders</h2>
          <p>
            Submitting an enquiry does not create a contract or oblige either party to proceed. Any quotation we
            provide is subject to the terms stated in that quotation. Orders are governed by the written quotation,
            purchase order or agreement accepted by both parties, which takes precedence over these website terms.
          </p>

          <h2>Drawings and technical information</h2>
          <p>
            Drawings, specifications and other technical information you send us remain your property. We use them
            to evaluate, quote and fulfil your requirement, and where needed share them with specialist process
            vendors involved in that requirement. Where you need a formal confidentiality agreement, please let us
            know before sharing the information.
          </p>

          <h2>Intellectual property</h2>
          <p>
            The {site.name} name, logo, photographs, text and design of this website belong to {site.legalName}{" "}
            unless stated otherwise. You may view and print pages for your own reference, but you may not copy,
            reproduce or reuse them for any other purpose without our written permission.
          </p>

          <h2>Links to other websites</h2>
          <p>
            This website links to services such as Google Maps and WhatsApp. We are not responsible for the content
            or privacy practices of other websites, and their own terms apply when you use them.
          </p>

          <h2>Limitation of liability</h2>
          <p>
            To the extent permitted by law, {site.legalName} is not liable for any loss or damage arising from the use
            of, or inability to use, this website or from reliance on its content. Nothing in these terms limits any
            liability that cannot be limited under applicable law.
          </p>

          <h2>Privacy</h2>
          <p>
            How we handle personal information is explained in our <Link href="/privacy-policy">Privacy Policy</Link>.
          </p>

          <h2>Governing law</h2>
          <p>
            These terms are governed by the laws of India. The courts at Hyderabad, Telangana have exclusive
            jurisdiction over any dispute arising from them.
          </p>

          <h2>Changes to these terms</h2>
          <p>
            We may update these terms from time to time. The date at the top of this page shows when they were last
            changed.
          </p>

          <h2>Contact</h2>
          <p>
            Questions about these terms can be sent to <a href={`mailto:${site.email}`}>{site.email}</a>.
          </p>
        </div>
      </section>
    </>
  );
}
