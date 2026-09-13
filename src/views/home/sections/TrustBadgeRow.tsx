import { AnimatedSection } from '@/components/shared/AnimatedSection';
import { trustBadges } from '@/lib/data/trust-badges';

export function TrustBadgeRow() {
  return (
    <AnimatedSection className="bg-surface border-border border-y">
      <div className="mx-auto grid max-w-6xl grid-cols-2 gap-8 px-6 py-10 sm:grid-cols-3 lg:grid-cols-5">
        {trustBadges.map((badge) => (
          <div key={badge.title} className="flex flex-col items-center gap-2 text-center">
            <span className="bg-brand-tint text-brand flex h-12 w-12 items-center justify-center rounded-full">
              <badge.icon aria-hidden className="h-5 w-5" />
            </span>
            <span className="font-body text-text-primary text-sm font-medium">{badge.title}</span>
            <span className="font-body text-text-secondary text-xs">{badge.description}</span>
          </div>
        ))}
      </div>
    </AnimatedSection>
  );
}
