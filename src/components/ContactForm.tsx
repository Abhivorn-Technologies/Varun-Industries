"use client";

import Link from "next/link";
import Script from "next/script";
import { useEffect, useRef, useState, type FormEvent } from "react";
import {
  limits,
  normaliseEnquiry,
  sectorOptions,
  validateEnquiry,
  type EnquiryErrors,
  type EnquiryField,
} from "@/lib/enquiry";
import { site } from "@/lib/site";
import styles from "./ContactForm.module.css";

const TURNSTILE_SITE_KEY = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY ?? "";

type Status =
  | { kind: "idle" }
  | { kind: "submitting" }
  | { kind: "success" }
  | { kind: "error"; message: string };

const fieldOrder: EnquiryField[] = ["name", "company", "email", "phone", "sector", "message", "consent"];

function readForm(form: HTMLFormElement): Record<string, unknown> {
  const data = new FormData(form);
  return {
    name: data.get("name"),
    company: data.get("company"),
    email: data.get("email"),
    phone: data.get("phone"),
    sector: data.get("sector"),
    message: data.get("message"),
    consent: data.get("consent") === "on",
  };
}

export function ContactForm() {
  const formRef = useRef<HTMLFormElement>(null);
  const startedAt = useRef<number>(0);
  const [errors, setErrors] = useState<EnquiryErrors>({});
  const [status, setStatus] = useState<Status>({ kind: "idle" });
  const [messageLength, setMessageLength] = useState(0);
  const [preparedWhatsappUrl, setPreparedWhatsappUrl] = useState<string>("");
  const successRef = useRef<HTMLDivElement>(null);
  const errorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    startedAt.current = Date.now();
  }, []);

  useEffect(() => {
    if (status.kind === "success") successRef.current?.focus();
    if (status.kind === "error") errorRef.current?.focus();
  }, [status]);

  function focusFirstError(found: EnquiryErrors) {
    const first = fieldOrder.find((field) => found[field]);
    if (first) formRef.current?.querySelector<HTMLElement>(`[name="${first}"]`)?.focus();
  }

  // Clear a field's error as soon as the visitor fixes it. Only fields already showing an
  // error are re-checked, so nobody is told off while still typing.
  function revalidate(field: EnquiryField) {
    if (!formRef.current || !errors[field]) return;
    const next = validateEnquiry(normaliseEnquiry(readForm(formRef.current)));
    setErrors((current) => ({ ...current, [field]: next[field] }));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const raw = readForm(form);
    const found = validateEnquiry(normaliseEnquiry(raw));
    setErrors(found);

    if (Object.keys(found).length > 0) {
      setStatus({ kind: "idle" });
      focusFirstError(found);
      return;
    }

    const clean = normaliseEnquiry(raw);
    const lines = [
      "*Website Enquiry — Varun Industries*",
      "",
      `*Name:* ${clean.name}`,
      `*Company:* ${clean.company || "Not provided"}`,
      `*Email:* ${clean.email}`,
      `*Phone:* ${clean.phone || "Not provided"}`,
      `*Sector:* ${clean.sector || "Not provided"}`,
      "",
      "*Requirement:*",
      clean.message,
    ];

    const whatsappMessage = lines.join("\n");
    const whatsappUrl = `https://wa.me/${site.whatsapp.number}?text=${encodeURIComponent(whatsappMessage)}`;
    setPreparedWhatsappUrl(whatsappUrl);

    // Send API request in background (for audit/server logs)
    const data = new FormData(form);
    fetch("/api/enquiry", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...raw,
        website: data.get("website") ?? "",
        startedAt: startedAt.current,
        turnstileToken: data.get("cf-turnstile-response") ?? "",
      }),
    }).catch(() => {});

    // Open WhatsApp directly
    try {
      const win = window.open(whatsappUrl, "_blank", "noopener,noreferrer");
      if (!win) {
        window.location.href = whatsappUrl;
      }
    } catch {
      window.location.href = whatsappUrl;
    }

    form.reset();
    setMessageLength(0);
    setErrors({});
    setStatus({ kind: "success" });
  }

  function describedBy(field: EnquiryField, hint?: string) {
    return [hint, errors[field] ? `${field}-error` : null].filter(Boolean).join(" ") || undefined;
  }

  if (status.kind === "success") {
    return (
      <div ref={successRef} tabIndex={-1} className={styles.success} role="status">
        <div className={styles.successHeader}>
          <svg
            width="26"
            height="26"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{ color: "var(--success)" }}
            aria-hidden="true"
          >
            <path d="M20 6L9 17l-5-5" />
          </svg>
          <h3 style={{ margin: 0 }}>WhatsApp Opened with Your Enquiry</h3>
        </div>
        <p style={{ marginTop: "0.75rem" }}>
          Your requirement has been formatted and directed to our team on WhatsApp at{" "}
          <strong>{site.whatsapp.display}</strong>. Please press <strong>&ldquo;Send&rdquo;</strong> in WhatsApp
          to complete your message.
        </p>
        <p>
          If you have engineering drawings or CAD files to share, you can attach them directly in the chat or email them to{" "}
          <a href={`mailto:${site.email}`}>{site.email}</a>.
        </p>
        <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap", marginTop: "1.25rem" }}>
          {preparedWhatsappUrl && (
            <a
              href={preparedWhatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn--primary"
            >
              Reopen in WhatsApp
            </a>
          )}
          <button
            type="button"
            className="btn btn--outline"
            onClick={() => setStatus({ kind: "idle" })}
          >
            Send another enquiry
          </button>
        </div>
      </div>
    );
  }

  const submitting = status.kind === "submitting";

  return (
    <form ref={formRef} className={styles.form} noValidate onSubmit={handleSubmit} aria-busy={submitting}>
      {status.kind === "error" && (
        <div ref={errorRef} tabIndex={-1} className={styles.alert} role="alert">
          {status.message}
        </div>
      )}

      <div className={styles.row}>
        <Field label="Name" name="name" required error={errors.name}>
          <input
            id="name"
            name="name"
            type="text"
            autoComplete="name"
            maxLength={limits.name}
            required
            aria-invalid={Boolean(errors.name)}
            aria-describedby={describedBy("name")}
            onChange={() => revalidate("name")}
          />
        </Field>
        <Field label="Company" name="company" error={errors.company}>
          <input
            id="company"
            name="company"
            type="text"
            autoComplete="organization"
            maxLength={limits.company}
            aria-invalid={Boolean(errors.company)}
            aria-describedby={describedBy("company")}
            onChange={() => revalidate("company")}
          />
        </Field>
      </div>

      <div className={styles.row}>
        <Field label="Email" name="email" required error={errors.email}>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            inputMode="email"
            maxLength={limits.email}
            required
            aria-invalid={Boolean(errors.email)}
            aria-describedby={describedBy("email")}
            onChange={() => revalidate("email")}
          />
        </Field>
        <Field label="Phone" name="phone" error={errors.phone}>
          <input
            id="phone"
            name="phone"
            type="tel"
            autoComplete="tel"
            inputMode="tel"
            maxLength={limits.phone}
            aria-invalid={Boolean(errors.phone)}
            aria-describedby={describedBy("phone")}
            onChange={() => revalidate("phone")}
          />
        </Field>
      </div>

      <Field label="Sector" name="sector" error={errors.sector}>
        <select
          id="sector"
          name="sector"
          defaultValue=""
          onChange={() => revalidate("sector")}
          aria-invalid={Boolean(errors.sector)}
          aria-describedby={describedBy("sector")}
        >
          <option value="">Select a sector</option>
          {sectorOptions.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      </Field>

      <Field label="Your requirement" name="message" required error={errors.message}>
        <p id="message-hint" className={styles.fieldHint}>
          Describe the component: drawing number, material, quantity and timeline.
        </p>
        <textarea
          id="message"
          name="message"
          rows={7}
          maxLength={limits.message}
          required
          aria-invalid={Boolean(errors.message)}
          aria-describedby={describedBy("message", "message-hint message-count")}
          onChange={(event) => {
            setMessageLength(event.target.value.length);
            revalidate("message");
          }}
        />
        <p id="message-count" className={styles.counter}>
          {messageLength} / {limits.message} characters
        </p>
      </Field>

      {/* Honeypot: hidden from people and assistive technology; bots tend to fill it. */}
      <div className={styles.trap} aria-hidden="true">
        <label htmlFor="website">Leave this field empty</label>
        <input id="website" name="website" type="text" tabIndex={-1} autoComplete="off" />
      </div>

      <div className={styles.consent}>
        <input
          id="consent"
          name="consent"
          type="checkbox"
          required
          aria-invalid={Boolean(errors.consent)}
          aria-describedby={describedBy("consent")}
          onChange={() => revalidate("consent")}
        />
        <label htmlFor="consent">
          I agree that Varun Industries may use these details to respond to my enquiry, as described in the{" "}
          <Link href="/privacy-policy">Privacy Policy</Link>. <span aria-hidden="true">*</span>
        </label>
        {errors.consent && (
          <p id="consent-error" className={styles.error}>
            {errors.consent}
          </p>
        )}
      </div>

      {TURNSTILE_SITE_KEY && (
        <>
          <Script src="https://challenges.cloudflare.com/turnstile/v0/api.js" strategy="afterInteractive" />
          <div className="cf-turnstile" data-sitekey={TURNSTILE_SITE_KEY} data-theme="light" />
        </>
      )}

      <div className={styles.actions}>
        <button type="submit" className="btn btn--primary" disabled={submitting}>
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="currentColor"
            aria-hidden="true"
            style={{ marginRight: "0.5rem", verticalAlign: "middle" }}
          >
            <path d="M17.472 14.382c-.301-.15-1.78-.879-2.056-.98-.276-.101-.477-.15-.678.15-.2.301-.778.98-.954 1.18-.175.201-.351.226-.652.075-.301-.15-1.27-.468-2.42-1.493-.895-.798-1.5-1.784-1.676-2.085-.175-.301-.019-.464.132-.614.136-.135.301-.351.452-.527.15-.175.2-.301.301-.502.101-.2.05-.376-.025-.526-.075-.15-.678-1.635-.93-2.24-.244-.588-.493-.508-.678-.517-.175-.009-.376-.01-.577-.01-.2 0-.527.075-.803.376s-1.054 1.03-1.054 2.512c0 1.482 1.08 2.912 1.23 3.113.15.201 2.125 3.245 5.148 4.552.719.311 1.28.497 1.718.636.723.23 1.38.198 1.9.12.58-.088 1.78-.727 2.03-1.43.25-.704.25-1.306.175-1.431-.075-.125-.276-.201-.577-.351z" />
            <path d="M12 2C6.477 2 2 6.477 2 12c0 1.89.525 3.66 1.438 5.176L2 22l4.981-1.408C8.423 21.493 10.158 22 12 22c5.523 0 10-4.477 10-10S17.523 2 12 2zm0 18.2c-1.66 0-3.197-.47-4.507-1.285l-.323-.2-3.337.944.92-3.253-.21-.334C3.673 14.73 3.18 13.407 3.18 12c0-4.863 3.957-8.82 8.82-8.82 4.863 0 8.82 3.957 8.82 8.82 0 4.863-3.957 8.82-8.82 8.82z" />
          </svg>
          Send Enquiry via WhatsApp
        </button>
        <p className="visually-hidden" aria-live="polite">
          {submitting ? "Opening WhatsApp with your enquiry" : ""}
        </p>
      </div>
      <p style={{ margin: "0.65rem 0 0", fontSize: "0.875rem", color: "var(--steel-600)" }}>
        Enquiries go directly to WhatsApp at <strong>{site.whatsapp.display}</strong>.
      </p>
    </form>
  );
}

type FieldProps = {
  label: string;
  name: EnquiryField;
  required?: boolean;
  error?: string;
  children: React.ReactNode;
};

function Field({ label, name, required = false, error, children }: FieldProps) {
  return (
    <div className={styles.field} data-invalid={Boolean(error)}>
      <label htmlFor={name}>
        {label}
        {required && <span aria-hidden="true"> *</span>}
        {!required && <span className={styles.optional}> (optional)</span>}
      </label>
      {children}
      {error && (
        <p id={`${name}-error`} className={styles.error}>
          {error}
        </p>
      )}
    </div>
  );
}
