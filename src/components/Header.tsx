"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { navigation, site } from "@/lib/site";
import emblem from "../../public/brand/varun-emblem.png";
import styles from "./Header.module.css";

export function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [lastPath, setLastPath] = useState(pathname);

  // Close the mobile menu after navigating.
  if (pathname !== lastPath) {
    setLastPath(pathname);
    setOpen(false);
  }

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  const isActive = (href: string) => (href === "/" ? pathname === "/" : pathname.startsWith(href));

  return (
    <header className={styles.header}>
      <div className={`container ${styles.bar}`}>
        <Link href="/" className={styles.brand} aria-label={`${site.name}, home`}>
          <Image src={emblem} alt="Varun Industries" width={76} height={60} priority className={styles.emblem} />
          <span className={styles.wordmark}>
            <span className={styles.name}>Varun Industries</span>
            <span className={styles.tagline}>{site.tagline}</span>
          </span>
        </Link>

        <button
          type="button"
          className={styles.toggle}
          aria-expanded={open}
          aria-controls="site-nav"
          onClick={() => setOpen((value) => !value)}
        >
          <span className={styles.toggleIcon} aria-hidden="true" data-open={open} />
          <span>{open ? "Close" : "Menu"}</span>
        </button>

        <nav id="site-nav" aria-label="Main" className={styles.nav} data-open={open}>
          <ul>
            {navigation.map((item) => (
              <li key={item.href}>
                <Link href={item.href} aria-current={isActive(item.href) ? "page" : undefined}>
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
          <Link href="/contact#enquiry" className={`btn btn--primary ${styles.cta}`}>
            Invite Us for Vendor Registration
          </Link>
        </nav>
      </div>
    </header>
  );
}
