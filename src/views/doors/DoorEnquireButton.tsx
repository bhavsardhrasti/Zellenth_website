'use client';

import { MessageCircle } from 'lucide-react';
import { useState } from 'react';

import { Button } from '@/components/ui/Button';
import { EnquiryModal } from '@/components/shared/EnquiryModal';

interface DoorEnquireButtonProps {
  doorId: string;
  doorName: string;
}

export function DoorEnquireButton({ doorId, doorName }: DoorEnquireButtonProps) {
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
        source="door_detail"
        doorId={doorId}
        doorName={doorName}
      />
    </>
  );
}
