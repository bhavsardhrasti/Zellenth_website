import Link from 'next/link';
import type { Route } from 'next';

import { AnimatedSection } from '@/components/shared/AnimatedSection';
import { FaqAccordion } from '@/components/shared/FaqAccordion';
import { faqItems } from '@/lib/data/faq';
import { ROUTES } from '@/utils/routes';

export default function FaqView() {
  return (
    <main className="bg-background min-h-dvh">
      <AnimatedSection className="mx-auto max-w-3xl px-6 py-16 sm:py-24">
        <h1 className="font-display text-h1 text-text-primary">Frequently Asked Questions</h1>
        <p className="font-body text-text-secondary mt-3">
          Can&apos;t find what you&apos;re looking for? Reach out on our{' '}
          <Link href={ROUTES.CONTACT as Route} className="text-brand font-medium">
            Contact
          </Link>{' '}
          page.
        </p>

        <div className="mt-10">
          <FaqAccordion items={faqItems} />
        </div>
      </AnimatedSection>
    </main>
  );
}
