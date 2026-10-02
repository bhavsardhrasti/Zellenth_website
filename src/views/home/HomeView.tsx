import { CarouselHero } from '@/views/home/sections/CarouselHero';
import { CategoryGrid } from '@/views/home/sections/CategoryGrid';
import { CtaBanner } from '@/views/home/sections/CtaBanner';
import { FeaturedDoors } from '@/views/home/sections/FeaturedDoors';
import { HowItWorks } from '@/views/home/sections/HowItWorks';
import { LaminateWall } from '@/views/home/sections/LaminateWall';
import { ScrollChoreographyHero } from '@/views/home/sections/ScrollChoreographyHero';
import { TrustBadgeRow } from '@/views/home/sections/TrustBadgeRow';
import { WhyChooseUs } from '@/views/home/sections/WhyChooseUs';
import type { DoorImage } from '@/lib/db/models/Door.model';
import type { DoorDocument } from '@/lib/db/models/Door.model';
import type { LaminateDocument } from '@/lib/db/models/Laminate.model';

export interface CategoryShowcase {
  slug: string;
  name: string;
  image: DoorImage | undefined;
}

export interface HomeViewProps {
  categories: CategoryShowcase[];
  featuredDoors: DoorDocument[];
  categoryNames: Record<string, string>;
  featuredLaminates: LaminateDocument[];
  bannerDoor: DoorDocument | undefined;
}

export default function HomeView({
  categories,
  featuredDoors,
  categoryNames,
  featuredLaminates,
}: HomeViewProps) {
  return (
    <main className="bg-background min-h-dvh">
      <CarouselHero />

      {/* Showcase moment — real motion, not the primary hero. */}
      <ScrollChoreographyHero />

      <TrustBadgeRow />
      <HowItWorks />

      {categories.length > 0 ? <CategoryGrid categories={categories} /> : null}

      {featuredDoors.length > 0 ? (
        <FeaturedDoors doors={featuredDoors} categoryNames={categoryNames} />
      ) : null}

      {featuredLaminates.length > 0 ? <LaminateWall laminates={featuredLaminates} /> : null}

      <WhyChooseUs />
      <CtaBanner />
    </main>
  );
}
