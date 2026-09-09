import { connectToDatabase } from '@/lib/db/connect';
import { Laminate } from '@/lib/db/models/Laminate.model';
import { NotFoundError, ConflictError } from '@/lib/errors';
import { buildPaginatedMeta } from '@/lib/api/response';
import { processAndUploadImage } from '@/lib/services/image.service';
import type { LaminateInput, UpdateLaminateInput, LaminateQuery } from '@/schemas/laminate.schema';

export async function listLaminates(query: LaminateQuery) {
  await connectToDatabase();
  const { page, limit, categoryId, search, tag, finish, colorFamily, isActive, sortBy, sortOrder } =
    query;

  const filter: Record<string, unknown> = {};
  if (categoryId) filter.categoryId = categoryId;
  if (tag) filter.tags = tag;
  if (finish) filter.finish = finish;
  if (colorFamily) filter.colorFamily = colorFamily;
  if (isActive !== undefined) filter.isActive = isActive;
  if (search) {
    filter.$or = [
      { name: { $regex: search, $options: 'i' } },
      { code: { $regex: search, $options: 'i' } },
    ];
  }

  const skip = (page - 1) * limit;
  const sort: Record<string, 1 | -1> = { [sortBy]: sortOrder === 'asc' ? 1 : -1 };

  const [items, total] = await Promise.all([
    Laminate.find(filter).sort(sort).skip(skip).limit(limit).lean(),
    Laminate.countDocuments(filter),
  ]);

  return { items, meta: buildPaginatedMeta(total, page, limit) };
}

export async function getLaminateById(id: string) {
  await connectToDatabase();
  const laminate = await Laminate.findById(id).lean();
  if (!laminate) {
    throw new NotFoundError('Laminate not found');
  }
  return laminate;
}

export async function createLaminate(input: LaminateInput) {
  await connectToDatabase();
  const existing = await Laminate.findOne({ $or: [{ code: input.code }, { slug: input.slug }] });
  if (existing) {
    throw new ConflictError('A laminate with this code or slug already exists');
  }
  const laminate = new Laminate(input);
  await laminate.save();
  return laminate;
}

export async function updateLaminate(id: string, input: UpdateLaminateInput) {
  await connectToDatabase();
  const laminate = await Laminate.findByIdAndUpdate(id, input, { new: true });
  if (!laminate) {
    throw new NotFoundError('Laminate not found');
  }
  return laminate;
}

export async function archiveLaminate(id: string) {
  await connectToDatabase();
  const laminate = await Laminate.findByIdAndUpdate(
    id,
    { isActive: false, archivedAt: new Date() },
    { new: true },
  );
  if (!laminate) {
    throw new NotFoundError('Laminate not found');
  }
  return laminate;
}

export async function addLaminateImage(
  id: string,
  file: Buffer,
  altText: string,
  isPrimary: boolean,
) {
  await connectToDatabase();
  const laminate = await Laminate.findById(id);
  if (!laminate) {
    throw new NotFoundError('Laminate not found');
  }

  const url = await processAndUploadImage(file, `laminates/${id}/${Date.now()}`);

  if (isPrimary) {
    laminate.images.forEach((image) => {
      image.isPrimary = false;
    });
  }

  laminate.images.push({ url, altText, isPrimary, sortOrder: laminate.images.length });
  await laminate.save();
  return laminate;
}
