import { AnimatedSection } from '@/components/shared/AnimatedSection';
import { Breadcrumbs } from '@/components/shared/Breadcrumbs';
import { CtaBanner } from '@/views/home/sections/CtaBanner';
import { stats } from '@/lib/data/why-choose';
import { AboutMilestones } from '@/views/about/sections/AboutMilestones';
import { AboutStory } from '@/views/about/sections/AboutStory';
import { AboutValues } from '@/views/about/sections/AboutValues';
import { StatsBand } from '@/views/about/sections/StatsBand';

export default function AboutView() {
  return (
    <main className="bg-background min-h-dvh">
      <div className="mx-auto max-w-6xl px-6 pt-6 sm:pt-8">
        <Breadcrumbs items={[{ label: 'About' }]} />
      </div>

      <AnimatedSection immediate className="mt-6 sm:mt-8">
        <AboutStory />
      </AnimatedSection>

      <StatsBand stats={stats} />
      <AboutMilestones />
      <AboutValues />

      <CtaBanner />
    </main>
  );
}
