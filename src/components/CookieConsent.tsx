"use client";

import Link from "next/link";
import Script from "next/script";
import { useSyncExternalStore } from "react";
import styles from "./CookieConsent.module.css";

/**
 * Cookie consent for optional analytics.
 *
 * The site itself sets no cookies. Google Analytics is only configured when
 * NEXT_PUBLIC_GA_MEASUREMENT_ID is set, and its script is only loaded after the
 * visitor accepts. Without a measurement ID there is nothing to consent to, so
 * neither the banner nor the preferences link is shown.
 */

const GA_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID ?? "";
const STORAGE_KEY = "vi-cookie-consent";
const EVENT = "vi-consent-change";

type Choice = "granted" | "denied" | "unset";

function readChoice(): Choice {
  try {
    const value = window.localStorage.getItem(STORAGE_KEY);
    return value === "granted" || value === "denied" ? value : "unset";
  } catch {
    return "unset";
  }
}

function writeChoice(choice: Choice) {
  try {
    if (choice === "unset") window.localStorage.removeItem(STORAGE_KEY);
    else window.localStorage.setItem(STORAGE_KEY, choice);
  } catch {
    // Storage can be unavailable (private mode); the choice then lasts for this page view.
  }
  window.dispatchEvent(new CustomEvent<Choice>(EVENT, { detail: choice }));
}

let memoryChoice: Choice | null = null;

function subscribe(callback: () => void) {
  const onChange = (event: Event) => {
    memoryChoice = (event as CustomEvent<Choice>).detail;
    callback();
  };
  window.addEventListener(EVENT, onChange);
  window.addEventListener("storage", callback);
  return () => {
    window.removeEventListener(EVENT, onChange);
    window.removeEventListener("storage", callback);
  };
}

function getSnapshot(): Choice {
  const stored = readChoice();
  return stored === "unset" && memoryChoice ? memoryChoice : stored;
}

// During server rendering nothing is shown; the banner appears after hydration.
function getServerSnapshot(): Choice | "server" {
  return "server";
}

function useConsent() {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
}

export function CookieConsent() {
  const choice = useConsent();
  if (!GA_ID) return null;

  return (
    <>
      {choice === "granted" && (
        <>
          <Script src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`} strategy="afterInteractive" />
          <Script id="ga-init" strategy="afterInteractive">
            {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${GA_ID}',{anonymize_ip:true});`}
          </Script>
        </>
      )}

      {choice === "unset" && (
        <section className={styles.banner} aria-label="Cookie consent" role="region">
          <div className={styles.inner}>
            <p className={styles.text}>
              We would like to use Google Analytics cookies to understand how visitors use this site. They are only set
              if you accept. See our <Link href="/privacy-policy#cookies">Privacy Policy</Link>.
            </p>
            <div className={styles.actions}>
              <button type="button" className="btn btn--light" onClick={() => writeChoice("granted")}>
                Accept analytics
              </button>
              <button type="button" className="btn btn--outline-light" onClick={() => writeChoice("denied")}>
                Decline
              </button>
            </div>
          </div>
        </section>
      )}
    </>
  );
}

/** Footer link that lets visitors change their earlier choice. */
export function CookiePreferencesButton({ className }: { className?: string }) {
  const choice = useConsent();
  if (!GA_ID || choice === "server") return null;

  return (
    <li>
      <button
        type="button"
        className={className}
        onClick={() => {
          // Analytics cookies already set are removed by reloading without consent.
          const wasGranted = choice === "granted";
          writeChoice("unset");
          if (wasGranted) {
            document.cookie.split(";").forEach((cookie) => {
              const name = cookie.split("=")[0].trim();
              if (name.startsWith("_ga")) {
                document.cookie = `${name}=; Max-Age=0; path=/; domain=.${location.hostname.replace(/^www\./, "")}`;
                document.cookie = `${name}=; Max-Age=0; path=/`;
              }
            });
            window.location.reload();
          }
        }}
      >
        Cookie preferences
      </button>
    </li>
  );
}
