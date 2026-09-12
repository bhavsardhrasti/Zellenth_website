'use client';

import { Plus, Search } from 'lucide-react';
import { useMemo, useState } from 'react';
import { Controller, useForm, useWatch } from 'react-hook-form';
import { toast } from 'sonner';

import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { CheckboxInput } from '@/components/ui/inputs/CheckboxInput';
import { NumberInput } from '@/components/ui/inputs/NumberInput';
import { Select } from '@/components/ui/inputs/Select';
import { TextInput } from '@/components/ui/inputs/TextInput';
import { ConfirmModal } from '@/components/ui/modals/ConfirmModal';
import { FormModal } from '@/components/ui/modals/FormModal';
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
import { doorCategorySchema } from '@/schemas/door-category.schema';

export interface CategoryRecord {
  _id: string;
  name: string;
  slug: string;
  parentId?: string;
  isActive: boolean;
  sortOrder: number;
}

interface CategoryFormValues {
  name: string;
  slug: string;
  parentId: string;
  isActive: boolean;
  sortOrder: string;
}

const EMPTY_FORM: CategoryFormValues = {
  name: '',
  slug: '',
  parentId: '',
  isActive: true,
  sortOrder: '0',
};

function buildPayload(values: CategoryFormValues) {
  return {
    name: values.name,
    slug: values.slug,
    parentId: values.parentId || undefined,
    isActive: values.isActive,
    sortOrder: Number(values.sortOrder) || 0,
  };
}

interface CategoryManagerViewProps {
  resourceLabel: string;
  apiBasePath: string;
}

export function CategoryManagerView({ resourceLabel, apiBasePath }: CategoryManagerViewProps) {
  const { items, isLoading, error, refetch } = useApiList<CategoryRecord>(
    `${apiBasePath}?limit=100`,
  );

  const [search, setSearch] = useState('');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const [archiveTarget, setArchiveTarget] = useState<CategoryRecord | null>(null);
  const [isArchiving, setIsArchiving] = useState(false);

  const {
    register,
    control,
    handleSubmit,
    reset,
    setError,
    formState: { errors, isDirty, isSubmitting },
  } = useForm<CategoryFormValues>({ defaultValues: EMPTY_FORM });

  const watchedValues = useWatch({ control });
  const isFormValid = useMemo(
    () => doorCategorySchema.safeParse(buildPayload({ ...EMPTY_FORM, ...watchedValues })).success,
    [watchedValues],
  );

  const nameById = useMemo(() => {
    const map = new Map<string, string>();
    for (const item of items) map.set(item._id, item.name);
    return map;
  }, [items]);

  const filteredItems = useMemo(() => {
    if (!search.trim()) return items;
    const term = search.trim().toLowerCase();
    return items.filter(
      (item) => item.name.toLowerCase().includes(term) || item.slug.toLowerCase().includes(term),
    );
  }, [items, search]);

  function openCreateForm() {
    setEditingId(null);
    reset(EMPTY_FORM);
    setFormError(null);
    setIsFormOpen(true);
  }

  function openEditForm(category: CategoryRecord) {
    setEditingId(category._id);
    reset({
      name: category.name,
      slug: category.slug,
      parentId: category.parentId ?? '',
      isActive: category.isActive,
      sortOrder: String(category.sortOrder),
    });
    setFormError(null);
    setIsFormOpen(true);
  }

  const onSubmit = handleSubmit(async (values) => {
    setFormError(null);
    const payload = buildPayload(values);

    const result = doorCategorySchema.safeParse(payload);
    if (!result.success) {
      for (const issue of result.error.issues) {
        const key = issue.path[0];
        if (typeof key === 'string') {
          setError(key as keyof CategoryFormValues, { message: issue.message });
        }
      }
      return;
    }

    const response = editingId
      ? await apiFetch(`${apiBasePath}/${editingId}`, {
          method: 'PATCH',
          body: JSON.stringify(payload),
        })
      : await apiFetch(apiBasePath, {
          method: 'POST',
          body: JSON.stringify(payload),
        });

    if (!response.success) {
      setFormError(response.message);
      return;
    }

    toast.success(editingId ? `${resourceLabel} updated` : `${resourceLabel} created`);
    setIsFormOpen(false);
    refetch();
  });

  async function handleArchive() {
    if (!archiveTarget) return;
    setIsArchiving(true);
    const response = await apiFetch(`${apiBasePath}/${archiveTarget._id}`, { method: 'DELETE' });
    setIsArchiving(false);

    if (!response.success) {
      toast.error(response.message);
      return;
    }

    toast.success(`${resourceLabel} archived`);
    setArchiveTarget(null);
    refetch();
  }

  const parentOptions = items
    .filter((item) => item._id !== editingId)
    .map((item) => ({ value: item._id, label: item.name }));

  const isSubmitDisabled = !isFormValid || (Boolean(editingId) && !isDirty);

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title={`${resourceLabel} Management`}
        description={`Manage ${resourceLabel.toLowerCase()} used to organize your catalogue.`}
        action={
          <Button icon={Plus} onClick={openCreateForm}>
            New {resourceLabel}
          </Button>
        }
      />

      <TextInput
        icon={Search}
        placeholder="Search by name or slug"
        value={search}
        onChange={(event) => setSearch(event.target.value)}
        wrapperClassName="max-w-xs"
      />

      {error && <ErrorBanner message={error} onRetry={refetch} />}

      {isLoading ? (
        <TableSkeleton />
      ) : filteredItems.length === 0 ? (
        <EmptyState
          title={`No ${resourceLabel.toLowerCase()} yet`}
          description={`Create your first ${resourceLabel.toLowerCase()} to get started.`}
          action={
            <Button icon={Plus} onClick={openCreateForm}>
              New {resourceLabel}
            </Button>
          }
        />
      ) : (
        <Table>
          <TableHead>
            <TableRow>
              <TableHeadCell>Name</TableHeadCell>
              <TableHeadCell>Slug</TableHeadCell>
              <TableHeadCell>Parent</TableHeadCell>
              <TableHeadCell>Status</TableHeadCell>
              <TableHeadCell>Sort Order</TableHeadCell>
              <TableHeadCell>Actions</TableHeadCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredItems.map((item) => (
              <TableRow key={item._id}>
                <TableCell>{item.name}</TableCell>
                <TableCell className="text-text-secondary">{item.slug}</TableCell>
                <TableCell className="text-text-secondary">
                  {item.parentId ? (nameById.get(item.parentId) ?? '—') : '—'}
                </TableCell>
                <TableCell>
                  <Badge variant={item.isActive ? 'success' : 'neutral'}>
                    {item.isActive ? 'Active' : 'Archived'}
                  </Badge>
                </TableCell>
                <TableCell>{item.sortOrder}</TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <Button variant="secondary" onClick={() => openEditForm(item)}>
                      Edit
                    </Button>
                    {item.isActive && (
                      <Button
                        variant="danger"
                        disabled={archiveTarget?._id === item._id && isArchiving}
                        onClick={() => setArchiveTarget(item)}
                      >
                        Archive
                      </Button>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}

      <FormModal
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onSubmit={onSubmit}
        title={editingId ? `Edit ${resourceLabel}` : `New ${resourceLabel}`}
        isLoading={isSubmitting}
        isSubmitDisabled={isSubmitDisabled}
        error={formError}
      >
        <TextInput
          label="Name"
          required
          error={errors.name?.message}
          {...register('name', { required: true })}
        />
        <TextInput
          label="Slug"
          required
          hint="Lowercase, hyphen-separated (e.g. main-door)"
          error={errors.slug?.message}
          {...register('slug', { required: true })}
        />
        <Controller
          control={control}
          name="parentId"
          render={({ field }) => (
            <Select
              label="Parent category"
              placeholder="No parent"
              isClearable
              options={parentOptions}
              value={field.value}
              onChange={(value) => field.onChange(value ?? '')}
            />
          )}
        />
        <NumberInput label="Sort order" {...register('sortOrder')} />
        <CheckboxInput label="Active" {...register('isActive')} />
      </FormModal>

      <ConfirmModal
        isOpen={Boolean(archiveTarget)}
        onClose={() => setArchiveTarget(null)}
        onConfirm={handleArchive}
        title={`Archive ${resourceLabel}`}
        description={`Are you sure you want to archive "${archiveTarget?.name}"? It will be hidden from the catalogue but preserved for records.`}
        confirmLabel="Archive"
        isLoading={isArchiving}
      />
    </div>
  );
}
