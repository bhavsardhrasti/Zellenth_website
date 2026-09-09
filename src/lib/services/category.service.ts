import type { Model, Types } from 'mongoose';

import { connectToDatabase } from '@/lib/db/connect';
import { NotFoundError, ConflictError } from '@/lib/errors';
import { buildPaginatedMeta } from '@/lib/api/response';
import type { PaginationQuery } from '@/schemas/common.schema';

interface CategoryDocumentShape {
  name: string;
  slug: string;
  parentId?: Types.ObjectId;
  isActive: boolean;
  sortOrder: number;
}

interface CategoryInput {
  name: string;
  slug: string;
  parentId?: string | undefined;
  isActive?: boolean | undefined;
  sortOrder?: number | undefined;
}

type CategoryUpdateInput = { [K in keyof CategoryInput]?: CategoryInput[K] | undefined };

export function createCategoryService<T extends CategoryDocumentShape>(model: Model<T>) {
  async function listCategories(query: PaginationQuery & { parentId?: string | undefined }) {
    await connectToDatabase();
    const { page, limit, parentId } = query;
    const filter = parentId ? { parentId } : {};
    const skip = (page - 1) * limit;

    const [items, total] = await Promise.all([
      model.find(filter).sort({ sortOrder: 1 }).skip(skip).limit(limit).lean(),
      model.countDocuments(filter),
    ]);

    return { items, meta: buildPaginatedMeta(total, page, limit) };
  }

  async function getCategoryById(id: string) {
    await connectToDatabase();
    const category = await model.findById(id).lean();
    if (!category) {
      throw new NotFoundError('Category not found');
    }
    return category;
  }

  async function createCategory(input: CategoryInput) {
    await connectToDatabase();
    const existing = await model.findOne({ slug: input.slug });
    if (existing) {
      throw new ConflictError('A category with this slug already exists');
    }
    const category = new model(input);
    await category.save();
    return category;
  }

  async function updateCategory(id: string, input: CategoryUpdateInput) {
    await connectToDatabase();
    const category = await model.findByIdAndUpdate(id, input, { new: true });
    if (!category) {
      throw new NotFoundError('Category not found');
    }
    return category;
  }

  async function archiveCategory(id: string) {
    await connectToDatabase();
    const category = await model.findByIdAndUpdate(id, { isActive: false }, { new: true });
    if (!category) {
      throw new NotFoundError('Category not found');
    }
    return category;
  }

  return { listCategories, getCategoryById, createCategory, updateCategory, archiveCategory };
}
