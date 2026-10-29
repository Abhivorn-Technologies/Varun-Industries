import mongoose, { Schema, type Model, type Document } from "mongoose";

export interface IGalleryItem extends Document {
  title: string;
  caption: string;
  alt: string;
  imageUrl: string;
  category: string;
  dimensions?: string;
  order: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const GalleryItemSchema = new Schema<IGalleryItem>(
  {
    title: { type: String, required: true, trim: true, maxlength: 150 },
    caption: { type: String, required: true, trim: true, maxlength: 300 },
    alt: { type: String, required: true, trim: true, maxlength: 300 },
    imageUrl: { type: String, required: true, trim: true },
    category: { type: String, required: true, trim: true, default: "Machined Parts", index: true },
    dimensions: { type: String, trim: true, default: "" },
    order: { type: Number, default: 0, index: true },
    isActive: { type: Boolean, default: true, index: true },
  },
  {
    timestamps: true,
  }
);

export const GalleryItem: Model<IGalleryItem> =
  mongoose.models.GalleryItem || mongoose.model<IGalleryItem>("GalleryItem", GalleryItemSchema);
