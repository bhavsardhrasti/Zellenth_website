import sharp from 'sharp';

import { uploadToR2 } from '@/lib/external/r2';
import { ValidationError } from '@/lib/errors';
import { ALLOWED_IMAGE_MIME_TYPES, MAX_UPLOAD_SIZE_MB } from '@/utils/constants';
import type { ImageVariant } from '@/lib/db/models/Door.model';

const RESOLUTIONS = {
  thumbnail: 300,
  mid: 800,
  full: 1600,
} as const;

type AllowedImageMimeType = (typeof ALLOWED_IMAGE_MIME_TYPES)[number];

function isAllowedImageMimeType(value: string): value is AllowedImageMimeType {
  return (ALLOWED_IMAGE_MIME_TYPES as readonly string[]).includes(value);
}

export interface ParsedImageUpload {
  buffer: Buffer;
  altText: string;
  isPrimary: boolean;
}

export async function parseImageUploadFormData(formData: FormData): Promise<ParsedImageUpload> {
  const file = formData.get('file');
  const altText = formData.get('altText');
  const isPrimary = formData.get('isPrimary') === 'true';

  if (!(file instanceof File)) {
    throw new ValidationError('A file is required');
  }
  if (typeof altText !== 'string' || altText.trim().length === 0) {
    throw new ValidationError('altText is required');
  }
  if (!isAllowedImageMimeType(file.type)) {
    throw new ValidationError('Unsupported image type');
  }
  if (file.size > MAX_UPLOAD_SIZE_MB * 1024 * 1024) {
    throw new ValidationError(`Image must be under ${MAX_UPLOAD_SIZE_MB}MB`);
  }

  const buffer = Buffer.from(await file.arrayBuffer());
  return { buffer, altText, isPrimary };
}

export async function processAndUploadImage(
  buffer: Buffer,
  keyPrefix: string,
): Promise<ImageVariant> {
  const originalKey = `${keyPrefix}/original.webp`;
  const original = await uploadToR2(
    originalKey,
    await sharp(buffer).webp({ quality: 90 }).toBuffer(),
    'image/webp',
  );

  const variantEntries = await Promise.all(
    (Object.entries(RESOLUTIONS) as [keyof typeof RESOLUTIONS, number][]).map(
      async ([name, width]) => {
        const resized = await sharp(buffer)
          .resize({ width, withoutEnlargement: true })
          .webp({ quality: 85 })
          .toBuffer();
        const url = await uploadToR2(`${keyPrefix}/${name}.webp`, resized, 'image/webp');
        return [name, url] as const;
      },
    ),
  );

  const variants = Object.fromEntries(variantEntries) as Record<keyof typeof RESOLUTIONS, string>;

  return {
    original,
    thumbnail: variants.thumbnail,
    mid: variants.mid,
    full: variants.full,
  };
}
