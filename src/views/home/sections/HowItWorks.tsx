'use client';

import { VerticalTimeline } from '@/components/ui/vertical-timeline';
import { processSteps } from '@/lib/data/how-it-works';

export function HowItWorks() {
  return (
    <VerticalTimeline
      eyebrow="How it works"
      title="From browsing to a finished quote in three steps"
      description="No login, no commitment — pick a door, see it finished, and ask for a price."
      steps={processSteps.map((step) => ({
        title: step.title,
        description: step.description,
        icon: step.icon,
      }))}
    />
  );
}
