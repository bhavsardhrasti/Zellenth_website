import { AnimatedSection } from '@/components/shared/AnimatedSection';
import { CtaBanner } from '@/views/home/sections/CtaBanner';
import { stats } from '@/lib/data/why-choose';
import { AboutMilestones } from '@/views/about/sections/AboutMilestones';
import { AboutStory } from '@/views/about/sections/AboutStory';
import { AboutValues } from '@/views/about/sections/AboutValues';
import { StatsBand } from '@/views/about/sections/StatsBand';

export default function AboutView(): React.JSX.Element {
  return (
    <main className="bg-background min-h-dvh">
      <AnimatedSection immediate>
        <AboutStory />
      </AnimatedSection>

      <StatsBand stats={stats} />
      <AboutMilestones />
      <AboutValues />

      <CtaBanner />
    </main>
  );
}
