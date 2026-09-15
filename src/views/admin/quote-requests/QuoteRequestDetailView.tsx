'use client';

import Link from 'next/link';
import type { Route } from 'next';
import { ArrowLeft } from 'lucide-react';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Select } from '@/components/ui/inputs/Select';
import { TextAreaInput } from '@/components/ui/inputs/TextAreaInput';
import { ErrorBanner } from '@/components/shared/ErrorBanner';
import { ImageWrapper } from '@/components/shared/ImageWrapper';
import { PageHeader } from '@/components/shared/PageHeader';
import { apiFetch } from '@/lib/api/client';
import type { QuoteRequestItem, QuoteRequestStatus } from '@/lib/db/models/QuoteRequest.model';
import { ROUTES } from '@/utils/routes';

interface QuoteRequestDetail {
  _id: string;
  referenceId: string;
  name: string;
  phone: string;
  email?: string;
  city?: string;
  projectType?: string;
  message?: string;
  items: QuoteRequestItem[];
  status: QuoteRequestStatus;
  adminNotes?: string;
  createdAt: string;
  updatedAt: string;
}

const STATUS_VARIANT: Record<QuoteRequestStatus, 'success' | 'error' | 'neutral'> = {
  new: 'error',
  contacted: 'neutral',
  quoted: 'neutral',
  won: 'success',
  lost: 'error',
  closed: 'success',
};

const STATUS_OPTIONS = [
  { value: 'new', label: 'New' },
  { value: 'contacted', label: 'Contacted' },
  { value: 'quoted', label: 'Quoted' },
  { value: 'won', label: 'Won' },
  { value: 'lost', label: 'Lost' },
  { value: 'closed', label: 'Closed' },
];

function itemTitle(item: QuoteRequestItem): string {
  if (item.doorSnapshot && item.laminateSnapshot) {
    return `${item.doorSnapshot.name} in ${item.laminateSnapshot.name}`;
  }
  return item.doorSnapshot?.name ?? item.laminateSnapshot?.name ?? 'Item';
}

function itemImage(item: QuoteRequestItem): string | undefined {
  return item.comboSnapshotUrl ?? item.doorSnapshot?.imageUrl ?? item.laminateSnapshot?.imageUrl;
}

export function QuoteRequestDetailView({ id }: { id: string }) {
  const [data, setData] = useState<QuoteRequestDetail | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [adminNotes, setAdminNotes] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    let cancelled = false;
    // eslint-disable-next-line react-hooks/set-state-in-effect -- loading flag must flip synchronously when id changes, before the fetch resolves
    setIsLoading(true);
    apiFetch<QuoteRequestDetail>(`/api/quote-requests/${id}`)
      .then((response) => {
        if (cancelled) return;
        if (!response.success || !response.data) {
          setError(response.message);
          return;
        }
        setData(response.data);
        setAdminNotes(response.data.adminNotes ?? '');
      })
      .catch(() => {
        if (!cancelled) setError('Failed to load quote request.');
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [id]);

  async function changeStatus(status: string) {
    if (!data) return;
    const response = await apiFetch<QuoteRequestDetail>(`/api/quote-requests/${id}`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    });
    if (!response.success || !response.data) {
      toast.error(response.message);
      return;
    }
    setData(response.data);
    toast.success('Status updated');
  }

  async function saveNotes() {
    setIsSaving(true);
    const response = await apiFetch<QuoteRequestDetail>(`/api/quote-requests/${id}`, {
      method: 'PATCH',
      body: JSON.stringify({ adminNotes }),
    });
    setIsSaving(false);
    if (!response.success || !response.data) {
      toast.error(response.message);
      return;
    }
    setData(response.data);
    toast.success('Notes saved');
  }

  if (error) {
    return <ErrorBanner message={error} />;
  }

  if (isLoading || !data) {
    return <div className="bg-surface shadow-card h-64 animate-pulse rounded-md" />;
  }

  return (
    <div className="flex flex-col gap-6">
      <Link
        href={ROUTES.ADMIN_QUOTE_REQUESTS as Route}
        className="text-text-secondary hover:text-text-primary flex w-fit items-center gap-1 text-sm"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Quote Requests
      </Link>

      <PageHeader
        title={data.referenceId}
        description={`Submitted ${new Date(data.createdAt).toLocaleString()}`}
        action={
          <div className="flex items-center gap-2">
            <Badge variant={STATUS_VARIANT[data.status]}>{data.status}</Badge>
            <Select
              value={data.status}
              onChange={(value) => value && changeStatus(value)}
              options={STATUS_OPTIONS}
              wrapperClassName="w-40"
            />
          </div>
        }
      />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="bg-surface shadow-card flex flex-col gap-3 rounded-md p-5 lg:col-span-1">
          <h2 className="font-display text-text-primary text-h3">Customer</h2>
          <dl className="font-body text-body-sm flex flex-col gap-2">
            <div>
              <dt className="text-text-secondary">Name</dt>
              <dd className="text-text-primary">{data.name}</dd>
            </div>
            <div>
              <dt className="text-text-secondary">Phone</dt>
              <dd className="text-text-primary">{data.phone}</dd>
            </div>
            {data.email ? (
              <div>
                <dt className="text-text-secondary">Email</dt>
                <dd className="text-text-primary">{data.email}</dd>
              </div>
            ) : null}
            {data.city ? (
              <div>
                <dt className="text-text-secondary">City</dt>
                <dd className="text-text-primary">{data.city}</dd>
              </div>
            ) : null}
            {data.projectType ? (
              <div>
                <dt className="text-text-secondary">Project Type</dt>
                <dd className="text-text-primary">{data.projectType}</dd>
              </div>
            ) : null}
            {data.message ? (
              <div>
                <dt className="text-text-secondary">Message</dt>
                <dd className="text-text-primary">{data.message}</dd>
              </div>
            ) : null}
          </dl>
        </div>

        <div className="lg:col-span-2">
          <h2 className="font-display text-text-primary text-h3 mb-3">
            Items ({data.items.length})
          </h2>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
            {data.items.map((item, index) => {
              const imageUrl = itemImage(item);
              return (
                <div
                  key={`${itemTitle(item)}-${index}`}
                  className="bg-surface shadow-card overflow-hidden rounded-md"
                >
                  <div className="bg-neutral-tint relative aspect-square overflow-hidden">
                    <ImageWrapper src={imageUrl} alt={itemTitle(item)} sizes="33vw" />
                  </div>
                  <div className="p-3">
                    <h3 className="font-display text-text-primary text-sm">{itemTitle(item)}</h3>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="bg-surface shadow-card flex flex-col gap-3 rounded-md p-5">
        <h2 className="font-display text-text-primary text-h3">Admin Notes</h2>
        <TextAreaInput
          value={adminNotes}
          onChange={(event) => setAdminNotes(event.target.value)}
          rows={5}
        />
        <Button onClick={saveNotes} isLoading={isSaving} className="w-fit">
          Save Notes
        </Button>
      </div>
    </div>
  );
}
