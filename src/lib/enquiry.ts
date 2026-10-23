/**
 * Enquiry form schema and validation, shared by the browser form and the
 * API route so both sides apply exactly the same rules.
 */

export type EnquiryInput = {
  name: string;
  company: string;
  email: string;
  phone: string;
  sector: string;
  message: string;
  consent: boolean;
};

export type EnquiryField = keyof EnquiryInput;
export type EnquiryErrors = Partial<Record<EnquiryField, string>>;

export const sectorOptions = ["Space", "Defence", "Telecommunications", "Pharma", "Other"] as const;

export const limits = {
  name: 100,
  company: 150,
  email: 254,
  phone: 20,
  message: 3000,
  messageMin: 20,
} as const;

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const phonePattern = /^\+?[0-9][0-9\s-]{6,18}$/;

function text(value: unknown): string {
  return typeof value === "string" ? value.trim() : "";
}

/** Coerces unknown input (form data or JSON) into a clean EnquiryInput. */
export function normaliseEnquiry(raw: Record<string, unknown>): EnquiryInput {
  return {
    name: text(raw.name),
    company: text(raw.company),
    email: text(raw.email).toLowerCase(),
    phone: text(raw.phone),
    sector: text(raw.sector),
    message: text(raw.message),
    consent: raw.consent === true || raw.consent === "on" || raw.consent === "true",
  };
}

export function validateEnquiry(input: EnquiryInput): EnquiryErrors {
  const errors: EnquiryErrors = {};

  if (!input.name) errors.name = "Please enter your name.";
  else if (input.name.length > limits.name) errors.name = `Please keep your name under ${limits.name} characters.`;

  if (input.company.length > limits.company)
    errors.company = `Please keep the company name under ${limits.company} characters.`;

  if (!input.email) errors.email = "Please enter your email address.";
  else if (input.email.length > limits.email || !emailPattern.test(input.email))
    errors.email = "Please enter a valid email address, for example name@company.com.";

  if (input.phone && !phonePattern.test(input.phone))
    errors.phone = "Please enter a valid phone number using digits, spaces or a leading +.";

  if (input.sector && !(sectorOptions as readonly string[]).includes(input.sector))
    errors.sector = "Please choose a sector from the list.";

  if (!input.message) errors.message = "Please describe the component or requirement.";
  else if (input.message.length < limits.messageMin)
    errors.message = `Please add a little more detail (at least ${limits.messageMin} characters).`;
  else if (input.message.length > limits.message)
    errors.message = `Please keep the message under ${limits.message} characters.`;

  if (!input.consent) errors.consent = "Please confirm that we may use these details to respond to you.";

  return errors;
}

/** Minimum time a person plausibly needs to fill in the form. */
export const MIN_FILL_MS = 3000;
