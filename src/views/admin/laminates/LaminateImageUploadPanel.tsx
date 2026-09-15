'use client';

import { Star, Trash2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { CheckboxInput } from '@/components/ui/inputs/CheckboxInput';
import { TextInput } from '@/components/ui/inputs/TextInput';
import { FileDropzone } from '@/components/ui/FileDropzone';
import { ConfirmModal } from '@/components/ui/modals/ConfirmModal';
import { ImageWrapper } from '@/components/shared/ImageWrapper';
import { apiFetch } from '@/lib/api/client';
import type { LaminateTexture } from '@/lib/db/models/Laminate.model';

interface LaminateImageUploadPanelProps {
  laminateId: string;
}

interface UploadFormValues {
  altText: string;
  isPrimary: boolean;
}

export function LaminateImageUploadPanel({ laminateId }: LaminateImageUploadPanelProps) {
  const [images, setImages] = useState<LaminateTexture[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [pendingFile, setPendingFile] = useState<File | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [updatingIndex, setUpdatingIndex] = useState<number | null>(null);
  const [deleteIndex, setDeleteIndex] = useState<number | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { isSubmitting, isValid },
  } = useForm<UploadFormValues>({
    mode: 'onChange',
    defaultValues: { altText: '', isPrimary: false },
  });

  useEffect(() => {
    apiFetch<{ images: LaminateTexture[] }>(`/api/laminates/${laminateId}`)
      .then((response) => {
        if (response.success && response.data) setImages(response.data.images);
      })
      .finally(() => setIsLoading(false));
  }, [laminateId]);

  function selectFile(file: File) {
    setPendingFile(file);
    reset({ altText: '', isPrimary: false });
    setUploadError(null);
  }

  const onSubmit = handleSubmit(async (values) => {
    if (!pendingFile) return;

    setUploadError(null);

    const formData = new FormData();
    formData.append('file', pendingFile);
    formData.append('altText', values.altText);
    formData.append('isPrimary', String(values.isPrimary));

    const response = await apiFetch<{ images: LaminateTexture[] }>(
      `/api/laminates/${laminateId}/images`,
      { method: 'POST', body: formData },
    );

    if (!response.success || !response.data) {
      setUploadError(response.message);
      return;
    }

    setImages(response.data.images);
    setPendingFile(null);
    reset({ altText: '', isPrimary: false });
    toast.success('Image uploaded');
  });

  async function makePrimary(index: number) {
    setUpdatingIndex(index);
    const response = await apiFetch<{ images: LaminateTexture[] }>(
      `/api/laminates/${laminateId}/images/${index}`,
      { method: 'PATCH' },
    );
    setUpdatingIndex(null);

    if (!response.success || !response.data) {
      toast.error(response.message);
      return;
    }

    setImages(response.data.images);
    toast.success('Primary image updated');
  }

  async function confirmDelete() {
    if (deleteIndex === null) return;
    setIsDeleting(true);
    const response = await apiFetch<{ images: LaminateTexture[] }>(
      `/api/laminates/${laminateId}/images/${deleteIndex}`,
      { method: 'DELETE' },
    );
    setIsDeleting(false);

    if (!response.success || !response.data) {
      toast.error(response.message);
      return;
    }

    setImages(response.data.images);
    setDeleteIndex(null);
    toast.success('Image deleted');
  }

  return (
    <div className="bg-surface shadow-card rounded-md flex max-w-2xl flex-col gap-4 p-6">
      <h2 className="font-display text-h2 text-text-primary">Texture Images</h2>

      {isLoading ? (
        <p className="text-body-sm text-text-secondary">Loading images...</p>
      ) : images.length === 0 ? (
        <p className="text-body-sm text-text-secondary">No images uploaded yet.</p>
      ) : (
        <div className="grid grid-cols-4 gap-3">
          {images.map((image, index) => (
            <div key={index} className="flex flex-col gap-1.5">
              <div className="bg-neutral-tint relative aspect-square overflow-hidden rounded-sm">
                <ImageWrapper src={image.url.thumbnail} alt={image.altText} sizes="120px" />
              </div>
              <div className="flex items-center justify-between gap-1">
                {image.isPrimary ? (
                  <Badge variant="success" className="w-fit">
                    Primary
                  </Badge>
                ) : (
                  <button
                    type="button"
                    onClick={() => makePrimary(index)}
                    disabled={updatingIndex === index}
                    className="text-badge text-text-secondary hover:text-brand flex cursor-pointer items-center gap-1 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <Star aria-hidden className="h-3 w-3" />
                    Set primary
                  </button>
                )}
                <button
                  type="button"
                  aria-label="Delete image"
                  onClick={() => setDeleteIndex(index)}
                  className="text-text-secondary hover:text-error-text cursor-pointer"
                >
                  <Trash2 aria-hidden className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <FileDropzone onFileSelected={selectFile} />

      {pendingFile && (
        <form
          onSubmit={onSubmit}
          className="border-border flex flex-col gap-3 rounded-sm border p-4"
        >
          <p className="text-body-sm text-text-primary">Selected: {pendingFile.name}</p>
          <TextInput label="Alt text" required {...register('altText', { required: true })} />
          <CheckboxInput label="Set as primary image" {...register('isPrimary')} />
          {uploadError && <p className="text-body-sm text-error-text">{uploadError}</p>}
          <Button
            type="submit"
            isLoading={isSubmitting}
            disabled={!isValid || isSubmitting}
            className="w-fit"
          >
            Upload
          </Button>
        </form>
      )}

      <ConfirmModal
        isOpen={deleteIndex !== null}
        onClose={() => setDeleteIndex(null)}
        onConfirm={confirmDelete}
        title="Delete this image?"
        description="This permanently removes the image and its stored files. This can't be undone."
        confirmLabel="Delete"
        isLoading={isDeleting}
      />
    </div>
  );
}
