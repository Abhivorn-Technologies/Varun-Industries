import mongoose, { Schema, type Model, type Document } from "mongoose";

export type ApplicationStatus =
  | "new"
  | "reviewing"
  | "shortlisted"
  | "interviewed"
  | "rejected"
  | "hired";

export interface ICareerApplication extends Document {
  reference: string;
  fullName: string;
  email: string;
  phone: string;
  position: string;
  experience: string;
  skills?: string;
  message?: string;
  resumeFileName?: string;
  resumeUrl?: string;
  status: ApplicationStatus;
  notes?: string;
  sourceIp?: string;
  createdAt: Date;
  updatedAt: Date;
}

const CareerApplicationSchema = new Schema<ICareerApplication>(
  {
    reference: { type: String, required: true, index: true },
    fullName: { type: String, required: true, trim: true, maxlength: 120 },
    email: { type: String, required: true, trim: true, lowercase: true, maxlength: 120 },
    phone: { type: String, required: true, trim: true, maxlength: 30 },
    position: { type: String, required: true, trim: true, maxlength: 150 },
    experience: { type: String, required: true, trim: true, maxlength: 50 },
    skills: { type: String, trim: true, maxlength: 1000, default: "" },
    message: { type: String, trim: true, maxlength: 5000, default: "" },
    resumeFileName: { type: String, default: "" },
    resumeUrl: { type: String, default: "" },
    status: {
      type: String,
      enum: ["new", "reviewing", "shortlisted", "interviewed", "rejected", "hired"],
      default: "new",
      index: true,
    },
    notes: { type: String, default: "" },
    sourceIp: { type: String, default: "" },
  },
  {
    timestamps: true,
  }
);

export const CareerApplication: Model<ICareerApplication> =
  mongoose.models.CareerApplication ||
  mongoose.model<ICareerApplication>("CareerApplication", CareerApplicationSchema);
