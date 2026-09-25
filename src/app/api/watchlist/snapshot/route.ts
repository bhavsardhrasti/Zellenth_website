import type { NextRequest } from 'next/server';

import { withApiHandler } from '@/lib/api/with-handler';
import { created } from '@/lib/api/response';
import { ValidationError } from '@/lib/errors';
import { uploadToR2 } from '@/lib/external/r2';
import { watchlistSnapshotSchema } from '@/schemas/watchlist.schema';
import { MAX_UPLOAD_SIZE_MB } from '@/utils/constants';

const DATA_URL_PATTERN = /^data:(image\/(?:png|jpeg|webp));base64,(.+)$/;

export const POST = withApiHandler(async (request: NextRequest) => {
  const { dataUrl } = watchlistSnapshotSchema.parse(await request.json());

  const match = DATA_URL_PATTERN.exec(dataUrl);
  if (!match) {
    throw new ValidationError('Unsupported snapshot image format');
  }

  const contentType = match[1] as string;
  const base64 = match[2] as string;
  const buffer = Buffer.from(base64, 'base64');

  if (buffer.byteLength > MAX_UPLOAD_SIZE_MB * 1024 * 1024) {
    throw new ValidationError(`Snapshot must be under ${MAX_UPLOAD_SIZE_MB}MB`);
  }

  const extension = contentType.split('/')[1];
  const key = `watchlist-snapshots/${crypto.randomUUID()}.${extension}`;
  const url = await uploadToR2(key, buffer, contentType);

  return created({ url });
});
