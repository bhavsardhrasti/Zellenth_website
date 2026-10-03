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
  // Both showcases are client components, so hand them plain objects rather
  // than Mongoose documents (ObjectId fields can't cross the boundary).
  const doorsForShowcase = featuredDoors.slice(0, 6).map((door) => {
    const image = door.images.find((item) => item.isPrimary) ?? door.images[0];
    return {
      slug: door.slug,
      name: door.name,
      code: door.code,
      category: categoryNames[door.categoryId.toString()],
      image: image?.url.full,
    };
  });
  const lamsForShowcase = featuredLaminates.slice(0, 8).map((laminate) => {
    const image = laminate.images.find((item) => item.isPrimary) ?? laminate.images[0];
    return {
      slug: laminate.slug,
      name: laminate.name,
      code: laminate.code,
      colorFamily: laminate.colorFamily,
      image: image?.url.mid,
    };
  });

  return (
    <main className="bg-background min-h-dvh">
      <CarouselHero />

      <TrustBadgeRow />
      <ScrollChoreographyHero />
      <HowItWorks />

      {featuredDoors.length > 0 ? <FeaturedDoors doors={doorsForShowcase} /> : null}

      {categories.length > 0 ? <CategoryGrid categories={categories} /> : null}

      {featuredLaminates.length > 0 ? <LaminateWall samples={lamsForShowcase} /> : null}

      <WhyChooseUs />
      <CtaBanner />
    </main>
  );
}
