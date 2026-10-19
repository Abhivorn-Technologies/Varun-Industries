import Link from "next/link";
import { legalNavigation, mapsUrl, navigation, site } from "@/lib/site";
import { CookiePreferencesButton } from "./CookieConsent";
import styles from "./Footer.module.css";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className={styles.footer}>
      <div className={`container ${styles.grid}`}>
        <div className={styles.company}>
          <p className={styles.name}>Varun Industries</p>
          <p className={styles.tagline}>{site.tagline}</p>
          <p>
            CNC precision machining for the space, defence and telecommunications sectors. Established {site.founded}.
          </p>
        </div>

        <div>
          <h2 className={styles.heading}>Visit</h2>
          <address className={styles.address}>
            {site.address.lines.map((line) => (
              <span key={line}>{line}</span>
            ))}
          </address>
          <a href={mapsUrl} target="_blank" rel="noopener noreferrer">
            Open in Google Maps<span className="visually-hidden"> (opens in a new tab)</span>
          </a>
        </div>

        <div>
          <h2 className={styles.heading}>Contact</h2>
          <ul className={styles.list}>
            <li>{site.contactPerson}</li>
            {site.phones.map((phone) => (
              <li key={phone.tel}>
                <a href={`tel:${phone.tel}`}>{phone.display}</a>
              </li>
            ))}
            <li>
              <a href={`mailto:${site.email}`}>{site.email}</a>
            </li>
          </ul>
        </div>

        <nav aria-label="Footer">
          <h2 className={styles.heading}>Pages</h2>
          <ul className={styles.list}>
            {navigation.map((item) => (
              <li key={item.href}>
                <Link href={item.href}>{item.label}</Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      <div className="container">
        <div className={styles.bottom}>
          <p>
            © {year} {site.legalName}. All rights reserved.
          </p>
          <ul className={styles.legal}>
            {legalNavigation.map((item) => (
              <li key={item.href}>
                <Link href={item.href}>{item.label}</Link>
              </li>
            ))}
            <CookiePreferencesButton className={styles.linkButton} />
          </ul>
        </div>
      </div>
    </footer>
  );
}
