import { AnimatedSection } from '@/components/shared/AnimatedSection';
import { Breadcrumbs } from '@/components/shared/Breadcrumbs';
import type { LegalPageContent } from '@/lib/data/legal';

interface LegalPageViewProps {
  content: LegalPageContent;
}

export default function LegalPageView({ content }: LegalPageViewProps) {
  return (
    <main className="bg-background min-h-dvh">
      <AnimatedSection immediate className="mx-auto max-w-3xl px-6 pt-6 pb-16 sm:pt-8 sm:pb-24">
        <Breadcrumbs items={[{ label: content.title }]} />
        <h1 className="font-display text-h1 text-text-primary mt-6">{content.title}</h1>
        <p className="font-body text-text-muted mt-2 text-sm">Last updated: {content.updatedOn}</p>
        <p className="font-body text-text-secondary mt-6">{content.intro}</p>

        <div className="mt-10 flex flex-col gap-8">
          {content.sections.map((section) => (
            <div key={section.heading}>
              <h2 className="font-display text-h2 text-text-primary text-xl">{section.heading}</h2>
              <div className="mt-3 flex flex-col gap-3">
                {section.body.map((paragraph, index) => (
                  <p key={index} className="font-body text-text-secondary text-sm sm:text-base">
                    {paragraph}
                  </p>
                ))}
              </div>
            </div>
          ))}
        </div>
      </AnimatedSection>
    </main>
  );
}
