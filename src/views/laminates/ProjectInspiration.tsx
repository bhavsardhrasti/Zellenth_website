import Image from 'next/image';

import { MaskedHeading, MicroLabel } from '@/components/ui/editorial';

const INSPIRATION = [
  {
    title: 'Warm minimal',
    detail: 'Natural grain against soft, quiet walls.',
    image: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?w=900&q=80',
  },
  {
    title: 'Light and layered',
    detail: 'Pale finishes that let daylight do the work.',
    image: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=900&q=80',
  },
  {
    title: 'Deep contrast',
    detail: 'A darker surface brings definition to a room.',
    image: 'https://images.unsplash.com/photo-1600210491892-03d54c0aaf87?w=900&q=80',
  },
];

export function ProjectInspiration(): React.JSX.Element {
  return (
    <section className="bg-background px-4 py-14 sm:px-6 sm:py-20">
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <MicroLabel className="text-brand">Room notes</MicroLabel>
            <MaskedHeading
              lines={['A little finish', 'in context.']}
              className="text-text-primary mt-4 text-4xl sm:text-6xl"
            />
          </div>
          <p className="font-body text-text-secondary max-w-xs text-sm leading-relaxed">
            Interior inspiration to help you picture the mood. These are styling references, not
            customer projects.
          </p>
        </div>

        <div className="mt-10 grid gap-5 sm:grid-cols-3">
          {INSPIRATION.map((item, index) => (
            <figure key={item.title} className={index === 1 ? 'sm:mt-10' : ''}>
              <div className="bg-neutral-tint relative aspect-[4/3] overflow-hidden">
                <Image
                  src={item.image}
                  alt={`${item.title} interior styling inspiration`}
                  fill
                  sizes="(min-width: 640px) 33vw, 100vw"
                  className="object-cover transition-transform duration-700 hover:scale-105"
                />
              </div>
              <figcaption className="border-border mt-4 border-t pt-3">
                <h3 className="font-display text-text-primary text-xl">{item.title}</h3>
                <p className="font-body text-text-secondary mt-1 text-sm">{item.detail}</p>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
