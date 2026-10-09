'use client';

import { useState } from 'react';

import { Button } from '@/components/ui/Button';
import { SampleRequestModal } from '@/components/shared/SampleRequestModal';

export function SampleRequestButton(): React.JSX.Element {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Button variant="secondary" onClick={() => setIsOpen(true)} className="mt-8">
        Request a sample
      </Button>
      <SampleRequestModal isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </>
  );
}
