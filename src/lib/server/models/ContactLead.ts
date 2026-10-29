import mongoose, { Schema, type Model, type Document } from "mongoose";

export type ContactLeadStatus = "new" | "contacted" | "in_progress" | "closed" | "archived";

export interface IContactLead extends Document {
  fullName: string;
  email: string;
  phone: string;
  company?: string;
  service?: string;
  message: string;
  status: ContactLeadStatus;
  starred: boolean;
  notes?: string;
  sourceIp?: string;
  createdAt: Date;
  updatedAt: Date;
}

const ContactLeadSchema = new Schema<IContactLead>(
  {
    fullName: { type: String, required: true, trim: true, maxlength: 120 },
    email: { type: String, required: true, trim: true, lowercase: true, maxlength: 120 },
    phone: { type: String, required: true, trim: true, maxlength: 30 },
    company: { type: String, trim: true, maxlength: 120, default: "" },
    service: { type: String, trim: true, maxlength: 100, default: "General Machining" },
    message: { type: String, required: true, trim: true, maxlength: 5000 },
    status: {
      type: String,
      enum: ["new", "contacted", "in_progress", "closed", "archived"],
      default: "new",
      index: true,
    },
    starred: { type: Boolean, default: false },
    notes: { type: String, default: "" },
    sourceIp: { type: String, default: "" },
  },
  {
    timestamps: true,
  }
);

// Prevent re-compilation of model across Next.js reloads
export const ContactLead: Model<IContactLead> =
  mongoose.models.ContactLead || mongoose.model<IContactLead>("ContactLead", ContactLeadSchema);
