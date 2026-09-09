import { Schema, model, models, type Document, type Model, type Types } from 'mongoose';

export interface ImageVariant {
  original: string;
  thumbnail: string;
  mid: string;
  full: string;
}

export interface DoorImage {
  url: ImageVariant;
  altText: string;
  caption?: string;
  isPrimary: boolean;
  sortOrder: number;
}

export interface DoorZonePoint {
  x: number;
  y: number;
}

export interface DoorZone {
  zoneId: string;
  label?: string;
  points: DoorZonePoint[];
}

export interface DoorDimensions {
  width: number;
  height: number;
  unit: 'mm' | 'inch' | 'ft';
}

export interface DoorDocument extends Document {
  code: string;
  name: string;
  slug: string;
  categoryId: Types.ObjectId;
  patternType?: string;
  dimensions?: DoorDimensions;
  description?: string;
  tags: string[];
  images: DoorImage[];
  zones: DoorZone[];
  excludedLaminateIds: Types.ObjectId[];
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

const doorImageSchema = new Schema<DoorImage>(
  {
    url: { type: imageVariantSchema, required: true },
    altText: { type: String, required: true, trim: true },
    caption: { type: String, trim: true },
    isPrimary: { type: Boolean, default: false },
    sortOrder: { type: Number, default: 0 },
  },
  { _id: false },
);

const doorZonePointSchema = new Schema<DoorZonePoint>(
  {
    x: { type: Number, required: true },
    y: { type: Number, required: true },
  },
  { _id: false },
);

const doorZoneSchema = new Schema<DoorZone>(
  {
    zoneId: { type: String, required: true },
    label: { type: String, trim: true },
    points: { type: [doorZonePointSchema], required: true },
  },
  { _id: false },
);

const doorDimensionsSchema = new Schema<DoorDimensions>(
  {
    width: { type: Number, required: true },
    height: { type: Number, required: true },
    unit: { type: String, enum: ['mm', 'inch', 'ft'], default: 'mm' },
  },
  { _id: false },
);

const doorSchema = new Schema<DoorDocument>(
  {
    code: { type: String, required: true, unique: true, trim: true },
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    categoryId: { type: Schema.Types.ObjectId, ref: 'DoorCategory', required: true },
    patternType: { type: String, trim: true },
    dimensions: { type: doorDimensionsSchema },
    description: { type: String, trim: true },
    tags: { type: [String], default: [] },
    images: { type: [doorImageSchema], default: [] },
    zones: { type: [doorZoneSchema], default: [] },
    excludedLaminateIds: [{ type: Schema.Types.ObjectId, ref: 'Laminate' }],
    isActive: { type: Boolean, default: true },
    archivedAt: { type: Date },
  },
  { timestamps: true },
);

doorSchema.index({ categoryId: 1, isActive: 1 });
doorSchema.index({ tags: 1 });

export const Door = (models.Door as Model<DoorDocument>) ?? model<DoorDocument>('Door', doorSchema);
