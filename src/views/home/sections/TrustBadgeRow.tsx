import { trustBadges } from '@/lib/data/trust-badges';

// Manufacturing facts as a numbered hairline rail — the hero's counter
// language (01 — 05), no icons or tiles.
export function TrustBadgeRow() {
  return (
    <section className="bg-background border-border border-b">
      <ol className="divide-border mx-auto flex max-w-6xl snap-x snap-mandatory overflow-x-auto sm:grid sm:grid-cols-5 sm:divide-x sm:overflow-visible">
        {trustBadges.map((badge, index) => (
          <li
            key={badge.title}
            className="border-border flex w-[72vw] shrink-0 snap-start flex-col gap-3 border-r px-6 py-8 sm:w-auto sm:border-r-0 sm:first:pl-6"
          >
            <span className="text-brand font-body text-[11px] font-medium tracking-[0.14em] tabular-nums">
              {String(index + 1).padStart(2, '0')}
            </span>
            <span className="font-display text-text-primary text-lg leading-tight">
              {badge.title}
            </span>
            <span className="font-body text-text-secondary text-xs leading-relaxed">
              {badge.description}
            </span>
          </li>
        ))}
      </ol>
    </section>
  );
}
