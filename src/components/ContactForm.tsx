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

    const data = new FormData(form);
    setStatus({ kind: "submitting" });

    try {
      const response = await fetch("/api/enquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...raw,
          website: data.get("website") ?? "",
          startedAt: startedAt.current,
          turnstileToken: data.get("cf-turnstile-response") ?? "",
        }),
      });
      const result = (await response.json().catch(() => ({}))) as {
        ok?: boolean;
        message?: string;
        errors?: EnquiryErrors;
      };

      if (response.ok && result.ok) {
        form.reset();
        setMessageLength(0);
        setErrors({});
        setStatus({ kind: "success" });
        return;
      }

      if (result.errors) {
        setErrors(result.errors);
        focusFirstError(result.errors);
      }
      setStatus({
        kind: "error",
        message: result.message ?? "Something went wrong while sending your enquiry. Please try again.",
      });
      resetTurnstile();
    } catch {
      setStatus({
        kind: "error",
        message: `We could not reach the server. Please check your connection, or email ${site.email}.`,
      });
      resetTurnstile();
    }
  }

  function describedBy(field: EnquiryField, hint?: string) {
    return [hint, errors[field] ? `${field}-error` : null].filter(Boolean).join(" ") || undefined;
  }

  if (status.kind === "success") {
    return (
      <div ref={successRef} tabIndex={-1} className={styles.success} role="status">
        <h3>Thank you, your enquiry has been sent.</h3>
        <p>
          We will review your requirement and reply to the email address you provided. If you have drawings to share,
          please email them to <a href={`mailto:${site.email}`}>{site.email}</a>.
        </p>
        <button type="button" className="btn btn--outline" onClick={() => setStatus({ kind: "idle" })}>
          Send another enquiry
        </button>
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
          Describe the component: drawing number, material, quantity, timeline and any secondary operations.
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
          {submitting ? "Sending…" : "Send enquiry"}
        </button>
        <p className="visually-hidden" aria-live="polite">
          {submitting ? "Sending your enquiry" : ""}
        </p>
      </div>
    </form>
  );
}

function resetTurnstile() {
  const turnstile = (window as unknown as { turnstile?: { reset: () => void } }).turnstile;
  turnstile?.reset();
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
