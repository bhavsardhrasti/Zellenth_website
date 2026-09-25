import { connectToDatabase } from '@/lib/db/connect';
import { QuoteRequest } from '@/lib/db/models/QuoteRequest.model';
import { NotFoundError, RateLimitError, ValidationError } from '@/lib/errors';
import { buildPaginatedMeta } from '@/lib/api/response';
import { verifyRecaptcha } from '@/lib/external/recaptcha';
import { sendQuoteRequestAdminEmail, sendQuoteRequestConfirmationEmail } from '@/lib/external/mail';
import type {
  QuoteRequestInput,
  QuoteRequestQuery,
  UpdateQuoteRequestInput,
} from '@/schemas/quote-request.schema';

const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000;
const RATE_LIMIT_MAX_SUBMISSIONS = 3;

function generateReferenceId(): string {
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).slice(2, 6).toUpperCase();
  return `ZL-${timestamp}-${random}`;
}

async function assertNotRateLimited(phone: string, ipAddress: string | undefined): Promise<void> {
  const since = new Date(Date.now() - RATE_LIMIT_WINDOW_MS);
  const recentCount = await QuoteRequest.countDocuments({
    createdAt: { $gte: since },
    $or: [{ phone }, ...(ipAddress ? [{ ipAddress }] : [])],
  });

  if (recentCount >= RATE_LIMIT_MAX_SUBMISSIONS) {
    throw new RateLimitError('Too many quote requests submitted recently. Please try again later.');
  }
}

export async function createQuoteRequest(input: QuoteRequestInput, ipAddress?: string) {
  await connectToDatabase();

  await assertNotRateLimited(input.phone, ipAddress);

  const recaptchaOk = await verifyRecaptcha(input.recaptchaToken);
  if (!recaptchaOk) {
    throw new ValidationError('reCAPTCHA verification failed. Please try again.');
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars -- strip recaptchaToken before persisting
  const { recaptchaToken, ...rest } = input;

  let referenceId = generateReferenceId();
  for (let attempt = 0; attempt < 3; attempt += 1) {
    const existing = await QuoteRequest.findOne({ referenceId }).select('_id').lean();
    if (!existing) break;
    referenceId = generateReferenceId();
  }

  const quoteRequest = new QuoteRequest({ ...rest, referenceId, ipAddress });
  await quoteRequest.save();

  try {
    await Promise.all([
      sendQuoteRequestAdminEmail(quoteRequest),
      sendQuoteRequestConfirmationEmail(quoteRequest),
    ]);
  } catch (error) {
    console.error('Failed to send quote request emails', error);
  }

  return quoteRequest;
}

export async function listQuoteRequests(query: QuoteRequestQuery) {
  await connectToDatabase();
  const { page, limit, status, city, dateFrom, dateTo, search } = query;

  const filter: Record<string, unknown> = {};
  if (status) filter.status = status;
  if (city) filter.city = { $regex: city, $options: 'i' };
  if (dateFrom || dateTo) {
    filter.createdAt = {
      ...(dateFrom ? { $gte: dateFrom } : {}),
      ...(dateTo ? { $lte: dateTo } : {}),
    };
  }
  if (search) {
    filter.$or = [
      { name: { $regex: search, $options: 'i' } },
      { phone: { $regex: search, $options: 'i' } },
      { email: { $regex: search, $options: 'i' } },
      { referenceId: { $regex: search, $options: 'i' } },
    ];
  }

  const skip = (page - 1) * limit;

  const [items, total] = await Promise.all([
    QuoteRequest.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
    QuoteRequest.countDocuments(filter),
  ]);

  return { items, meta: buildPaginatedMeta(total, page, limit) };
}

export async function getQuoteRequestById(id: string) {
  await connectToDatabase();
  const quoteRequest = await QuoteRequest.findById(id);
  if (!quoteRequest) {
    throw new NotFoundError('Quote request not found');
  }
  return quoteRequest;
}

export async function getQuoteRequestByReference(referenceId: string) {
  await connectToDatabase();
  const quoteRequest = await QuoteRequest.findOne({ referenceId })
    .select('referenceId items createdAt status')
    .lean();
  if (!quoteRequest) {
    throw new NotFoundError('Quote request not found');
  }
  return quoteRequest;
}

export async function updateQuoteRequest(id: string, input: UpdateQuoteRequestInput) {
  await connectToDatabase();
  const quoteRequest = await QuoteRequest.findByIdAndUpdate(id, input, { new: true });
  if (!quoteRequest) {
    throw new NotFoundError('Quote request not found');
  }
  return quoteRequest;
}
