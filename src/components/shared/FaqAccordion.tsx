'use client';

import { ChevronDown } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

import { cn } from '@/utils/cn';
import type { FaqItem } from '@/lib/data/faq';

interface FaqAccordionItemProps {
  item: FaqItem;
  isOpen: boolean;
  onToggle: () => void;
}

function FaqAccordionItem({ item, isOpen, onToggle }: FaqAccordionItemProps) {
  const contentRef = useRef<HTMLDivElement>(null);
  const [height, setHeight] = useState(0);

  useEffect(() => {
    setHeight(isOpen ? (contentRef.current?.scrollHeight ?? 0) : 0);
  }, [isOpen]);

  return (
    <div className="border-border border-b">
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={isOpen}
        className="font-body text-text-primary flex w-full cursor-pointer items-center justify-between gap-4 py-5 text-left font-medium"
      >
        {item.question}
        <ChevronDown
          aria-hidden
          className={cn(
            'h-5 w-5 shrink-0 transition-transform duration-300',
            isOpen && 'rotate-180',
          )}
        />
      </button>

      <div
        style={{ height }}
        className="overflow-hidden transition-[height] duration-300 ease-in-out"
      >
        <div
          ref={contentRef}
          className={cn(
            'font-body text-text-secondary pb-5 text-sm transition-opacity duration-200',
            isOpen ? 'opacity-100 delay-100' : 'opacity-0',
          )}
        >
          {item.answer}
        </div>
      </div>
    </div>
  );
}

interface FaqAccordionProps {
  items: FaqItem[];
}

export function FaqAccordion({ items }: FaqAccordionProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <div className="border-border border-t">
      {items.map((item, index) => (
        <FaqAccordionItem
          key={item.question}
          item={item}
          isOpen={openIndex === index}
          onToggle={() => setOpenIndex((current) => (current === index ? null : index))}
        />
      ))}
    </div>
  );
}
