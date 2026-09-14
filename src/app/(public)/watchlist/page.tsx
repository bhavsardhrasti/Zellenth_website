import type { Metadata } from 'next';

import WatchlistView from '@/views/watchlist/WatchlistView';

export const metadata: Metadata = {
  title: 'Watchlist | Zellenth',
  description: 'Doors and laminates you have saved to revisit later.',
};

export default function WatchlistPage() {
  return <WatchlistView />;
}
