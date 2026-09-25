import { AnimatedSection } from '@/components/shared/AnimatedSection';
import { processSteps } from '@/lib/data/how-it-works';

export function HowItWorks() {
  return (
    <AnimatedSection className="bg-background">
      <div className="mx-auto max-w-6xl px-6 py-16">
        <div className="text-center">
          <span className="text-brand text-badge font-medium tracking-wider uppercase">
            How it works
          </span>
          <h2 className="font-display text-h2 text-text-primary mt-2">
            From browsing to a finished quote in three steps
          </h2>
        </div>

        <div className="border-border mt-12 grid gap-8 border-t sm:grid-cols-3 sm:gap-0 sm:divide-x sm:divide-border">
          {processSteps.map((step) => (
            <div key={step.step} className="flex flex-col gap-2 pt-6 sm:px-8 sm:first:pl-0 sm:last:pr-0">
              <span className="font-display text-brand text-h1">
                {String(step.step).padStart(2, '0')}
              </span>
              <h3 className="font-display text-text-primary text-lg">{step.title}</h3>
              <p className="font-body text-text-secondary text-sm">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </AnimatedSection>
  );
}
