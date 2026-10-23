import Image from "next/image";
import Link from "next/link";
import { legalNavigation, mapsUrl, navigation, site } from "@/lib/site";
import footerLogo from "../../public/brand/footer logo.png";
import { CookiePreferencesButton } from "./CookieConsent";
import styles from "./Footer.module.css";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className={styles.footer}>
      <div className={`container ${styles.grid}`}>
        {/* Column 1 — Brand */}
        <div className={styles.brandCol}>
          <h2 className="visually-hidden">Varun Industries</h2>
          <Link href="/" className={styles.brand} aria-label={`${site.name}, home`}>
            <Image
              src={footerLogo}
              alt="Varun Industries"
              width={54}
              height={54}
              className={styles.footerLogo}
            />
            <span className={styles.wordmark}>
              <span className={styles.name}>Varun Industries</span>
              <span className={styles.tagline}>{site.tagline}</span>
            </span>
          </Link>
          <p className={styles.brandDesc}>
            CNC precision machining for the space, defence, telecommunications and pharma sectors.
          </p>
          <p className={styles.established}>Established {site.founded}.</p>
        </div>

        {/* Column 2 — Visit */}
        <div className={styles.visitCol}>
          <h2 className={styles.heading}>Visit</h2>
          <address className={styles.address}>
            {site.address.lines.map((line) => (
              <span key={line}>{line}</span>
            ))}
          </address>
          <a
            href={mapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={styles.mapLink}
          >
            Open in Google Maps
            <svg
              width="12"
              height="12"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
              className={styles.mapIcon}
            >
              <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
              <polyline points="15 3 21 3 21 9" />
              <line x1="10" y1="14" x2="21" y2="3" />
            </svg>
            <span className="visually-hidden"> (opens in a new tab)</span>
          </a>
        </div>

        {/* Column 3 — Contact */}
        <div className={styles.contactCol}>
          <h2 className={styles.heading}>Contact</h2>
          <ul className={styles.list}>
            <li className={styles.contactPerson}>{site.contactPerson}</li>
            {site.phones.map((phone) => (
              <li key={phone.tel}>
                <a href={`tel:${phone.tel}`} className={styles.contactLink}>
                  {phone.display}
                </a>
              </li>
            ))}
            <li>
              <a href={`mailto:${site.email}`} className={styles.contactLink}>
                {site.email}
              </a>
            </li>
          </ul>
        </div>

        {/* Column 4 — Pages */}
        <nav aria-label="Footer" className={styles.pagesCol}>
          <h2 className={styles.heading}>Pages</h2>
          <ul className={styles.list}>
            {navigation.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className={styles.pageLink}>
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      <div className="container">
        <div className={styles.bottom}>
          <p className={styles.copyright}>
            © {year} {site.legalName}. All rights reserved.
          </p>
          <ul className={styles.legal}>
            {legalNavigation.map((item) => (
              <li key={item.href}>
                <Link href={item.href}>{item.label}</Link>
              </li>
            ))}
            <li>
              <CookiePreferencesButton className={styles.linkButton} />
            </li>
          </ul>
        </div>

        <div className={styles.developerCredit}>
          <p className={styles.creditText}>
            Developed by{" "}
            <a
              href="https://www.abhivorn.com/"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.abhivornLink}
            >
              Abhivorn Technologies Pvt Ltd.
            </a>{" "}
            &amp;{" "}
            <a
              href="https://www.digilevelup.in/"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.digilevelupLink}
            >
              DigiLevelUp
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
