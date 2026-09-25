'use client';

import { Search } from 'lucide-react';
import Link from 'next/link';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import type { Route } from 'next';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

import { Badge } from '@/components/ui/Badge';
import { Pagination } from '@/components/ui/Pagination';
import { Select } from '@/components/ui/inputs/Select';
import { TextInput } from '@/components/ui/inputs/TextInput';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeadCell,
  TableRow,
} from '@/components/ui/Table';
import { EmptyState } from '@/components/shared/EmptyState';
import { ErrorBanner } from '@/components/shared/ErrorBanner';
import { PageHeader } from '@/components/shared/PageHeader';
import { TableSkeleton } from '@/components/shared/Skeleton';
import { useApiList } from '@/hooks/useApiList';
import { apiFetch } from '@/lib/api/client';
import type { QuoteRequestItem, QuoteRequestStatus } from '@/lib/db/models/QuoteRequest.model';
import { ROUTES } from '@/utils/routes';

interface QuoteRequestRecord {
  _id: string;
  referenceId: string;
  name: string;
  phone: string;
  email?: string;
  city?: string;
  items: QuoteRequestItem[];
  status: QuoteRequestStatus;
  createdAt: string;
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

function itemsSummary(items: QuoteRequestItem[]): string {
  return items
    .map((item) => item.doorSnapshot?.name ?? item.laminateSnapshot?.name)
    .filter(Boolean)
    .join(', ');
}

export function QuoteRequestsAdminListView() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const { items, meta, isLoading, error, refetch } =
    useApiList<QuoteRequestRecord>('/api/quote-requests');
  const [searchDraft, setSearchDraft] = useState(searchParams.get('search') ?? '');
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  useEffect(() => {
    const handle = setTimeout(() => {
      if (searchDraft !== (searchParams.get('search') ?? '')) {
        updateParam('search', searchDraft);
      }
    }, 400);
    return () => clearTimeout(handle);
    // eslint-disable-next-line react-hooks/exhaustive-deps -- only re-run when the debounced draft changes
  }, [searchDraft]);

  function updateParam(key: string, value: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (value) params.set(key, value);
    else params.delete(key);
    params.set('page', '1');
    router.push(`${pathname}?${params.toString()}` as Route);
  }

  async function changeStatus(id: string, status: string) {
    setUpdatingId(id);
    const response = await apiFetch(`/api/quote-requests/${id}`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    });
    setUpdatingId(null);

    if (!response.success) {
      toast.error(response.message);
      return;
    }

    toast.success('Status updated');
    refetch();
  }

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Quote Requests"
        description="Multi-item quote requests submitted from shoppers' watchlists."
      />

      <div className="flex flex-wrap gap-3">
        <TextInput
          icon={Search}
          placeholder="Search by name, phone, email or reference"
          value={searchDraft}
          onChange={(event) => setSearchDraft(event.target.value)}
          wrapperClassName="w-72"
        />
        <Select
          placeholder="All statuses"
          isClearable
          value={searchParams.get('status') ?? ''}
          onChange={(value) => updateParam('status', value ?? '')}
          options={STATUS_OPTIONS}
          wrapperClassName="w-44"
        />
        <TextInput
          placeholder="City"
          value={searchParams.get('city') ?? ''}
          onChange={(event) => updateParam('city', event.target.value)}
          wrapperClassName="w-44"
        />
      </div>

      {error && <ErrorBanner message={error} onRetry={refetch} />}

      {isLoading ? (
        <TableSkeleton />
      ) : items.length === 0 ? (
        <EmptyState
          title="No quote requests yet"
          description="Requests submitted from the public watchlist will show up here."
        />
      ) : (
        <Table>
          <TableHead>
            <TableRow>
              <TableHeadCell>Reference</TableHeadCell>
              <TableHeadCell>Name</TableHeadCell>
              <TableHeadCell>Phone</TableHeadCell>
              <TableHeadCell>Items</TableHeadCell>
              <TableHeadCell>City</TableHeadCell>
              <TableHeadCell>Status</TableHeadCell>
              <TableHeadCell>Date</TableHeadCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {items.map((quoteRequest) => (
              <TableRow key={quoteRequest._id}>
                <TableCell>
                  <Link
                    href={ROUTES.ADMIN_QUOTE_REQUESTS_ID(quoteRequest._id) as Route}
                    className="text-brand hover:underline"
                  >
                    {quoteRequest.referenceId}
                  </Link>
                </TableCell>
                <TableCell>{quoteRequest.name}</TableCell>
                <TableCell className="text-text-secondary">{quoteRequest.phone}</TableCell>
                <TableCell className="text-text-secondary max-w-xs truncate">
                  {itemsSummary(quoteRequest.items)}
                </TableCell>
                <TableCell className="text-text-secondary">{quoteRequest.city ?? '—'}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Badge variant={STATUS_VARIANT[quoteRequest.status]}>
                      {quoteRequest.status}
                    </Badge>
                    <Select
                      value={quoteRequest.status}
                      onChange={(value) => value && changeStatus(quoteRequest._id, value)}
                      isDisabled={updatingId === quoteRequest._id}
                      options={STATUS_OPTIONS}
                      wrapperClassName="w-36"
                    />
                  </div>
                </TableCell>
                <TableCell className="text-text-secondary">
                  {new Date(quoteRequest.createdAt).toLocaleDateString()}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}

      {meta && <Pagination meta={meta} />}
    </div>
  );
}
