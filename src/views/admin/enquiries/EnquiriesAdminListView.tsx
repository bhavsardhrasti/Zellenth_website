'use client';

import { Search } from 'lucide-react';
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
import type { EnquirySnapshot, EnquirySource, EnquiryStatus } from '@/lib/db/models/Enquiry.model';

interface EnquiryRecord {
  _id: string;
  name: string;
  phone: string;
  email?: string;
  message?: string;
  doorSnapshot?: EnquirySnapshot;
  laminateSnapshot?: EnquirySnapshot;
  status: EnquiryStatus;
  source: EnquirySource;
  createdAt: string;
}

const STATUS_VARIANT: Record<EnquiryStatus, 'success' | 'error' | 'neutral'> = {
  new: 'error',
  contacted: 'neutral',
  closed: 'success',
};

const SOURCE_LABEL: Record<EnquirySource, string> = {
  visualizer: 'Visualizer',
  door_detail: 'Door page',
  laminate_detail: 'Laminate page',
};

const STATUS_OPTIONS = [
  { value: 'new', label: 'New' },
  { value: 'contacted', label: 'Contacted' },
  { value: 'closed', label: 'Closed' },
];

export function EnquiriesAdminListView() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const { items, meta, isLoading, error, refetch } = useApiList<EnquiryRecord>('/api/enquiries');
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
    const response = await apiFetch(`/api/enquiries/${id}`, {
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
        title="Enquiries"
        description="Leads submitted by shoppers from the visualizer, doors and laminates pages."
      />

      <div className="flex flex-wrap gap-3">
        <TextInput
          icon={Search}
          placeholder="Search by name or phone"
          value={searchDraft}
          onChange={(event) => setSearchDraft(event.target.value)}
          wrapperClassName="w-64"
        />
        <Select
          placeholder="All statuses"
          isClearable
          value={searchParams.get('status') ?? ''}
          onChange={(value) => updateParam('status', value ?? '')}
          options={STATUS_OPTIONS}
          wrapperClassName="w-44"
        />
      </div>

      {error && <ErrorBanner message={error} onRetry={refetch} />}

      {isLoading ? (
        <TableSkeleton />
      ) : items.length === 0 ? (
        <EmptyState
          title="No enquiries yet"
          description="Leads submitted by shoppers will show up here."
        />
      ) : (
        <Table>
          <TableHead>
            <TableRow>
              <TableHeadCell>Name</TableHeadCell>
              <TableHeadCell>Phone</TableHeadCell>
              <TableHeadCell>Door</TableHeadCell>
              <TableHeadCell>Laminate</TableHeadCell>
              <TableHeadCell>Source</TableHeadCell>
              <TableHeadCell>Status</TableHeadCell>
              <TableHeadCell>Date</TableHeadCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {items.map((enquiry) => (
              <TableRow key={enquiry._id}>
                <TableCell>{enquiry.name}</TableCell>
                <TableCell className="text-text-secondary">{enquiry.phone}</TableCell>
                <TableCell className="text-text-secondary">
                  {enquiry.doorSnapshot?.name ?? '—'}
                </TableCell>
                <TableCell className="text-text-secondary">
                  {enquiry.laminateSnapshot?.name ?? '—'}
                </TableCell>
                <TableCell>
                  <Badge variant="neutral">{SOURCE_LABEL[enquiry.source]}</Badge>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <Badge variant={STATUS_VARIANT[enquiry.status]}>{enquiry.status}</Badge>
                    <Select
                      value={enquiry.status}
                      onChange={(value) => value && changeStatus(enquiry._id, value)}
                      isDisabled={updatingId === enquiry._id}
                      options={STATUS_OPTIONS}
                      wrapperClassName="w-36"
                    />
                  </div>
                </TableCell>
                <TableCell className="text-text-secondary">
                  {new Date(enquiry.createdAt).toLocaleDateString()}
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
