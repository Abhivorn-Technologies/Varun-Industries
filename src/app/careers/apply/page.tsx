"use client";

import Link from "next/link";
import { useRef, useState } from "react";
import { site } from "@/lib/site";
import styles from "./apply.module.css";

const POSITIONS = [
  "CNC Operator / Machinist",
  "Quality Control",
  "Production / Manufacturing",
  "Maintenance Technician",
  "Other",
] as const;

const EXPERIENCE_LEVELS = ["Fresher", "1–2 years", "3–5 years", "6+ years"] as const;

const WHATSAPP_PHONE = "916300026605";
const DISPLAY_WHATSAPP = "+91 63000 26605";

export default function CareerApplicationPage() {
  const [whatsappTriggered, setWhatsappTriggered] = useState(false);
  const [preparedUrl, setPreparedUrl] = useState<string | null>(null);

  // Form State
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [position, setPosition] = useState("");
  const [otherPosition, setOtherPosition] = useState("");
  const [experience, setExperience] = useState("");
  const [skills, setSkills] = useState("");
  const [message, setMessage] = useState("");
  const [consent, setConsent] = useState(false);

  // Field Errors
  const [errors, setErrors] = useState<Record<string, string>>({});

  const bannerRef = useRef<HTMLDivElement>(null);

  function validateClient(): boolean {
    const nextErrors: Record<string, string> = {};

    if (!fullName.trim() || fullName.trim().length < 2) {
      nextErrors.fullName = "Please enter your full name.";
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
    if (!email.trim() || !emailRegex.test(email.trim())) {
      nextErrors.email = "Please enter a valid email address.";
    }

    const cleanPhone = phone.replace(/\D/g, "");
    if (!phone.trim() || cleanPhone.length < 10) {
      nextErrors.phone = "Please enter a valid phone number (at least 10 digits).";
    }

    if (!position) {
      nextErrors.position = "Please select a position.";
    } else if (position === "Other" && !otherPosition.trim()) {
      nextErrors.otherPosition = "Please specify the desired position.";
    }

    if (!experience) {
      nextErrors.experience = "Please select your experience level.";
    }

    if (!consent) {
      nextErrors.consent = "Please agree to the privacy consent to continue.";
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!validateClient()) {
      return;
    }

    const selectedPosition = position === "Other" ? otherPosition.trim() : position;
    const qualificationsText = skills.trim() || "Not specified";
    const messageText = message.trim() || "None";

    const lines = [
      "Career Application — Varun Industries",
      "",
      `Name: ${fullName.trim()}`,
      `Phone: ${phone.trim()}`,
      `Email: ${email.trim()}`,
      `Position Applied For: ${selectedPosition}`,
      `Experience: ${experience}`,
      `Qualifications: ${qualificationsText}`,
      `Message: ${messageText}`,
    ];

    const whatsappMessage = lines.join("\n");
    const url = `https://wa.me/${WHATSAPP_PHONE}?text=${encodeURIComponent(whatsappMessage)}`;

    setPreparedUrl(url);
    setWhatsappTriggered(true);

    setTimeout(() => {
      bannerRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 50);

    try {
      const win = window.open(url, "_blank", "noopener,noreferrer");
      if (!win) {
        window.location.href = url;
      }
    } catch {
      window.location.href = url;
    }
  }

  return (
    <div className={styles.page}>
      {/* ---------- Header Banner ---------- */}
      <section className={styles.headerSection}>
        <div className={`container ${styles.headerContainer}`}>
          <Link href="/careers" className={styles.backLink}>
            <svg
              width="16"
              height="16"
              viewBox="0 0 20 20"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="M16 10H4M10 16l-6-6 6-6" />
            </svg>
            Back to Careers
          </Link>
          <h1 className={styles.title}>Apply for a Position</h1>
          <p className={styles.intro}>
            Tell us about your skills and experience. Applications are reviewed directly by our production and technical team via WhatsApp ({DISPLAY_WHATSAPP}).
          </p>
        </div>
      </section>

      {/* ---------- Form Card ---------- */}
      <div className={`container ${styles.formContainer}`}>
        <div className={styles.card}>
          {whatsappTriggered && preparedUrl && (
            <div ref={bannerRef} className={styles.whatsappBanner} role="status">
              <div className={styles.whatsappBannerHead}>
                <div className={styles.whatsappBadgeIcon}>
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                    <path d="M17.472 14.382c-.301-.15-1.78-.879-2.056-.98-.276-.101-.477-.15-.678.15-.2.301-.778.98-.954 1.18-.175.201-.351.226-.652.075-.301-.15-1.27-.468-2.42-1.493-.895-.798-1.5-1.784-1.676-2.085-.175-.301-.019-.464.132-.614.136-.135.301-.351.452-.527.15-.175.2-.301.301-.502.101-.2.05-.376-.025-.526-.075-.15-.678-1.635-.93-2.24-.244-.588-.493-.508-.678-.517-.175-.009-.376-.01-.577-.01-.2 0-.527.075-.803.376s-1.054 1.03-1.054 2.512c0 1.482 1.08 2.912 1.23 3.113.15.201 2.125 3.245 5.148 4.552.719.311 1.28.497 1.718.636.723.23 1.38.198 1.9.12.58-.088 1.78-.727 2.03-1.43.25-.704.25-1.306.175-1.431-.075-.125-.276-.201-.577-.351z" />
                    <path d="M12 2C6.477 2 2 6.477 2 12c0 1.89.525 3.66 1.438 5.176L2 22l4.981-1.408C8.423 21.493 10.158 22 12 22c5.523 0 10-4.477 10-10S17.523 2 12 2zm0 18.2c-1.66 0-3.197-.47-4.507-1.285l-.323-.2-3.337.944.92-3.253-.21-.334C3.673 14.73 3.18 13.407 3.18 12c0-4.863 3.957-8.82 8.82-8.82 4.863 0 8.82 3.957 8.82 8.82 0 4.863-3.957 8.82-8.82 8.82z" />
                  </svg>
                </div>
                <div>
                  <h2 className={styles.bannerTitle}>WhatsApp Opened</h2>
                  <p className={styles.bannerSubtitle}>
                    Application message prepared for <strong>{DISPLAY_WHATSAPP}</strong>
                  </p>
                </div>
              </div>
              <div className={styles.bannerContent}>
                <p>
                  Your details have been formatted in WhatsApp. <strong>Please press &ldquo;Send&rdquo; in WhatsApp</strong> to complete your application.
                </p>
                <div className={styles.bannerActionRow}>
                  <a
                    href={preparedUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.bannerReopenBtn}
                  >
                    Reopen WhatsApp
                  </a>
                </div>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate className={styles.form}>
            {/* Row 1: Name and Email */}
            <div className={styles.row}>
              <div className={styles.field} data-invalid={Boolean(errors.fullName)}>
                <label htmlFor="fullName">
                  Full Name <span aria-hidden="true">*</span>
                </label>
                <input
                  id="fullName"
                  name="fullName"
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g. Ramesh Kumar"
                  className={styles.input}
                  autoComplete="name"
                />
                {errors.fullName && <p className={styles.errorText}>{errors.fullName}</p>}
              </div>

              <div className={styles.field} data-invalid={Boolean(errors.email)}>
                <label htmlFor="email">
                  Email Address <span aria-hidden="true">*</span>
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="e.g. ramesh@example.com"
                  className={styles.input}
                  autoComplete="email"
                />
                {errors.email && <p className={styles.errorText}>{errors.email}</p>}
              </div>
            </div>

            {/* Row 2: Phone and Experience */}
            <div className={styles.row}>
              <div className={styles.field} data-invalid={Boolean(errors.phone)}>
                <label htmlFor="phone">
                  Phone Number <span aria-hidden="true">*</span>
                </label>
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="e.g. +91 98765 43210"
                  className={styles.input}
                  autoComplete="tel"
                />
                {errors.phone && <p className={styles.errorText}>{errors.phone}</p>}
              </div>

              <div className={styles.field} data-invalid={Boolean(errors.experience)}>
                <label htmlFor="experience">
                  Experience Level <span aria-hidden="true">*</span>
                </label>
                <select
                  id="experience"
                  name="experience"
                  required
                  value={experience}
                  onChange={(e) => setExperience(e.target.value)}
                  className={styles.select}
                >
                  <option value="">Select experience level</option>
                  {EXPERIENCE_LEVELS.map((lvl) => (
                    <option key={lvl} value={lvl}>
                      {lvl}
                    </option>
                  ))}
                </select>
                {errors.experience && <p className={styles.errorText}>{errors.experience}</p>}
              </div>
            </div>

            {/* Position and Optional Other Position */}
            <div className={styles.field} data-invalid={Boolean(errors.position)}>
              <label htmlFor="position">
                Position Applying For <span aria-hidden="true">*</span>
              </label>
              <select
                id="position"
                name="position"
                required
                value={position}
                onChange={(e) => setPosition(e.target.value)}
                className={styles.select}
              >
                <option value="">Select a position</option>
                {POSITIONS.map((pos) => (
                  <option key={pos} value={pos}>
                    {pos}
                  </option>
                ))}
              </select>
              {errors.position && <p className={styles.errorText}>{errors.position}</p>}
            </div>

            {position === "Other" && (
              <div className={styles.field} data-invalid={Boolean(errors.otherPosition)}>
                <label htmlFor="otherPosition">
                  Please Specify Desired Position <span aria-hidden="true">*</span>
                </label>
                <input
                  id="otherPosition"
                  name="otherPosition"
                  type="text"
                  required
                  value={otherPosition}
                  onChange={(e) => setOtherPosition(e.target.value)}
                  placeholder="e.g. Tooling Engineer / CAD-CAM Designer"
                  className={styles.input}
                />
                {errors.otherPosition && <p className={styles.errorText}>{errors.otherPosition}</p>}
              </div>
            )}

            {/* Qualifications / Skills */}
            <div className={styles.field}>
              <label htmlFor="skills">
                Qualifications & Skills <span className={styles.optional}>(e.g. ITI, Diploma, B.Tech, VMC, Fanuc, Calipers)</span>
              </label>
              <input
                id="skills"
                name="skills"
                type="text"
                value={skills}
                onChange={(e) => setSkills(e.target.value)}
                placeholder="e.g. Diploma in Mechanical, CNC Vertical Milling, Siemens / Fanuc G-Code"
                className={styles.input}
              />
            </div>

            {/* Cover Message */}
            <div className={styles.field}>
              <label htmlFor="message">
                Cover Message / Additional Information <span className={styles.optional}>(optional)</span>
              </label>
              <textarea
                id="message"
                name="message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Tell us briefly about your past projects, manufacturing experience, or availability..."
                className={styles.textarea}
                rows={3}
              />
            </div>

            {/* Privacy Consent */}
            <div className={styles.consentBox}>
              <input
                id="consent"
                name="consent"
                type="checkbox"
                required
                checked={consent}
                onChange={(e) => setConsent(e.target.checked)}
              />
              <label htmlFor="consent">
                I agree that Varun Industries may process my submitted application details for employment considerations in accordance with the{" "}
                <Link href="/privacy-policy" target="_blank">
                  Privacy Policy
                </Link>
                . <span aria-hidden="true">*</span>
              </label>
            </div>
            {errors.consent && (
              <p className={styles.errorText} style={{ marginTop: "-0.5rem" }}>
                {errors.consent}
              </p>
            )}

            {/* Submission CTA */}
            <div className={styles.actions}>
              <button
                type="submit"
                className={styles.whatsappSubmitBtn}
              >
                <svg
                  width="22"
                  height="22"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  aria-hidden="true"
                  className={styles.whatsappBtnIcon}
                >
                  <path d="M17.472 14.382c-.301-.15-1.78-.879-2.056-.98-.276-.101-.477-.15-.678.15-.2.301-.778.98-.954 1.18-.175.201-.351.226-.652.075-.301-.15-1.27-.468-2.42-1.493-.895-.798-1.5-1.784-1.676-2.085-.175-.301-.019-.464.132-.614.136-.135.301-.351.452-.527.15-.175.2-.301.301-.502.101-.2.05-.376-.025-.526-.075-.15-.678-1.635-.93-2.24-.244-.588-.493-.508-.678-.517-.175-.009-.376-.01-.577-.01-.2 0-.527.075-.803.376s-1.054 1.03-1.054 2.512c0 1.482 1.08 2.912 1.23 3.113.15.201 2.125 3.245 5.148 4.552.719.311 1.28.497 1.718.636.723.23 1.38.198 1.9.12.58-.088 1.78-.727 2.03-1.43.25-.704.25-1.306.175-1.431-.075-.125-.276-.201-.577-.351z" />
                  <path d="M12 2C6.477 2 2 6.477 2 12c0 1.89.525 3.66 1.438 5.176L2 22l4.981-1.408C8.423 21.493 10.158 22 12 22c5.523 0 10-4.477 10-10S17.523 2 12 2zm0 18.2c-1.66 0-3.197-.47-4.507-1.285l-.323-.2-3.337.944.92-3.253-.21-.334C3.673 14.73 3.18 13.407 3.18 12c0-4.863 3.957-8.82 8.82-8.82 4.863 0 8.82 3.957 8.82 8.82 0 4.863-3.957 8.82-8.82 8.82z" />
                </svg>
                Submit Application via WhatsApp
              </button>

              <p className={styles.whatsappNote}>
                Your application details will be prepared in WhatsApp for submission.
              </p>
              <p className={styles.whatsappInstruction}>
                Please press <strong>Send</strong> in WhatsApp to complete the submission.
              </p>

              <p style={{ margin: "0.5rem 0 0", fontSize: "0.84rem", color: "var(--steel-600)", textAlign: "center" }}>
                For general inquiries or drawing review, you can also reach us at{" "}
                <a href={`mailto:${site.email}`} style={{ color: "var(--navy-700)", fontWeight: 600 }}>
                  {site.email}
                </a>
                .
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
