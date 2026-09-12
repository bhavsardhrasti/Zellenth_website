'use client';

import { useRef, useState, type DragEvent } from 'react';

import { cn } from '@/utils/cn';
import { ALLOWED_IMAGE_MIME_TYPES, MAX_UPLOAD_SIZE_MB } from '@/utils/constants';

interface FileDropzoneProps {
  onFileSelected: (file: File) => void;
  error?: string;
}

export function FileDropzone({ onFileSelected, error }: FileDropzoneProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);

  function validateAndSelect(file: File | undefined) {
    if (!file) return;

    if (
      !ALLOWED_IMAGE_MIME_TYPES.includes(file.type as (typeof ALLOWED_IMAGE_MIME_TYPES)[number])
    ) {
      setLocalError('Only JPEG, PNG, or WebP images are allowed.');
      return;
    }

    if (file.size > MAX_UPLOAD_SIZE_MB * 1024 * 1024) {
      setLocalError(`Image must be under ${MAX_UPLOAD_SIZE_MB}MB.`);
      return;
    }

    setLocalError(null);
    onFileSelected(file);
  }

  function handleDrop(event: DragEvent<HTMLDivElement>) {
    event.preventDefault();
    setIsDragging(false);
    validateAndSelect(event.dataTransfer.files[0]);
  }

  const displayError = error ?? localError;

  return (
    <div className="flex flex-col gap-1.5">
      <div
        onDragOver={(event) => {
          event.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
        className={cn(
          'rounded-md border border-dashed px-6 py-8 text-center transition-colors cursor-pointer',
          isDragging ? 'border-brand bg-neutral-tint' : 'border-border bg-surface',
        )}
      >
        <p className="text-body-sm text-text-secondary">
          Drag & drop an image here, or click to browse
        </p>
        <p className="text-badge text-text-secondary mt-1">
          JPEG, PNG, or WebP — up to {MAX_UPLOAD_SIZE_MB}MB
        </p>
        <input
          ref={inputRef}
          type="file"
          accept={ALLOWED_IMAGE_MIME_TYPES.join(',')}
          className="hidden"
          onChange={(event) => validateAndSelect(event.target.files?.[0])}
        />
      </div>
      {displayError && <p className="text-body-sm text-error-text">{displayError}</p>}
    </div>
  );
}
