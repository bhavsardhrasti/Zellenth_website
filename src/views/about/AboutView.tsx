import { AnimatedSection } from '@/components/shared/AnimatedSection';
import { Breadcrumbs } from '@/components/shared/Breadcrumbs';
import { CtaBanner } from '@/views/home/sections/CtaBanner';
import { aboutValues } from '@/lib/data/about';
import { stats } from '@/lib/data/why-choose';

export default function AboutView() {
  return (
    <main className="bg-background min-h-dvh">
      <div className="mx-auto max-w-3xl px-6 pt-6 sm:pt-8">
        <Breadcrumbs items={[{ label: 'About' }]} />
      </div>

      <AnimatedSection immediate>
        <div className="mx-auto max-w-3xl px-6 pt-6 pb-16 text-center sm:pb-24">
          <span className="text-brand text-badge font-medium tracking-wider uppercase">
            About Zellenth
          </span>
          <h1 className="font-display text-hero text-text-primary mt-3">
            Doors, made where you can see them being made
          </h1>
          <p className="font-body text-text-secondary mt-5 text-base sm:text-lg">
            We manufacture main doors, wardrobe shutters, and laminate finishes out of our own
            facility in Ahmedabad, and let you preview any combination on screen before you order.
          </p>
        </div>
      </AnimatedSection>

      <AnimatedSection className="bg-surface border-border border-y">
        <div className="mx-auto max-w-6xl px-6 py-10">
          <div className="grid grid-cols-2 gap-6 sm:grid-cols-4">
            {stats.map((stat) => (
              <div key={stat.label} className="flex flex-col items-center gap-1 text-center">
                <span className="font-display text-h1 text-brand">{stat.value}</span>
                <span className="font-body text-text-secondary text-sm">{stat.label}</span>
              </div>
            ))}
          </div>
        </div>
      </AnimatedSection>

      <AnimatedSection className="bg-surface-warm">
        <div className="mx-auto max-w-6xl px-6 py-16">
          <div className="max-w-2xl">
            <span className="text-brand text-badge font-medium tracking-wider uppercase">
              Our approach
            </span>
            <h2 className="font-display text-h2 text-text-primary mt-2">What we stand for</h2>
          </div>
          <div className="mt-10 grid gap-8 sm:grid-cols-3">
            {aboutValues.map((value) => (
              <div key={value.title} className="flex flex-col gap-4">
                <span className="bg-surface text-brand shadow-card flex h-12 w-12 items-center justify-center rounded-full">
                  <value.icon aria-hidden className="h-5 w-5" />
                </span>
                <div>
                  <h3 className="font-display text-text-primary text-lg">{value.title}</h3>
                  <p className="font-body text-text-secondary mt-1 text-sm">{value.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </AnimatedSection>

      <CtaBanner />
    </main>
  );
}
