import { ContactForm } from "@/components/ContactForm";
import { PageHeader } from "@/components/PageHeader";
import { pageMetadata } from "@/lib/metadata";
import { mapsUrl, site } from "@/lib/site";
import styles from "./contact.module.css";

export const metadata = pageMetadata({
  title: "Contact and Invite For Vendor Request",
  description:
    "Invite Varun Industries, Hyderabad for vendor requests. Call +91 77949 87472 or +91 73867 93251, email varunindustries2013@gmail.com, or send your requirement online.",
  path: "/contact",
});

export default function ContactPage() {
  return (
    <>
      <PageHeader
        label="Contact"
        title="Invite For Vendor Request"
        intro="Tell us about your component and we will review the requirement. You can also call, message us on WhatsApp or email your drawings directly."
      />

      <section className="section">
        <div className={`container ${styles.layout}`}>
          <div id="enquiry" className={styles.formColumn}>
            <h2>Send an enquiry</h2>
            <p className={styles.hint}>
              Fields marked <span aria-hidden="true">*</span>
              <span className="visually-hidden">with an asterisk</span> are required.
            </p>
            <ContactForm />
          </div>

          <aside className={styles.details} aria-labelledby="details-title">
            <h2 id="details-title" className={styles.detailsTitle}>
              Contact details
            </h2>

            <dl className={styles.list}>
              <div>
                <dt>Contact person</dt>
                <dd>{site.contactPerson}</dd>
              </div>
              <div>
                <dt>Phone</dt>
                <dd>
                  {site.phones.map((phone) => (
                    <a key={phone.tel} href={`tel:${phone.tel}`}>
                      {phone.display}
                    </a>
                  ))}
                </dd>
              </div>
              <div>
                <dt>WhatsApp</dt>
                <dd>
                  {site.phones.map((phone) => (
                    <a key={phone.whatsapp} href={`https://wa.me/${phone.whatsapp}`} target="_blank" rel="noopener noreferrer">
                      {phone.display}
                      <span className="visually-hidden"> on WhatsApp (opens in a new tab)</span>
                    </a>
                  ))}
                </dd>
              </div>
              <div>
                <dt>Email</dt>
                <dd>
                  <a href={`mailto:${site.email}`}>{site.email}</a>
                </dd>
              </div>
              <div>
                <dt>Address</dt>
                <dd>
                  <address>
                    {site.address.lines.map((line) => (
                      <span key={line}>{line}</span>
                    ))}
                  </address>
                  <a href={mapsUrl} target="_blank" rel="noopener noreferrer">
                    Open in Google Maps<span className="visually-hidden"> (opens in a new tab)</span>
                  </a>
                </dd>
              </div>
            </dl>

            <div className={styles.checklist}>
              <h3>Helpful to include</h3>
              <ul className="tick-list">
                <li>Drawing number and revision</li>
                <li>Material and quantity</li>
                <li>Required delivery timeline</li>
                <li>Any plating, surface treatment or other secondary operations</li>
              </ul>
              <p>
                Drawings can be emailed to <a href={`mailto:${site.email}`}>{site.email}</a>.
              </p>
            </div>
          </aside>
        </div>
      </section>
    </>
  );
}
