import { Schema, model, models, type Document, type Model, type Types } from 'mongoose';

export interface DoorCategoryDocument extends Document {
  name: string;
  slug: string;
  parentId?: Types.ObjectId;
  isActive: boolean;
  sortOrder: number;
  createdAt: Date;
  updatedAt: Date;
}

const doorCategorySchema = new Schema<DoorCategoryDocument>(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    parentId: { type: Schema.Types.ObjectId, ref: 'DoorCategory' },
    isActive: { type: Boolean, default: true },
    sortOrder: { type: Number, default: 0 },
  },
  { timestamps: true },
);

doorCategorySchema.index({ parentId: 1, sortOrder: 1 });

export const DoorCategory =
  (models.DoorCategory as Model<DoorCategoryDocument>) ??
  model<DoorCategoryDocument>('DoorCategory', doorCategorySchema);
