import { AnimatedSection } from '@/components/shared/AnimatedSection';
import { pillars, stats } from '@/lib/data/why-choose';

export function WhyChooseUs() {
  return (
    <AnimatedSection className="bg-surface-warm">
      <div className="mx-auto max-w-6xl px-6 py-16">
        <div className="max-w-2xl">
          <span className="text-brand text-badge font-medium tracking-wider uppercase">
            Why choose us
          </span>
          <h2 className="font-display text-h2 text-text-primary mt-2">
            Manufactured in-house, built for real conditions
          </h2>
          <p className="font-body text-text-secondary mt-3">
            We&apos;re not a reseller. Every door that leaves our Ahmedabad factory is made,
            treated, and finished by our own team.
          </p>
        </div>

        <div className="mt-10 grid grid-cols-2 gap-6 sm:grid-cols-4">
          {stats.map((stat) => (
            <div key={stat.label} className="flex flex-col gap-1">
              <span className="font-display text-h1 text-brand">{stat.value}</span>
              <span className="font-body text-text-secondary text-sm">{stat.label}</span>
            </div>
          ))}
        </div>

        <div className="border-border mt-12 grid gap-8 border-t pt-8 sm:grid-cols-2">
          {pillars.map((pillar, index) => (
            <div key={pillar.title} className="flex gap-4">
              <span className="font-display text-text-muted text-lg">
                {String(index + 1).padStart(2, '0')}
              </span>
              <div>
                <h3 className="font-display text-text-primary text-lg">{pillar.title}</h3>
                <p className="font-body text-text-secondary mt-1 text-sm">{pillar.body}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </AnimatedSection>
  );
}
