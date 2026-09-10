'use client';

import { Pencil, Plus, Search } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import type { Route } from 'next';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import { toast } from 'sonner';

import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Pagination } from '@/components/ui/Pagination';
import { SelectInput } from '@/components/ui/inputs/SelectInput';
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
import { PageHeader } from '@/components/shared/PageHeader';
import { TableSkeleton } from '@/components/shared/Skeleton';
import { useApiList } from '@/hooks/useApiList';
import { apiFetch } from '@/lib/api/client';
import { ROUTES } from '@/utils/routes';
import type { DoorImage } from '@/lib/db/models/Door.model';
import type { CategoryRecord } from '@/views/admin/categories/CategoryManagerView';

interface DoorRecord {
  _id: string;
  code: string;
  name: string;
  slug: string;
  categoryId: string;
  images: DoorImage[];
  isActive: boolean;
}

export function DoorsAdminGridView() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const { items, meta, isLoading, error, refetch } = useApiList<DoorRecord>('/api/doors');
  const [categories, setCategories] = useState<CategoryRecord[]>([]);
  const [archiveTarget, setArchiveTarget] = useState<DoorRecord | null>(null);
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
    apiFetch<{ items: CategoryRecord[] }>('/api/door-categories?limit=100').then((response) => {
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
    const response = await apiFetch(`/api/doors/${archiveTarget._id}`, { method: 'DELETE' });
    setIsArchiving(false);

    if (!response.success) {
      toast.error(response.message);
      return;
    }

    toast.success('Door archived');
    setArchiveTarget(null);
    refetch();
  }

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Doors"
        description="Manage the door catalogue admins and shoppers see."
        action={
          <Link href={ROUTES.ADMIN_DOORS_NEW as Route}>
            <Button icon={Plus}>New Door</Button>
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
        <SelectInput
          placeholder="All categories"
          value={searchParams.get('categoryId') ?? ''}
          onChange={(event) => updateParam('categoryId', event.target.value)}
          options={categories.map((category) => ({ value: category._id, label: category.name }))}
          wrapperClassName="w-48"
        />
        <SelectInput
          placeholder="All statuses"
          value={searchParams.get('isActive') ?? ''}
          onChange={(event) => updateParam('isActive', event.target.value)}
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
          title="No doors yet"
          description="Create your first door to get started."
          action={
            <Link href={ROUTES.ADMIN_DOORS_NEW as Route}>
              <Button icon={Plus}>New Door</Button>
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
              <TableHeadCell>Status</TableHeadCell>
              <TableHeadCell>Actions</TableHeadCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {items.map((door) => {
              const primaryImage = door.images.find((image) => image.isPrimary) ?? door.images[0];
              return (
                <TableRow key={door._id}>
                  <TableCell>
                    <div className="bg-neutral-tint relative h-12 w-12 overflow-hidden rounded-sm">
                      {primaryImage && (
                        <Image
                          src={primaryImage.url.thumbnail}
                          alt={primaryImage.altText}
                          fill
                          sizes="48px"
                          className="object-cover"
                        />
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="text-text-secondary">{door.code}</TableCell>
                  <TableCell>{door.name}</TableCell>
                  <TableCell className="text-text-secondary">
                    {categoryNameById.get(door.categoryId) ?? '—'}
                  </TableCell>
                  <TableCell>
                    <Badge variant={door.isActive ? 'success' : 'neutral'}>
                      {door.isActive ? 'Active' : 'Archived'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Link href={ROUTES.ADMIN_DOORS_ID(door._id) as Route}>
                        <Button variant="secondary" icon={Pencil}>
                          Edit
                        </Button>
                      </Link>
                      {door.isActive && (
                        <Button
                          variant="danger"
                          disabled={archiveTarget?._id === door._id && isArchiving}
                          onClick={() => setArchiveTarget(door)}
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
        title="Archive Door"
        description={`Are you sure you want to archive "${archiveTarget?.name}"? It will be hidden from the catalogue but preserved for records.`}
        confirmLabel="Archive"
        isLoading={isArchiving}
      />
    </div>
  );
}
