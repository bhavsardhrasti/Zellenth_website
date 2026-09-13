import { MessageSquareText, PaintBucket, PanelTop, type LucideIcon } from 'lucide-react';

export interface ProcessStep {
  step: number;
  icon: LucideIcon;
  title: string;
  description: string;
}

export const processSteps: ProcessStep[] = [
  {
    step: 1,
    icon: PanelTop,
    title: 'Pick a Door',
    description:
      'Browse our catalogue of main doors, wardrobe shutters, bedroom and sliding doors.',
  },
  {
    step: 2,
    icon: PaintBucket,
    title: 'Try Laminates in Real Time',
    description:
      'Apply any laminate to your chosen door and see the grain, sheen, and shadow rendered instantly.',
  },
  {
    step: 3,
    icon: MessageSquareText,
    title: 'Get a Quote',
    description:
      'Like what you see? Send an enquiry and our team gets back with pricing and lead time.',
  },
];
