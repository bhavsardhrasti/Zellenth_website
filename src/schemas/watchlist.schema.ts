import { z } from 'zod';

export const watchlistSnapshotSchema = z.object({
  dataUrl: z.string().startsWith('data:image/'),
});

export type WatchlistSnapshotInput = z.infer<typeof watchlistSnapshotSchema>;
