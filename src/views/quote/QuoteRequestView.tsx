import Image from 'next/image';
import { CheckCircle2 } from 'lucide-react';

import { PageHero } from '@/components/shared/PageHero';
import type { QuoteRequestItem, QuoteRequestStatus } from '@/lib/db/models/QuoteRequest.model';

const STATUS_LABELS: Record<QuoteRequestStatus, string> = {
  new: 'Received',
  contacted: 'Contacted',
  quoted: 'Quoted',
  won: 'Won',
  lost: 'Lost',
  closed: 'Closed',
};

export interface QuoteRequestViewData {
  referenceId: string;
  status: QuoteRequestStatus;
  createdAt: string;
  items: QuoteRequestItem[];
}

function itemTitle(item: QuoteRequestItem): string {
  if (item.doorSnapshot && item.laminateSnapshot) {
    return `${item.doorSnapshot.name} in ${item.laminateSnapshot.name}`;
  }
  return item.doorSnapshot?.name ?? item.laminateSnapshot?.name ?? 'Item';
}

function itemImage(item: QuoteRequestItem): string | undefined {
  return item.comboSnapshotUrl ?? item.doorSnapshot?.imageUrl ?? item.laminateSnapshot?.imageUrl;
}

export function QuoteRequestView({ data }: { data: QuoteRequestViewData }) {
  return (
    <main className="bg-background min-h-dvh">
      <PageHero
        breadcrumbLabel="Quote"
        heading={`Quote ${data.referenceId}`}
        subtext={`Submitted ${new Date(data.createdAt).toLocaleDateString('en-IN', {
          day: 'numeric',
          month: 'long',
          year: 'numeric',
        })}`}
      />

      <div className="mx-auto max-w-4xl px-6 py-10">
        <div className="bg-surface shadow-card flex items-center gap-3 rounded-md p-4">
          <span className="bg-success-bg text-success-text flex h-10 w-10 items-center justify-center rounded-full">
            <CheckCircle2 aria-hidden className="h-5 w-5" />
          </span>
          <div>
            <p className="font-body text-text-secondary text-xs uppercase tracking-wider">Status</p>
            <p className="font-display text-text-primary">{STATUS_LABELS[data.status]}</p>
          </div>
        </div>

        <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {data.items.map((item, index) => {
            const imageUrl = itemImage(item);
            return (
              <div
                key={`${itemTitle(item)}-${index}`}
                className="bg-surface shadow-card overflow-hidden rounded-md"
              >
                <div className="bg-neutral-tint relative aspect-square overflow-hidden">
                  {imageUrl ? (
                    <Image
                      src={imageUrl}
                      alt={itemTitle(item)}
                      fill
                      sizes="(min-width: 1024px) 20vw, (min-width: 640px) 33vw, 50vw"
                      className="object-cover"
                    />
                  ) : (
                    <div className="text-text-secondary font-body flex h-full items-center justify-center text-xs">
                      No image
                    </div>
                  )}
                </div>
                <div className="p-3">
                  <h3 className="font-display text-text-primary text-sm">{itemTitle(item)}</h3>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </main>
  );
}
