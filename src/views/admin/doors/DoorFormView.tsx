'use client';

import { useRouter } from 'next/navigation';
import type { Route } from 'next';
import { useEffect, useMemo, useState } from 'react';
import { Controller, useForm, useWatch } from 'react-hook-form';
import { toast } from 'sonner';

import { Button } from '@/components/ui/Button';
import { NumberInput } from '@/components/ui/inputs/NumberInput';
import { Select } from '@/components/ui/inputs/Select';
import { TagInput } from '@/components/ui/inputs/TagInput';
import { TextAreaInput } from '@/components/ui/inputs/TextAreaInput';
import { TextInput } from '@/components/ui/inputs/TextInput';
import { apiFetch } from '@/lib/api/client';
import { doorSchema, updateDoorSchema } from '@/schemas/door.schema';
import { ROUTES } from '@/utils/routes';
import type { CategoryRecord } from '@/views/admin/categories/CategoryManagerView';

interface DoorFormValues {
  code: string;
  name: string;
  slug: string;
  categoryId: string;
  patternType: string;
  width: string;
  height: string;
  unit: 'mm' | 'inch' | 'ft';
  description: string;
  tags: string[];
}

const EMPTY_FORM: DoorFormValues = {
  code: '',
  name: '',
  slug: '',
  categoryId: '',
  patternType: '',
  width: '',
  height: '',
  unit: 'mm',
  description: '',
  tags: [],
};

function buildPayload(values: DoorFormValues) {
  return {
    code: values.code,
    name: values.name,
    slug: values.slug,
    categoryId: values.categoryId,
    patternType: values.patternType || undefined,
    dimensions:
      values.width && values.height
        ? { width: Number(values.width), height: Number(values.height), unit: values.unit }
        : undefined,
    description: values.description || undefined,
    tags: values.tags,
  };
}

interface DoorFormViewProps {
  doorId?: string;
}

export function DoorFormView({ doorId }: DoorFormViewProps) {
  const router = useRouter();
  const isEditMode = Boolean(doorId);

  const [categories, setCategories] = useState<CategoryRecord[]>([]);
  const [formError, setFormError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(isEditMode);

  const {
    register,
    control,
    handleSubmit,
    reset,
    setError,
    formState: { errors, isDirty, isSubmitting },
  } = useForm<DoorFormValues>({ defaultValues: EMPTY_FORM });

  const schema = isEditMode ? updateDoorSchema : doorSchema;

  const watchedValues = useWatch({ control });
  const isFormValid = useMemo(
    () => schema.safeParse(buildPayload({ ...EMPTY_FORM, ...watchedValues })).success,
    [schema, watchedValues],
  );

  useEffect(() => {
    apiFetch<{ items: CategoryRecord[] }>('/api/door-categories?limit=100').then((response) => {
      if (response.success) setCategories(response.data?.items ?? []);
    });
  }, []);

  useEffect(() => {
    if (!doorId) return;

    apiFetch<{
      code: string;
      name: string;
      slug: string;
      categoryId: string;
      patternType?: string;
      dimensions?: { width: number; height: number; unit: 'mm' | 'inch' | 'ft' };
      description?: string;
      tags: string[];
    }>(`/api/doors/${doorId}`)
      .then((response) => {
        if (!response.success || !response.data) {
          setFormError(response.message);
          return;
        }
        const door = response.data;
        reset({
          code: door.code,
          name: door.name,
          slug: door.slug,
          categoryId: door.categoryId,
          patternType: door.patternType ?? '',
          width: door.dimensions ? String(door.dimensions.width) : '',
          height: door.dimensions ? String(door.dimensions.height) : '',
          unit: door.dimensions?.unit ?? 'mm',
          description: door.description ?? '',
          tags: door.tags,
        });
      })
      .finally(() => setIsLoading(false));
  }, [doorId, reset]);

  const onSubmit = handleSubmit(async (values) => {
    setFormError(null);
    const payload = buildPayload(values);

    const result = schema.safeParse(payload);
    if (!result.success) {
      for (const issue of result.error.issues) {
        const key = issue.path[0];
        if (typeof key === 'string') {
          setError(key as keyof DoorFormValues, { message: issue.message });
        }
      }
      return;
    }

    const response = isEditMode
      ? await apiFetch<{ _id: string }>(`/api/doors/${doorId}`, {
          method: 'PATCH',
          body: JSON.stringify(payload),
        })
      : await apiFetch<{ _id: string }>('/api/doors', {
          method: 'POST',
          body: JSON.stringify(payload),
        });

    if (!response.success) {
      setFormError(response.message);
      return;
    }

    toast.success(isEditMode ? 'Door updated' : 'Door created');

    if (!isEditMode && response.data) {
      router.push(ROUTES.ADMIN_DOORS_ID(response.data._id) as Route);
    }
  });

  if (isLoading) {
    return <p className="text-body-sm text-text-secondary">Loading door...</p>;
  }

  const isSubmitDisabled = !isFormValid || isSubmitting || (isEditMode && !isDirty);

  return (
    <div className="bg-surface shadow-card rounded-md max-w-2xl p-6">
      <form onSubmit={onSubmit} className="flex flex-col gap-4">
        <div className="grid grid-cols-2 gap-4">
          <TextInput label="Code" required error={errors.code?.message} {...register('code')} />
          <TextInput label="Name" required error={errors.name?.message} {...register('name')} />
        </div>

        <TextInput
          label="Slug"
          required
          hint="Lowercase, hyphen-separated (e.g. classic-main-door)"
          error={errors.slug?.message}
          {...register('slug')}
        />

        <Controller
          control={control}
          name="categoryId"
          render={({ field }) => (
            <Select
              label="Category"
              required
              placeholder="Select a category"
              options={categories.map((category) => ({
                value: category._id,
                label: category.name,
              }))}
              error={errors.categoryId?.message}
              value={field.value}
              onChange={(value) => field.onChange(value ?? '')}
            />
          )}
        />

        <TextInput label="Pattern type" {...register('patternType')} />

        <div className="grid grid-cols-3 gap-4">
          <NumberInput label="Width" {...register('width')} />
          <NumberInput label="Height" {...register('height')} />
          <Controller
            control={control}
            name="unit"
            render={({ field }) => (
              <Select
                label="Unit"
                options={[
                  { value: 'mm', label: 'mm' },
                  { value: 'inch', label: 'inch' },
                  { value: 'ft', label: 'ft' },
                ]}
                value={field.value}
                onChange={(value) => field.onChange((value ?? 'mm') as 'mm' | 'inch' | 'ft')}
              />
            )}
          />
        </div>

        <TextAreaInput label="Description" {...register('description')} />

        <Controller
          control={control}
          name="tags"
          render={({ field }) => (
            <TagInput label="Tags" value={field.value} onChange={field.onChange} />
          )}
        />

        {formError && (
          <p className="text-body-sm bg-error-bg text-error-text rounded-sm px-3 py-2">
            {formError}
          </p>
        )}

        <Button
          type="submit"
          isLoading={isSubmitting}
          disabled={isSubmitDisabled}
          className="w-fit"
        >
          {isEditMode ? 'Save changes' : 'Create door'}
        </Button>
      </form>
    </div>
  );
}
