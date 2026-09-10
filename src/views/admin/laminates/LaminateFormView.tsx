'use client';

import { useRouter } from 'next/navigation';
import type { Route } from 'next';
import { useEffect, useMemo, useState } from 'react';
import { Controller, useForm, useWatch } from 'react-hook-form';
import { toast } from 'sonner';

import { Button } from '@/components/ui/Button';
import { NumberInput } from '@/components/ui/inputs/NumberInput';
import { SelectInput } from '@/components/ui/inputs/SelectInput';
import { TagInput } from '@/components/ui/inputs/TagInput';
import { TextAreaInput } from '@/components/ui/inputs/TextAreaInput';
import { TextInput } from '@/components/ui/inputs/TextInput';
import { apiFetch } from '@/lib/api/client';
import { laminateSchema, updateLaminateSchema } from '@/schemas/laminate.schema';
import { ROUTES } from '@/utils/routes';
import type { CategoryRecord } from '@/views/admin/categories/CategoryManagerView';
import type { LaminateFinish, LaminateGrainDirection } from '@/lib/db/models/Laminate.model';

interface LaminateFormValues {
  code: string;
  name: string;
  slug: string;
  categoryId: string;
  finish: LaminateFinish | '';
  colorFamily: string;
  collectionName: string;
  size: string;
  priceBracket: string;
  grainDirection: LaminateGrainDirection | '';
  patternScale: string;
  description: string;
  tags: string[];
}

const EMPTY_FORM: LaminateFormValues = {
  code: '',
  name: '',
  slug: '',
  categoryId: '',
  finish: '',
  colorFamily: '',
  collectionName: '',
  size: '',
  priceBracket: '',
  grainDirection: '',
  patternScale: '',
  description: '',
  tags: [],
};

function buildPayload(values: LaminateFormValues) {
  return {
    code: values.code,
    name: values.name,
    slug: values.slug,
    categoryId: values.categoryId,
    finish: values.finish || undefined,
    colorFamily: values.colorFamily,
    collectionName: values.collectionName || undefined,
    size: values.size || undefined,
    priceBracket: values.priceBracket || undefined,
    grainDirection: values.grainDirection || undefined,
    patternScale: values.patternScale ? Number(values.patternScale) : undefined,
    description: values.description || undefined,
    tags: values.tags,
  };
}

interface LaminateFormViewProps {
  laminateId?: string;
}

export function LaminateFormView({ laminateId }: LaminateFormViewProps) {
  const router = useRouter();
  const isEditMode = Boolean(laminateId);

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
  } = useForm<LaminateFormValues>({ defaultValues: EMPTY_FORM });

  const schema = isEditMode ? updateLaminateSchema : laminateSchema;

  const watchedValues = useWatch({ control });
  const isFormValid = useMemo(
    () => schema.safeParse(buildPayload({ ...EMPTY_FORM, ...watchedValues })).success,
    [schema, watchedValues],
  );

  useEffect(() => {
    apiFetch<{ items: CategoryRecord[] }>('/api/laminate-categories?limit=100').then((response) => {
      if (response.success) setCategories(response.data?.items ?? []);
    });
  }, []);

  useEffect(() => {
    if (!laminateId) return;

    apiFetch<{
      code: string;
      name: string;
      slug: string;
      categoryId: string;
      finish: LaminateFinish;
      colorFamily: string;
      collectionName?: string;
      size?: string;
      priceBracket?: string;
      grainDirection: LaminateGrainDirection;
      patternScale?: number;
      description?: string;
      tags: string[];
    }>(`/api/laminates/${laminateId}`)
      .then((response) => {
        if (!response.success || !response.data) {
          setFormError(response.message);
          return;
        }
        const laminate = response.data;
        reset({
          code: laminate.code,
          name: laminate.name,
          slug: laminate.slug,
          categoryId: laminate.categoryId,
          finish: laminate.finish,
          colorFamily: laminate.colorFamily,
          collectionName: laminate.collectionName ?? '',
          size: laminate.size ?? '',
          priceBracket: laminate.priceBracket ?? '',
          grainDirection: laminate.grainDirection,
          patternScale: laminate.patternScale ? String(laminate.patternScale) : '',
          description: laminate.description ?? '',
          tags: laminate.tags,
        });
      })
      .finally(() => setIsLoading(false));
  }, [laminateId, reset]);

  const onSubmit = handleSubmit(async (values) => {
    setFormError(null);
    const payload = buildPayload(values);

    const result = schema.safeParse(payload);
    if (!result.success) {
      for (const issue of result.error.issues) {
        const key = issue.path[0];
        if (typeof key === 'string') {
          setError(key as keyof LaminateFormValues, { message: issue.message });
        }
      }
      return;
    }

    const response = isEditMode
      ? await apiFetch<{ _id: string }>(`/api/laminates/${laminateId}`, {
          method: 'PATCH',
          body: JSON.stringify(payload),
        })
      : await apiFetch<{ _id: string }>('/api/laminates', {
          method: 'POST',
          body: JSON.stringify(payload),
        });

    if (!response.success) {
      setFormError(response.message);
      return;
    }

    toast.success(isEditMode ? 'Laminate updated' : 'Laminate created');

    if (!isEditMode && response.data) {
      router.push(ROUTES.ADMIN_LAMINATES_ID(response.data._id) as Route);
    }
  });

  if (isLoading) {
    return <p className="text-body-sm text-text-secondary">Loading laminate...</p>;
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
          hint="Lowercase, hyphen-separated (e.g. golden-teak)"
          error={errors.slug?.message}
          {...register('slug')}
        />

        <SelectInput
          label="Category"
          required
          placeholder="Select a category"
          options={categories.map((category) => ({ value: category._id, label: category.name }))}
          error={errors.categoryId?.message}
          {...register('categoryId')}
        />

        <div className="grid grid-cols-2 gap-4">
          <SelectInput
            label="Finish"
            required
            placeholder="Select a finish"
            options={[
              { value: 'matte', label: 'Matte' },
              { value: 'gloss', label: 'Gloss' },
              { value: 'textured', label: 'Textured' },
            ]}
            error={errors.finish?.message}
            {...register('finish')}
          />
          <TextInput
            label="Color family"
            required
            error={errors.colorFamily?.message}
            {...register('colorFamily')}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <SelectInput
            label="Grain direction"
            required
            placeholder="Select grain direction"
            options={[
              { value: 'horizontal', label: 'Horizontal' },
              { value: 'vertical', label: 'Vertical' },
              { value: 'no-grain', label: 'No grain' },
            ]}
            error={errors.grainDirection?.message}
            {...register('grainDirection')}
          />
          <NumberInput
            label="Pattern scale"
            hint="mm per pixel, optional"
            {...register('patternScale')}
          />
        </div>

        <div className="grid grid-cols-3 gap-4">
          <TextInput label="Collection" {...register('collectionName')} />
          <TextInput label="Size" {...register('size')} />
          <TextInput label="Price bracket" {...register('priceBracket')} />
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
          {isEditMode ? 'Save changes' : 'Create laminate'}
        </Button>
      </form>
    </div>
  );
}
