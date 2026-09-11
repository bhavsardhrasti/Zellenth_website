/**
 * One-off migration: flattens existing R2 image keys from
 *   {prefix}/{id}/{timestamp}/{variant}.webp
 * to
 *   {prefix}/{id}/{timestamp}-{variant}.webp
 *
 * Copies each object to its new key, updates the owning Door/Laminate
 * document's image URLs, then deletes the old key.
 *
 * Usage:
 *   npx tsx scripts/migrate-flatten-r2-keys.ts           (dry run, no writes)
 *   npx tsx scripts/migrate-flatten-r2-keys.ts --apply    (performs the migration)
 */
import { connectToDatabase } from '@/lib/db/connect';
import { Door } from '@/lib/db/models/Door.model';
import type { ImageVariant } from '@/lib/db/models/Door.model';
import { Laminate } from '@/lib/db/models/Laminate.model';
import { client } from '@/lib/env';
import { copyInR2, deleteFromR2 } from '@/lib/external/r2';

const OLD_KEY_PATTERN = /^(.+\/\d+)\/(original|thumbnail|mid|full)\.webp$/;

const isApply = process.argv.includes('--apply');

function keyFromUrl(url: string): string | null {
  if (!url.startsWith(client.NEXT_PUBLIC_R2_PUBLIC_URL)) {
    return null;
  }
  return url.slice(client.NEXT_PUBLIC_R2_PUBLIC_URL.length + 1);
}

function urlFromKey(key: string): string {
  return `${client.NEXT_PUBLIC_R2_PUBLIC_URL}/${key}`;
}

async function migrateVariant(url: string): Promise<string | null> {
  const oldKey = keyFromUrl(url);
  if (!oldKey) {
    return null;
  }

  const match = OLD_KEY_PATTERN.exec(oldKey);
  if (!match) {
    return null;
  }

  const [, prefix, variant] = match as unknown as [string, string, string];
  const newKey = `${prefix}-${variant}.webp`;

  if (isApply) {
    await copyInR2(oldKey, newKey);
    await deleteFromR2(oldKey);
  }

  return urlFromKey(newKey);
}

async function migrateImageVariant(variant: ImageVariant): Promise<{
  next: ImageVariant;
  changed: boolean;
}> {
  const next = { ...variant };
  let changed = false;

  for (const key of ['original', 'thumbnail', 'mid', 'full'] as const) {
    const migrated = await migrateVariant(variant[key]);
    if (migrated) {
      next[key] = migrated;
      changed = true;
    }
  }

  return { next, changed };
}

async function migrateCollection(
  label: string,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any -- shared migration helper spans two distinct Mongoose models
  model: any,
): Promise<{ docsChanged: number; variantsChanged: number }> {
  const docs = await model.find({ 'images.0': { $exists: true } });
  let docsChanged = 0;
  let variantsChanged = 0;

  for (const doc of docs) {
    let docChanged = false;

    for (const image of doc.images) {
      const { next, changed } = await migrateImageVariant(image.url);
      if (changed) {
        image.url = next;
        docChanged = true;
        variantsChanged += 1;
      }
    }

    if (docChanged) {
      docsChanged += 1;
      console.log(`  [${label}] ${doc.code ?? doc._id} — migrating ${doc.images.length} image(s)`);
      if (isApply) {
        await doc.save();
      }
    }
  }

  return { docsChanged, variantsChanged };
}

async function main() {
  console.log(
    isApply ? 'Running migration (--apply)...' : 'Dry run (pass --apply to write changes)...',
  );

  await connectToDatabase();

  const doorResult = await migrateCollection('doors', Door);
  const laminateResult = await migrateCollection('laminates', Laminate);

  console.log('\nSummary:');
  console.log(
    `  doors:     ${doorResult.docsChanged} document(s), ${doorResult.variantsChanged} image(s)`,
  );
  console.log(
    `  laminates: ${laminateResult.docsChanged} document(s), ${laminateResult.variantsChanged} image(s)`,
  );

  if (!isApply) {
    console.log('\nNo changes were written. Re-run with --apply to perform the migration.');
  }

  process.exit(0);
}

main().catch((error: unknown) => {
  console.error('Migration failed:', error);
  process.exit(1);
});
