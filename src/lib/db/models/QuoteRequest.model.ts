import { Schema, model, models, type Document, type Model } from 'mongoose';

export type QuoteRequestStatus = 'new' | 'contacted' | 'quoted' | 'won' | 'lost' | 'closed';

export interface QuoteRequestItemSnapshot {
  name: string;
  slug: string;
  imageUrl?: string;
}

export interface QuoteRequestItem {
  doorSnapshot?: QuoteRequestItemSnapshot;
  laminateSnapshot?: QuoteRequestItemSnapshot;
  comboSnapshotUrl?: string;
}

export interface QuoteRequestDocument extends Document {
  referenceId: string;
  name: string;
  phone: string;
  email?: string;
  city?: string;
  projectType?: string;
  message?: string;
  items: QuoteRequestItem[];
  status: QuoteRequestStatus;
  adminNotes?: string;
  ipAddress?: string;
  createdAt: Date;
  updatedAt: Date;
}

const quoteRequestItemSnapshotSchema = new Schema<QuoteRequestItemSnapshot>(
  {
    name: { type: String, required: true },
    slug: { type: String, required: true },
    imageUrl: { type: String },
  },
  { _id: false },
);

const quoteRequestItemSchema = new Schema<QuoteRequestItem>(
  {
    doorSnapshot: { type: quoteRequestItemSnapshotSchema },
    laminateSnapshot: { type: quoteRequestItemSnapshotSchema },
    comboSnapshotUrl: { type: String },
  },
  { _id: false },
);

const quoteRequestSchema = new Schema<QuoteRequestDocument>(
  {
    referenceId: { type: String, required: true, unique: true },
    name: { type: String, required: true, trim: true },
    phone: { type: String, required: true, trim: true },
    email: { type: String, trim: true, lowercase: true },
    city: { type: String, trim: true },
    projectType: { type: String, trim: true },
    message: { type: String, trim: true },
    items: { type: [quoteRequestItemSchema], required: true },
    status: {
      type: String,
      enum: ['new', 'contacted', 'quoted', 'won', 'lost', 'closed'],
      default: 'new',
    },
    adminNotes: { type: String, trim: true },
    ipAddress: { type: String },
  },
  { timestamps: true },
);

quoteRequestSchema.index({ status: 1, createdAt: -1 });
quoteRequestSchema.index({ phone: 1, createdAt: -1 });
quoteRequestSchema.index({ ipAddress: 1, createdAt: -1 });

export const QuoteRequest =
  (models.QuoteRequest as Model<QuoteRequestDocument>) ??
  model<QuoteRequestDocument>('QuoteRequest', quoteRequestSchema);
