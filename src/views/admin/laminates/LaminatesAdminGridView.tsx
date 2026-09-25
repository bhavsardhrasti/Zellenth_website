'use client';

import { Pencil, Plus, Search } from 'lucide-react';
import Link from 'next/link';
import type { Route } from 'next';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import { toast } from 'sonner';

import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Pagination } from '@/components/ui/Pagination';
import { Select } from '@/components/ui/inputs/Select';
import { TextInput } from '@/components/ui/inputs/TextInput';
import { ConfirmModal } from '@/components/ui/modals/ConfirmModal';
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
import { ImageWrapper } from '@/components/shared/ImageWrapper';
import { PageHeader } from '@/components/shared/PageHeader';
import { TableSkeleton } from '@/components/shared/Skeleton';
import { useApiList } from '@/hooks/useApiList';
import { apiFetch } from '@/lib/api/client';
import { ROUTES } from '@/utils/routes';
import type { LaminateTexture, LaminateFinish } from '@/lib/db/models/Laminate.model';
import type { CategoryRecord } from '@/views/admin/categories/CategoryManagerView';

interface LaminateRecord {
  _id: string;
  code: string;
  name: string;
  slug: string;
  categoryId: string;
  finish: LaminateFinish;
  colorFamily: string;
  images: LaminateTexture[];
  isActive: boolean;
}

export function LaminatesAdminGridView() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const { items, meta, isLoading, error, refetch } = useApiList<LaminateRecord>('/api/laminates');
  const [categories, setCategories] = useState<CategoryRecord[]>([]);
  const [archiveTarget, setArchiveTarget] = useState<LaminateRecord | null>(null);
  const [isArchiving, setIsArchiving] = useState(false);
  const [searchDraft, setSearchDraft] = useState(searchParams.get('search') ?? '');

  useEffect(() => {
    const handle = setTimeout(() => {
      if (searchDraft !== (searchParams.get('search') ?? '')) {
        updateParam('search', searchDraft);
      }
    }, 400);
    return () => clearTimeout(handle);
    // eslint-disable-next-line react-hooks/exhaustive-deps -- only re-run when the debounced draft changes
  }, [searchDraft]);

  useEffect(() => {
    apiFetch<{ items: CategoryRecord[] }>('/api/laminate-categories?limit=100').then((response) => {
      if (response.success) setCategories(response.data?.items ?? []);
    });
  }, []);

  const categoryNameById = useMemo(() => {
    const map = new Map<string, string>();
    for (const category of categories) map.set(category._id, category.name);
    return map;
  }, [categories]);

  function updateParam(key: string, value: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (value) params.set(key, value);
    else params.delete(key);
    params.set('page', '1');
    router.push(`${pathname}?${params.toString()}` as Route);
  }

  async function handleArchive() {
    if (!archiveTarget) return;
    setIsArchiving(true);
    const response = await apiFetch(`/api/laminates/${archiveTarget._id}`, { method: 'DELETE' });
    setIsArchiving(false);

    if (!response.success) {
      toast.error(response.message);
      return;
    }

    toast.success('Laminate archived');
    setArchiveTarget(null);
    refetch();
  }

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Laminates"
        description="Manage the laminate catalogue admins and shoppers see."
        action={
          <Link href={ROUTES.ADMIN_LAMINATES_NEW as Route}>
            <Button icon={Plus}>New Laminate</Button>
          </Link>
        }
      />

      <div className="flex flex-wrap gap-3">
        <TextInput
          icon={Search}
          placeholder="Search by name or code"
          value={searchDraft}
          onChange={(event) => setSearchDraft(event.target.value)}
          wrapperClassName="w-64"
        />
        <Select
          placeholder="All categories"
          isClearable
          value={searchParams.get('categoryId') ?? ''}
          onChange={(value) => updateParam('categoryId', value ?? '')}
          options={categories.map((category) => ({ value: category._id, label: category.name }))}
          wrapperClassName="w-48"
        />
        <Select
          placeholder="All finishes"
          isClearable
          value={searchParams.get('finish') ?? ''}
          onChange={(value) => updateParam('finish', value ?? '')}
          options={[
            { value: 'matte', label: 'Matte' },
            { value: 'gloss', label: 'Gloss' },
            { value: 'textured', label: 'Textured' },
          ]}
          wrapperClassName="w-40"
        />
        <Select
          placeholder="All statuses"
          isClearable
          value={searchParams.get('isActive') ?? ''}
          onChange={(value) => updateParam('isActive', value ?? '')}
          options={[
            { value: 'true', label: 'Active' },
            { value: 'false', label: 'Archived' },
          ]}
          wrapperClassName="w-40"
        />
      </div>

      {error && <ErrorBanner message={error} onRetry={refetch} />}

      {isLoading ? (
        <TableSkeleton />
      ) : items.length === 0 ? (
        <EmptyState
          title="No laminates yet"
          description="Create your first laminate to get started."
          action={
            <Link href={ROUTES.ADMIN_LAMINATES_NEW as Route}>
              <Button icon={Plus}>New Laminate</Button>
            </Link>
          }
        />
      ) : (
        <Table>
          <TableHead>
            <TableRow>
              <TableHeadCell>Image</TableHeadCell>
              <TableHeadCell>Code</TableHeadCell>
              <TableHeadCell>Name</TableHeadCell>
              <TableHeadCell>Category</TableHeadCell>
              <TableHeadCell>Finish</TableHeadCell>
              <TableHeadCell>Status</TableHeadCell>
              <TableHeadCell>Actions</TableHeadCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {items.map((laminate) => {
              const primaryImage =
                laminate.images.find((image) => image.isPrimary) ?? laminate.images[0];
              return (
                <TableRow key={laminate._id}>
                  <TableCell>
                    <div className="bg-neutral-tint relative h-12 w-12 overflow-hidden rounded-sm">
                      <ImageWrapper
                        src={primaryImage?.url.thumbnail}
                        alt={primaryImage?.altText ?? laminate.name}
                        sizes="48px"
                      />
                    </div>
                  </TableCell>
                  <TableCell className="text-text-secondary">{laminate.code}</TableCell>
                  <TableCell>{laminate.name}</TableCell>
                  <TableCell className="text-text-secondary">
                    {categoryNameById.get(laminate.categoryId) ?? '—'}
                  </TableCell>
                  <TableCell className="text-text-secondary capitalize">
                    {laminate.finish}
                  </TableCell>
                  <TableCell>
                    <Badge variant={laminate.isActive ? 'success' : 'neutral'}>
                      {laminate.isActive ? 'Active' : 'Archived'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Link href={ROUTES.ADMIN_LAMINATES_ID(laminate._id) as Route}>
                        <Button variant="secondary" icon={Pencil}>
                          Edit
                        </Button>
                      </Link>
                      {laminate.isActive && (
                        <Button
                          variant="danger"
                          disabled={archiveTarget?._id === laminate._id && isArchiving}
                          onClick={() => setArchiveTarget(laminate)}
                        >
                          Archive
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      )}

      {meta && <Pagination meta={meta} />}

      <ConfirmModal
        isOpen={Boolean(archiveTarget)}
        onClose={() => setArchiveTarget(null)}
        onConfirm={handleArchive}
        title="Archive Laminate"
        description={`Are you sure you want to archive "${archiveTarget?.name}"? It will be hidden from the catalogue but preserved for records.`}
        confirmLabel="Archive"
        isLoading={isArchiving}
      />
    </div>
  );
}
