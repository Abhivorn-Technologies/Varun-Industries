import Link from "next/link";
import { PageHeader } from "@/components/PageHeader";
import { pageMetadata } from "@/lib/metadata";
import { site } from "@/lib/site";

export const metadata = pageMetadata({
  title: "Privacy Policy",
  description:
    "How Varun Industries collects, uses and protects personal information submitted through this website, including enquiry form details and cookies.",
  path: "/privacy-policy",
});

const LAST_UPDATED = "19 October 2026";

// Sections about optional services are shown only when those services are switched on.
const analyticsEnabled = Boolean(process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID);
const turnstileEnabled = Boolean(process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY);

export default function PrivacyPolicyPage() {
  return (
    <>
      <PageHeader label="Legal" title="Privacy Policy" />
      <section className="section">
        <div className="container prose">
          <p className="updated">Last updated: {LAST_UPDATED}</p>

          <p>
            This Privacy Policy explains how {site.legalName} (&ldquo;we&rdquo;, &ldquo;us&rdquo;, &ldquo;our&rdquo;)
            handles personal information collected through this website. We process personal data in accordance with
            applicable Indian law, including the Digital Personal Data Protection Act, 2023 and the Information
            Technology Act, 2000.
          </p>

          <h2>Who we are</h2>
          <p>
            {site.legalName}, {site.address.lines.join(", ")}. You can contact us about privacy at{" "}
            <a href={`mailto:${site.email}`}>{site.email}</a> or on {site.phones[0].display}.
          </p>

          <h2>Information we collect</h2>
          <h3>Information you give us</h3>
          <p>
            When you use the enquiry form, we collect your name, email address and the details of your requirement,
            and, if you choose to provide them, your company name, phone number and sector. If you contact us by
            email, phone or WhatsApp, we receive the information you share in that communication, including any
            drawings or documents you send.
          </p>
          <h3>Information collected automatically</h3>
          <p>
            Like most websites, the servers that host this site record basic technical information for each request,
            such as your IP address, browser type, the page requested and the time of the request. When you submit
            the enquiry form, your IP address is also used briefly to limit repeated submissions and prevent abuse.
          </p>
          {analyticsEnabled && (
            <p>
              If you accept analytics cookies, Google Analytics collects information about how you use the site, such
              as pages visited, approximate location and device type. See <a href="#cookies">Cookies</a> below.
            </p>
          )}

          <h2>How we use your information</h2>
          <ul>
            <li>To respond to your enquiry and prepare quotations.</li>
            <li>To communicate with you about your requirement, orders and deliveries.</li>
            <li>To keep business records and meet our legal obligations.</li>
            <li>To protect this website against spam, abuse and security threats.</li>
            {analyticsEnabled && <li>With your consent, to understand how visitors use the site so we can improve it.</li>}
          </ul>
          <p>
            We process enquiry details on the basis of the consent you give when you submit the form, and as needed to
            respond to a request you have made. We do not sell your personal information or use it for unrelated
            marketing.
          </p>

          <h2>Who we share it with</h2>
          <p>We share personal information only where needed to run this website and respond to you:</p>
          <ul>
            <li>Our website hosting provider, which stores and serves the site.</li>
            <li>Our email service provider, which delivers enquiry form messages to our inbox.</li>
            {turnstileEnabled && (
              <li>Cloudflare, whose Turnstile service checks that form submissions come from a person.</li>
            )}
            {analyticsEnabled && <li>Google, if you accept analytics cookies.</li>}
            <li>
              Specialist process vendors, only where needed to fulfil your requirement (for example, a drawing shared
              for a plating or turning operation you have asked us to coordinate).
            </li>
            <li>Government or law enforcement authorities, where required by law.</li>
          </ul>
          <p>Some of these providers may process information on servers outside India.</p>

          <h2>How long we keep it</h2>
          <p>
            We keep enquiry details for as long as needed to respond to you and for related business and legal
            record-keeping. When information is no longer needed, we delete it.
          </p>

          <h2 id="cookies">Cookies and similar technologies</h2>
          <p>This website does not use cookies for its own operation.</p>
          {analyticsEnabled ? (
            <p>
              With your permission, we use Google Analytics, which sets cookies (named <code>_ga</code> and{" "}
              <code>_ga_*</code>) to distinguish visitors and measure site usage. These cookies are only set if you
              select &ldquo;Accept analytics&rdquo; in the cookie banner. Your choice is stored in your browser&rsquo;s
              local storage so we do not ask again on every page. You can change your choice at any time using the
              &ldquo;Cookie preferences&rdquo; link at the bottom of every page.
            </p>
          ) : (
            <p>We do not currently use analytics or advertising cookies.</p>
          )}
          {turnstileEnabled && (
            <p>
              The enquiry form uses Cloudflare Turnstile to check for automated submissions. Turnstile may process
              technical information about your browser for this purpose.
            </p>
          )}

          <h2>Your rights</h2>
          <p>Subject to applicable law, you may ask us to:</p>
          <ul>
            <li>Tell you what personal information we hold about you and how we use it.</li>
            <li>Correct, complete or update your information.</li>
            <li>Delete your information, where we are not required to keep it.</li>
            <li>Withdraw consent you have given; this does not affect processing that took place before.</li>
            <li>Nominate another person to exercise these rights on your behalf.</li>
          </ul>
          <p>
            To make a request or raise a concern, email <a href={`mailto:${site.email}`}>{site.email}</a>. If you are
            not satisfied with our response, you may approach the Data Protection Board of India.
          </p>

          <h2>Security</h2>
          <p>
            This website is served over an encrypted (HTTPS) connection, and enquiry form details are checked on our
            server before being sent to our inbox. No method of transmission or storage is completely secure, but we
            take reasonable steps to protect the information you share with us.
          </p>

          <h2>Children</h2>
          <p>This website is intended for businesses and is not directed at children.</p>

          <h2>Changes to this policy</h2>
          <p>
            We may update this policy from time to time. The date at the top of this page shows when it was last
            changed. Please also read our <Link href="/terms-and-conditions">Terms and Conditions</Link>.
          </p>
        </div>
      </section>
    </>
  );
}
