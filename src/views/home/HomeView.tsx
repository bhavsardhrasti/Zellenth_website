import Link from 'next/link';
import type { Route } from 'next';

import { AnimatedSection } from '@/components/shared/AnimatedSection';
import { Carousel } from '@/components/shared/Carousel';
import DoorCard from '@/views/doors/DoorCard';
import LaminateCard from '@/views/laminates/LaminateCard';
import { CarouselHero } from '@/views/home/sections/CarouselHero';
import { CategoryGrid } from '@/views/home/sections/CategoryGrid';
import { CtaBanner } from '@/views/home/sections/CtaBanner';
import { HowItWorks } from '@/views/home/sections/HowItWorks';
import { ScrollChoreographyHero } from '@/views/home/sections/ScrollChoreographyHero';
import { TrustBadgeRow } from '@/views/home/sections/TrustBadgeRow';
import { WhyChooseUs } from '@/views/home/sections/WhyChooseUs';
import { ROUTES } from '@/utils/routes';
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

      {/* Shop by category */}
      {categories.length > 0 ? <CategoryGrid categories={categories} /> : null}

      {/* Featured doors */}
      {featuredDoors.length > 0 ? (
        <AnimatedSection className="bg-background">
          <div className="mx-auto max-w-6xl px-6 py-16">
            <div className="flex items-end justify-between">
              <div>
                <h2 className="font-display text-h2 text-text-primary">Featured Doors</h2>
                <p className="font-body text-text-secondary mt-2">
                  Our latest additions to the catalogue.
                </p>
              </div>
              <Link
                href={ROUTES.DOORS as Route}
                className="text-brand font-body text-sm font-medium"
              >
                View all
              </Link>
            </div>
            <div className="mt-10">
              <Carousel label="Featured doors">
                {featuredDoors.map((door) => (
                  <DoorCard
                    key={door.slug}
                    door={{
                      slug: door.slug,
                      name: door.name,
                      code: door.code,
                      images: door.images,
                    }}
                    categoryName={categoryNames[door.categoryId.toString()]}
                  />
                ))}
              </Carousel>
            </div>
          </div>
        </AnimatedSection>
      ) : null}

      {/* Featured laminates */}
      {featuredLaminates.length > 0 ? (
        <AnimatedSection className="bg-surface">
          <div className="mx-auto max-w-6xl px-6 py-16">
            <div className="flex items-end justify-between">
              <div>
                <h2 className="font-display text-h2 text-text-primary">Explore Laminates</h2>
                <p className="font-body text-text-secondary mt-2">
                  Textures and finishes ready to try on any door.
                </p>
              </div>
              <Link
                href={ROUTES.LAMINATES as Route}
                className="text-brand font-body text-sm font-medium"
              >
                View all
              </Link>
            </div>
            <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
              {featuredLaminates.map((laminate) => (
                <LaminateCard
                  key={laminate.slug}
                  laminate={{
                    slug: laminate.slug,
                    name: laminate.name,
                    code: laminate.code,
                    colorFamily: laminate.colorFamily,
                    images: laminate.images,
                  }}
                />
              ))}
            </div>
          </div>
        </AnimatedSection>
      ) : null}

      <WhyChooseUs />
      <CtaBanner />
    </main>
  );
}
