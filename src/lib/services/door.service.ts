import { connectToDatabase } from '@/lib/db/connect';
import { Door } from '@/lib/db/models/Door.model';
import { NotFoundError, ConflictError } from '@/lib/errors';
import { buildPaginatedMeta } from '@/lib/api/response';
import { processAndUploadImage } from '@/lib/services/image.service';
import { listLaminates } from '@/lib/services/laminate.service';
import type { DoorInput, UpdateDoorInput, DoorQuery } from '@/schemas/door.schema';
import type { LaminateQuery } from '@/schemas/laminate.schema';

export async function listDoors(query: DoorQuery) {
  await connectToDatabase();
  const { page, limit, categoryId, search, tag, isActive, sortBy, sortOrder } = query;

  const filter: Record<string, unknown> = {};
  if (categoryId) filter.categoryId = categoryId;
  if (tag) filter.tags = tag;
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
    Door.find(filter).sort(sort).skip(skip).limit(limit).lean(),
    Door.countDocuments(filter),
  ]);

  return { items, meta: buildPaginatedMeta(total, page, limit) };
}

export async function getDoorById(id: string) {
  await connectToDatabase();
  const door = await Door.findById(id).lean();
  if (!door) {
    throw new NotFoundError('Door not found');
  }
  return door;
}

export async function getDoorBySlug(slug: string) {
  await connectToDatabase();
  const door = await Door.findOne({ slug, isActive: true }).lean();
  if (!door) {
    throw new NotFoundError('Door not found');
  }
  return door;
}

export async function createDoor(input: DoorInput) {
  await connectToDatabase();
  const existing = await Door.findOne({ $or: [{ code: input.code }, { slug: input.slug }] });
  if (existing) {
    throw new ConflictError('A door with this code or slug already exists');
  }
  const door = new Door(input);
  await door.save();
  return door;
}

export async function updateDoor(id: string, input: UpdateDoorInput) {
  await connectToDatabase();
  const door = await Door.findByIdAndUpdate(id, input, { new: true });
  if (!door) {
    throw new NotFoundError('Door not found');
  }
  return door;
}

export async function archiveDoor(id: string) {
  await connectToDatabase();
  const door = await Door.findByIdAndUpdate(
    id,
    { isActive: false, archivedAt: new Date() },
    { new: true },
  );
  if (!door) {
    throw new NotFoundError('Door not found');
  }
  return door;
}

export async function addDoorImage(id: string, file: Buffer, altText: string, isPrimary: boolean) {
  await connectToDatabase();
  const door = await Door.findById(id);
  if (!door) {
    throw new NotFoundError('Door not found');
  }

  const url = await processAndUploadImage(file, `doors/${id}/${Date.now()}`);

  if (isPrimary) {
    door.images.forEach((image) => {
      image.isPrimary = false;
    });
  }

  door.images.push({ url, altText, isPrimary, sortOrder: door.images.length });
  await door.save();
  return door;
}

export async function updateDoorExclusions(id: string, excludedLaminateIds: string[]) {
  await connectToDatabase();
  const door = await Door.findByIdAndUpdate(id, { excludedLaminateIds }, { new: true });
  if (!door) {
    throw new NotFoundError('Door not found');
  }
  return door;
}

export async function getCompatibleLaminates(doorId: string, query: LaminateQuery) {
  await connectToDatabase();
  const door = await Door.findById(doorId).lean();
  if (!door) {
    throw new NotFoundError('Door not found');
  }

  return listLaminates({ ...query, isActive: true }, { excludeIds: door.excludedLaminateIds });
}
