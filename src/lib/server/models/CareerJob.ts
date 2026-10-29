import mongoose, { Schema, type Model, type Document } from "mongoose";

export type CareerJobStatus = "active" | "paused" | "closed";

export interface ICareerJob extends Document {
  title: string;
  department: string;
  location: string;
  jobType: string;
  experience: string;
  openings: number;
  description: string;
  requirements: string[];
  responsibilities: string[];
  status: CareerJobStatus;
  order: number;
  createdAt: Date;
  updatedAt: Date;
}

const CareerJobSchema = new Schema<ICareerJob>(
  {
    title: { type: String, required: true, trim: true, maxlength: 150 },
    department: { type: String, required: true, trim: true, default: "Machining & Production" },
    location: { type: String, required: true, trim: true, default: "Hyderabad, Telangana" },
    jobType: { type: String, required: true, trim: true, default: "Full Time" },
    experience: { type: String, required: true, trim: true, default: "1–3 years" },
    openings: { type: Number, default: 1 },
    description: { type: String, required: true, trim: true },
    requirements: { type: [String], default: [] },
    responsibilities: { type: [String], default: [] },
    status: {
      type: String,
      enum: ["active", "paused", "closed"],
      default: "active",
      index: true,
    },
    order: { type: Number, default: 0 },
  },
  {
    timestamps: true,
  }
);

export const CareerJob: Model<ICareerJob> =
  mongoose.models.CareerJob || mongoose.model<ICareerJob>("CareerJob", CareerJobSchema);
