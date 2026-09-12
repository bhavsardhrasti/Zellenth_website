import { connectToDatabase } from '@/lib/db/connect';
import { Enquiry } from '@/lib/db/models/Enquiry.model';
import { Door } from '@/lib/db/models/Door.model';
import { Laminate } from '@/lib/db/models/Laminate.model';
import { NotFoundError } from '@/lib/errors';
import { buildPaginatedMeta } from '@/lib/api/response';
import type {
  EnquiryInput,
  EnquiryQuery,
  UpdateEnquiryStatusInput,
} from '@/schemas/enquiry.schema';

export async function createEnquiry(input: EnquiryInput) {
  await connectToDatabase();

  const [door, laminate] = await Promise.all([
    input.doorId ? Door.findById(input.doorId).select('name slug').lean() : null,
    input.laminateId ? Laminate.findById(input.laminateId).select('name slug').lean() : null,
  ]);

  const enquiry = new Enquiry({
    ...input,
    doorSnapshot: door ? { name: door.name, slug: door.slug } : undefined,
    laminateSnapshot: laminate ? { name: laminate.name, slug: laminate.slug } : undefined,
  });
  await enquiry.save();
  return enquiry;
}

export async function listEnquiries(query: EnquiryQuery) {
  await connectToDatabase();
  const { page, limit, status, search } = query;

  const filter: Record<string, unknown> = {};
  if (status) filter.status = status;
  if (search) {
    filter.$or = [
      { name: { $regex: search, $options: 'i' } },
      { phone: { $regex: search, $options: 'i' } },
    ];
  }

  const skip = (page - 1) * limit;

  const [items, total] = await Promise.all([
    Enquiry.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
    Enquiry.countDocuments(filter),
  ]);

  return { items, meta: buildPaginatedMeta(total, page, limit) };
}

export async function updateEnquiryStatus(id: string, input: UpdateEnquiryStatusInput) {
  await connectToDatabase();
  const enquiry = await Enquiry.findByIdAndUpdate(id, { status: input.status }, { new: true });
  if (!enquiry) {
    throw new NotFoundError('Enquiry not found');
  }
  return enquiry;
}
