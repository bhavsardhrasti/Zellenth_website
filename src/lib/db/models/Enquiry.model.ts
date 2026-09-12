import { Schema, model, models, type Document, type Model, type Types } from 'mongoose';

export type EnquiryStatus = 'new' | 'contacted' | 'closed';
export type EnquirySource = 'visualizer' | 'door_detail' | 'laminate_detail';

export interface EnquirySnapshot {
  name: string;
  slug: string;
}

export interface EnquiryDocument extends Document {
  name: string;
  phone: string;
  email?: string;
  message?: string;
  doorId?: Types.ObjectId;
  laminateId?: Types.ObjectId;
  doorSnapshot?: EnquirySnapshot;
  laminateSnapshot?: EnquirySnapshot;
  status: EnquiryStatus;
  source: EnquirySource;
  createdAt: Date;
  updatedAt: Date;
}

const enquirySnapshotSchema = new Schema<EnquirySnapshot>(
  {
    name: { type: String, required: true },
    slug: { type: String, required: true },
  },
  { _id: false },
);

const enquirySchema = new Schema<EnquiryDocument>(
  {
    name: { type: String, required: true, trim: true },
    phone: { type: String, required: true, trim: true },
    email: { type: String, trim: true, lowercase: true },
    message: { type: String, trim: true },
    doorId: { type: Schema.Types.ObjectId, ref: 'Door' },
    laminateId: { type: Schema.Types.ObjectId, ref: 'Laminate' },
    doorSnapshot: { type: enquirySnapshotSchema },
    laminateSnapshot: { type: enquirySnapshotSchema },
    status: { type: String, enum: ['new', 'contacted', 'closed'], default: 'new' },
    source: {
      type: String,
      enum: ['visualizer', 'door_detail', 'laminate_detail'],
      required: true,
    },
  },
  { timestamps: true },
);

enquirySchema.index({ status: 1, createdAt: -1 });

export const Enquiry =
  (models.Enquiry as Model<EnquiryDocument>) ?? model<EnquiryDocument>('Enquiry', enquirySchema);
