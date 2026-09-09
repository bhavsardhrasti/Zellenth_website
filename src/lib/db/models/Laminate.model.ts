import { Schema, model, models, type Document, type Model, type Types } from 'mongoose';

import type { ImageVariant } from './Door.model';

export type LaminateFinish = 'matte' | 'gloss' | 'textured';
export type LaminateGrainDirection = 'horizontal' | 'vertical' | 'no-grain';

export interface LaminateTexture {
  url: ImageVariant;
  altText: string;
  isPrimary: boolean;
  sortOrder: number;
}

export interface LaminateDocument extends Document {
  code: string;
  name: string;
  slug: string;
  categoryId: Types.ObjectId;
  finish: LaminateFinish;
  colorFamily: string;
  collectionName?: string;
  size?: string;
  priceBracket?: string;
  grainDirection: LaminateGrainDirection;
  patternScale?: number;
  description?: string;
  tags: string[];
  images: LaminateTexture[];
  isActive: boolean;
  archivedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const imageVariantSchema = new Schema<ImageVariant>(
  {
    original: { type: String, required: true },
    thumbnail: { type: String, required: true },
    mid: { type: String, required: true },
    full: { type: String, required: true },
  },
  { _id: false },
);

const laminateTextureSchema = new Schema<LaminateTexture>(
  {
    url: { type: imageVariantSchema, required: true },
    altText: { type: String, required: true, trim: true },
    isPrimary: { type: Boolean, default: false },
    sortOrder: { type: Number, default: 0 },
  },
  { _id: false },
);

const laminateSchema = new Schema<LaminateDocument>(
  {
    code: { type: String, required: true, unique: true, trim: true },
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    categoryId: { type: Schema.Types.ObjectId, ref: 'LaminateCategory', required: true },
    finish: { type: String, enum: ['matte', 'gloss', 'textured'], required: true },
    colorFamily: { type: String, required: true, trim: true },
    collectionName: { type: String, trim: true },
    size: { type: String, trim: true },
    priceBracket: { type: String, trim: true },
    grainDirection: {
      type: String,
      enum: ['horizontal', 'vertical', 'no-grain'],
      required: true,
    },
    patternScale: { type: Number },
    description: { type: String, trim: true },
    tags: { type: [String], default: [] },
    images: { type: [laminateTextureSchema], default: [] },
    isActive: { type: Boolean, default: true },
    archivedAt: { type: Date },
  },
  { timestamps: true },
);

laminateSchema.index({ categoryId: 1, isActive: 1 });
laminateSchema.index({ colorFamily: 1, finish: 1 });
laminateSchema.index({ tags: 1 });

export const Laminate =
  (models.Laminate as Model<LaminateDocument>) ??
  model<LaminateDocument>('Laminate', laminateSchema);
