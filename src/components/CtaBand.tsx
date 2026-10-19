import Link from "next/link";
import { site } from "@/lib/site";

/** The site's single call to action: request a quote. */
export function CtaBand() {
  return (
    <section className="cta-band" aria-labelledby="cta-title">
      <div className="container cta-band__inner">
        <div>
          <h2 id="cta-title">Have a drawing ready to quote?</h2>
          <p>
            Send us the drawing, material, quantity and any secondary operations you need. We will review the
            requirement and get back to you.
          </p>
        </div>
        <div className="cta-band__actions">
          <Link href="/contact#enquiry" className="btn btn--light">
            Request a quote
          </Link>
          <span>
            or call <a href={`tel:${site.phones[0].tel}`}>{site.phones[0].display}</a>
          </span>
        </div>
      </div>
    </section>
  );
}
