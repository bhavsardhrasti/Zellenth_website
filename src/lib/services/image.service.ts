import sharp from 'sharp';

import { uploadToR2 } from '@/lib/external/r2';
import type { ImageVariant } from '@/lib/db/models/Door.model';

const RESOLUTIONS = {
  thumbnail: 300,
  mid: 800,
  full: 1600,
} as const;

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
