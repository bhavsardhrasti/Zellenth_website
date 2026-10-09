import Link from 'next/link';
import type { Route } from 'next';

import { ImageWrapper } from '@/components/shared/ImageWrapper';
import { MaskedHeading, MicroLabel } from '@/components/ui/editorial';
import { ROUTES } from '@/utils/routes';

const DOOR_STYLES = [
  {
    name: 'Flat slab',
    detail: 'A quiet, uninterrupted face',
    treatment: '',
  },
  {
    name: 'Shaker',
    detail: 'A framed, classic profile',
    treatment: 'after:absolute after:inset-[14%] after:border after:border-white/45',
  },
  {
    name: 'Fluted',
    detail: 'A vertical play of shadow',
    treatment:
      'after:absolute after:inset-0 after:bg-[repeating-linear-gradient(90deg,transparent_0,transparent_10px,rgba(0,0,0,0.13)_11px,transparent_13px)]',
  },
];

interface DoorPreviewStripProps {
  images: string[];
}

export function DoorPreviewStrip({ images }: DoorPreviewStripProps): React.JSX.Element {
  return (
    <section className="bg-surface-warm px-4 py-14 sm:px-6 sm:py-20">
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <MicroLabel className="text-brand">One finish, three directions</MicroLabel>
            <MaskedHeading
              lines={['See it on', 'a door shape.']}
              className="text-text-primary mt-4 text-4xl sm:text-6xl"
            />
          </div>
          <p className="font-body text-text-secondary max-w-sm text-sm leading-relaxed">
            A visual study of distinct door looks, from clean slab to framed and fluted details.
            Open the live visualizer to see available laminates on a real Zellenth door.
          </p>
        </div>

        <div className="mt-10 grid grid-cols-3 gap-3 border-t border-border pt-8 sm:gap-6">
          {DOOR_STYLES.map((style, index) => (
            <Link
              href={ROUTES.DOORS as Route}
              key={style.name}
              className="group block"
              aria-label={`${style.name}: browse doors to try a finish`}
            >
              <div className="mx-auto max-w-64">
                <div className="relative aspect-[3/4] overflow-hidden bg-neutral-tint shadow-[0_12px_35px_rgba(50,32,20,0.12)]">
                  <ImageWrapper
                    src={images[index]}
                    alt={`${style.name} door style`}
                    sizes="(min-width: 1024px) 20vw, 30vw"
                    className="transition-transform duration-700 group-hover:scale-105"
                    emptyLabel=""
                  />
                  <span
                    aria-hidden
                    className={`pointer-events-none absolute inset-0 border-[7px] border-black/10 ${style.treatment} after:content-['']`}
                  />
                  <span
                    aria-hidden
                    className="absolute right-[15%] bottom-1/2 h-2 w-2 translate-y-1/2 rounded-full bg-white/70 shadow"
                  />
                </div>
              </div>
              <div className="mt-4">
                <h3 className="font-display text-text-primary text-lg sm:text-2xl">{style.name}</h3>
                <p className="font-body text-text-secondary mt-1 hidden text-xs sm:block">
                  {style.detail}
                </p>
                <MicroLabel className="text-brand mt-3 block">Explore doors →</MicroLabel>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
