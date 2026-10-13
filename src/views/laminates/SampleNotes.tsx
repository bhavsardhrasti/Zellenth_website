import { DoorOpen, Monitor, Rows3, type LucideIcon } from 'lucide-react';

import { MaskedHeading, MicroLabel } from '@/components/ui/editorial';
import { SampleRequestButton } from '@/views/laminates/SampleRequestButton';

const NOTES: { title: string; body: string; icon: LucideIcon }[] = [
  {
    title: 'Screens differ',
    body: 'Colour on a phone or monitor can shift slightly. Visit us or ask for a physical sample before a large order.',
    icon: Monitor,
  },
  {
    title: 'Grain direction',
    body: 'Each laminate lists its grain direction, so vertical and horizontal runs line up the way you expect.',
    icon: Rows3,
  },
  {
    title: 'Try before you decide',
    body: 'Choose an available door and open its visualizer to see a finish on a real door.',
    icon: DoorOpen,
  },
];

export function SampleNotes(): React.JSX.Element {
  return (
    <section className="bg-surface-warm px-4 py-14 sm:px-6 sm:py-20">
      <div className="mx-auto max-w-6xl">
        <MicroLabel className="text-brand">Good to know</MicroLabel>
        <MaskedHeading
          lines={['Before you', 'order a sample.']}
          className="text-text-primary mt-4 text-4xl sm:text-6xl"
        />
        <div className="border-border mt-11 grid border-t md:grid-cols-3">
          {NOTES.map(({ title, body, icon: Icon }, i) => (
            <div
              key={title}
              className="border-border border-b py-8 md:border-r md:px-8 md:first:pl-0 md:last:border-r-0"
            >
              <div className="mb-5 flex items-center gap-2">
                <Icon aria-hidden className="text-brand h-5 w-5" strokeWidth={1.5} />
                <MicroLabel className="text-brand tabular-nums">
                  {String(i + 1).padStart(2, '0')}
                </MicroLabel>
              </div>
              <h3 className="font-display text-text-primary mt-3 text-2xl">{title}</h3>
              <p className="font-body text-text-secondary mt-3 text-sm leading-relaxed">{body}</p>
            </div>
          ))}
        </div>
        <SampleRequestButton />
      </div>
    </section>
  );
}
