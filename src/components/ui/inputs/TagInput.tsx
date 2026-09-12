'use client';

import { useState, type KeyboardEvent } from 'react';

import { cn } from '@/utils/cn';
import {
  baseFieldClasses,
  fieldBorderClass,
  InputWrapper,
} from '@/components/ui/inputs/InputWrapper';

interface TagInputProps {
  label?: string | undefined;
  error?: string | undefined;
  hint?: string | undefined;
  required?: boolean | undefined;
  value: string[];
  onChange: (tags: string[]) => void;
  placeholder?: string | undefined;
}

export function TagInput({
  label,
  error,
  hint,
  required,
  value,
  onChange,
  placeholder = 'Type a tag and press Enter',
}: TagInputProps) {
  const [draft, setDraft] = useState('');

  function addTag() {
    const tag = draft.trim();
    if (tag && !value.includes(tag)) {
      onChange([...value, tag]);
    }
    setDraft('');
  }

  function removeTag(tag: string) {
    onChange(value.filter((existing) => existing !== tag));
  }

  function handleKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === 'Enter' || event.key === ',') {
      event.preventDefault();
      addTag();
    } else if (event.key === 'Backspace' && draft === '' && value.length > 0) {
      removeTag(value[value.length - 1] as string);
    }
  }

  return (
    <InputWrapper label={label} error={error} hint={hint} required={required}>
      <div
        className={cn(
          baseFieldClasses,
          fieldBorderClass(Boolean(error)),
          'flex flex-wrap items-center gap-1.5 py-1.5',
        )}
      >
        {value.map((tag) => (
          <span
            key={tag}
            className="bg-neutral-tint text-text-primary rounded-pill inline-flex items-center gap-1 px-2 py-0.5 text-sm"
          >
            {tag}
            <button
              type="button"
              onClick={() => removeTag(tag)}
              className="text-text-secondary hover:text-error-text cursor-pointer"
              aria-label={`Remove tag ${tag}`}
            >
              ×
            </button>
          </span>
        ))}
        <input
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          onKeyDown={handleKeyDown}
          onBlur={addTag}
          placeholder={value.length === 0 ? placeholder : undefined}
          className="min-w-[8ch] flex-1 bg-transparent outline-none"
        />
      </div>
    </InputWrapper>
  );
}
