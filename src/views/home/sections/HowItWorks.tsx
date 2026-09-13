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

        <div className="relative mt-12 grid gap-10 sm:grid-cols-3">
          {processSteps.map((step) => (
            <div key={step.step} className="flex flex-col items-center gap-3 text-center">
              <div className="relative flex h-16 w-16 items-center justify-center">
                <span className="bg-brand-tint text-brand flex h-16 w-16 items-center justify-center rounded-full">
                  <step.icon aria-hidden className="h-6 w-6" />
                </span>
                <span className="bg-action text-action-text absolute -top-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full text-xs font-semibold">
                  {step.step}
                </span>
              </div>
              <h3 className="font-display text-text-primary text-lg">{step.title}</h3>
              <p className="font-body text-text-secondary max-w-xs text-sm">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </AnimatedSection>
  );
}
