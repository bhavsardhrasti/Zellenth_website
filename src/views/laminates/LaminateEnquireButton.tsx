'use client';

import { MessageCircle } from 'lucide-react';
import { useState } from 'react';

import { Button } from '@/components/ui/Button';
import { EnquiryModal } from '@/components/shared/EnquiryModal';

interface LaminateEnquireButtonProps {
  laminateId: string;
  laminateName: string;
}

export function LaminateEnquireButton({ laminateId, laminateName }: LaminateEnquireButtonProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Button
        variant="secondary"
        icon={MessageCircle}
        onClick={() => setIsOpen(true)}
        className="w-fit"
      >
        Enquire
      </Button>
      <EnquiryModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        source="laminate_detail"
        laminateId={laminateId}
        laminateName={laminateName}
      />
    </>
  );
}
