import Link from 'next/link';

import { ImageWrapper } from '@/components/shared/ImageWrapper';
import { MaskedHeading, MicroLabel } from '@/components/ui/editorial';
import { ROUTES } from '@/utils/routes';
import { cn } from '@/utils/cn';

export interface ColorFamilyShowcaseProps {
  /** The real colour families present in the archive, already sorted. */
  colorFamilies: string[];
  /** Active colour family from the URL, or 'all'. */
  activeColor: string;
  /** A representative swatch per family, resolved from the real laminates. */
  swatches: Record<string, string | undefined>;
}

export function ColorFamilyShowcase({
  colorFamilies,
  activeColor,
  swatches,
}: ColorFamilyShowcaseProps): React.JSX.Element | null {
  if (colorFamilies.length < 2) return null;

  return (
    <section className="bg-background px-4 py-14 sm:px-6 sm:py-20">
      <div className="mx-auto max-w-6xl">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <MicroLabel className="text-brand">By tone</MicroLabel>
            <MaskedHeading
              lines={['Every colour', 'family.']}
              className="text-text-primary mt-4 text-4xl sm:text-6xl"
            />
          </div>
          <p className="font-body max-w-xs text-sm leading-relaxed text-text-secondary">
            Grouped the way we store them pick a tone and the board narrows to it.
          </p>
        </div>

        <ul className="border-border mt-12 grid grid-cols-2 gap-x-4 gap-y-8 border-t pt-8 sm:grid-cols-3 lg:grid-cols-6">
          {colorFamilies.map((family, i) => {
            const isActive = family === activeColor;
            return (
              <li key={family}>
                <Link
                  href={{
                    pathname: ROUTES.LAMINATES,
                    query: isActive ? {} : { color: family },
                    hash: 'board',
                  }}
                  scroll={false}
                  aria-current={isActive ? 'page' : undefined}
                  className="group block"
                >
                  <div
                    className={cn(
                      'bg-neutral-tint relative aspect-square overflow-hidden transition-all duration-300',
                      isActive ? 'ring-accent-2 ring-2 ring-offset-2 ring-offset-background' : '',
                    )}
                  >
                    <ImageWrapper
                      src={swatches[family]}
                      alt={`${family} laminate`}
                      sizes="(min-width: 1024px) 16vw, (min-width: 640px) 33vw, 50vw"
                      className="transition-transform duration-700 group-hover:scale-105"
                      emptyLabel=""
                    />
                    <span
                      aria-hidden
                      className={cn(
                        'absolute inset-0 transition-colors duration-300',
                        isActive ? 'bg-transparent' : 'bg-transparent group-hover:bg-black/10',
                      )}
                    />
                  </div>
                  <div className="mt-3 flex items-baseline justify-between gap-2">
                    <span className="font-display text-text-primary truncate text-lg leading-tight">
                      {family}
                    </span>
                    <MicroLabel
                      className={cn(
                        'shrink-0 tabular-nums transition-colors',
                        isActive ? 'text-accent-2' : 'text-text-muted',
                      )}
                    >
                      {String(i + 1).padStart(2, '0')}
                    </MicroLabel>
                  </div>
                  <MicroLabel
                    className={cn(
                      'mt-1 block transition-colors',
                      isActive ? 'text-accent-2' : 'text-text-muted group-hover:text-text-primary',
                    )}
                  >
                    {isActive ? 'Filtering this tone' : 'Filter by tone'}
                  </MicroLabel>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
