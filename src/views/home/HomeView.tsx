import Link from 'next/link';
import type { Route } from 'next';

import { AnimatedSection } from '@/components/shared/AnimatedSection';
import { Carousel } from '@/components/shared/Carousel';
import { ImageWrapper } from '@/components/shared/ImageWrapper';
import DoorCard from '@/views/doors/DoorCard';
import LaminateCard from '@/views/laminates/LaminateCard';
import { CtaBanner } from '@/views/home/sections/CtaBanner';
import { HowItWorks } from '@/views/home/sections/HowItWorks';
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
  bannerDoor,
}: HomeViewProps) {
  const bannerImage = bannerDoor?.images.find((image) => image.isPrimary) ?? bannerDoor?.images[0];

  return (
    <main className="bg-background min-h-dvh">
      {/* Hero */}
      <section className="mx-auto max-w-6xl px-6 pt-16 pb-10 sm:pt-24">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <h1 className="font-display text-hero text-text-primary max-w-xl">
            Doors &amp; Decors, crafted for life
          </h1>
          <p className="font-body text-text-secondary max-w-sm text-sm sm:text-base">
            Ahmedabad-manufactured doors, finished with any laminate you choose and rendered on your
            screen in real time before you order.
          </p>
        </div>
        <div className="mt-10 flex flex-wrap gap-3">
          <Link
            href={ROUTES.DOORS as Route}
            className="bg-action hover:bg-action-hover text-action-text shadow-card rounded-sm px-6 py-3 font-medium transition-colors"
          >
            Try the Visualizer
          </Link>
          <Link
            href={ROUTES.LAMINATES as Route}
            className="bg-surface border-border hover:bg-neutral-tint text-text-primary rounded-sm border px-6 py-3 font-medium transition-colors"
          >
            Explore Laminates
          </Link>
        </div>

        {bannerImage ? (
          <div className="bg-neutral-tint shadow-card relative mt-10 aspect-[3/1] w-full overflow-hidden rounded-md">
            <ImageWrapper
              src={bannerImage.url.full}
              alt={bannerImage.altText}
              sizes="100vw"
              priority
            />
          </div>
        ) : null}
      </section>

      <TrustBadgeRow />
      <HowItWorks />

      {/* Shop by category */}
      {categories.length > 0 ? (
        <AnimatedSection className="bg-surface">
          <div className="mx-auto max-w-6xl px-6 py-16">
            <h2 className="font-display text-h2 text-text-primary text-center">Shop by Category</h2>
            <p className="font-body text-text-secondary mt-2 text-center">
              Find the right door for every room.
            </p>
            <div className="mt-10 flex flex-wrap justify-center gap-8">
              {categories.map((category) => (
                <Link
                  key={category.slug}
                  href={{ pathname: ROUTES.DOORS, query: { category: category.slug } }}
                  className="group flex flex-col items-center gap-3"
                >
                  <div className="bg-neutral-tint shadow-card relative h-32 w-32 overflow-hidden rounded-full transition-transform duration-300 group-hover:scale-105 sm:h-36 sm:w-36">
                    <ImageWrapper
                      src={category.image?.url.thumbnail}
                      alt={category.image?.altText ?? category.name}
                      sizes="144px"
                      emptyLabel=""
                    />
                  </div>
                  <span className="font-body text-text-primary text-sm font-medium">
                    {category.name}
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </AnimatedSection>
      ) : null}

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
                    door={door}
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
            <div className="mt-10">
              <Carousel label="Featured laminates" basis="basis-[70%] sm:basis-1/3 lg:basis-1/5">
                {featuredLaminates.map((laminate) => (
                  <LaminateCard key={laminate.slug} laminate={laminate} />
                ))}
              </Carousel>
            </div>
          </div>
        </AnimatedSection>
      ) : null}

      <WhyChooseUs />
      <CtaBanner />
    </main>
  );
}
