'use client';

import Image from 'next/image';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { CheckboxInput } from '@/components/ui/inputs/CheckboxInput';
import { TextInput } from '@/components/ui/inputs/TextInput';
import { FileDropzone } from '@/components/ui/FileDropzone';
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
            <div key={index} className="flex flex-col gap-1">
              <div className="bg-neutral-tint relative aspect-square overflow-hidden rounded-sm">
                <Image
                  src={image.url.thumbnail}
                  alt={image.altText}
                  fill
                  sizes="120px"
                  className="object-cover"
                />
              </div>
              {image.isPrimary && (
                <Badge variant="success" className="w-fit">
                  Primary
                </Badge>
              )}
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
    </div>
  );
}
