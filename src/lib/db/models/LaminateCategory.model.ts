import { Schema, model, models, type Document, type Model, type Types } from 'mongoose';

export interface LaminateCategoryDocument extends Document {
  name: string;
  slug: string;
  parentId?: Types.ObjectId;
  isActive: boolean;
  sortOrder: number;
  createdAt: Date;
  updatedAt: Date;
}

const laminateCategorySchema = new Schema<LaminateCategoryDocument>(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    parentId: { type: Schema.Types.ObjectId, ref: 'LaminateCategory' },
    isActive: { type: Boolean, default: true },
    sortOrder: { type: Number, default: 0 },
  },
  { timestamps: true },
);

laminateCategorySchema.index({ parentId: 1, sortOrder: 1 });

export const LaminateCategory =
  (models.LaminateCategory as Model<LaminateCategoryDocument>) ??
  model<LaminateCategoryDocument>('LaminateCategory', laminateCategorySchema);
