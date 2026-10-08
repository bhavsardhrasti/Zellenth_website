'use client';
import { GradedImage, Grain, MaskedHeading, MicroLabel } from '@/components/ui/editorial';
import { facilityFacts } from '@/lib/data/about';
const WORKSHOP = 'https://images.unsplash.com/photo-1628744448840-55bdb2497bd4?w=1800&q=80';
const CROPS = [
  {
    src: 'https://images.unsplash.com/photo-1760085160766-ed473efe941e?w=600&q=80',
    label: 'Raw timber',
  },
  {
    src: 'https://images.unsplash.com/photo-1611600700192-d87eaeed4f81?w=600&q=80',
    label: 'Finish library',
  },
  {
    src: 'https://images.unsplash.com/photo-1772696860271-c53a0e799d31?w=600&q=80',
    label: 'In the room',
  },
];
export function AboutStory() {
  return (
    <section className="relative isolate overflow-hidden bg-black text-white">
      <GradedImage src={WORKSHOP} accent="#8f552d" imgClassName="scale-110" />
      <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/10 to-black/70" />
      <Grain />
      <div className="relative mx-auto flex min-h-[78vh] max-w-6xl flex-col justify-between px-6 py-12 sm:py-16">
        <div className="flex items-start justify-between gap-6">
          <MicroLabel className="text-white/80">The Workshop</MicroLabel>
          <MicroLabel className="hidden text-white/80 sm:block">Vatva GIDC · Ahmedabad</MicroLabel>
        </div>
        <div className="flex flex-col gap-10 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <MaskedHeading
              lines={['Doors, made where', 'you can see them.']}
              className="text-5xl sm:text-7xl"
            />
            <p className="font-body mt-6 max-w-sm text-sm text-white/75">
              We manufacture main doors, wardrobe shutters, and laminate finishes out of our own
              facility in Ahmedabad and let you preview any combination before you order.
            </p>
          </div>
          <dl className="flex flex-wrap items-start gap-x-10 gap-y-4">
            {facilityFacts.map((fact) => (
              <div key={fact.label} className="min-w-[6rem]">
                <dt>
                  <MicroLabel className="text-white/60">{fact.label}</MicroLabel>
                </dt>
                <dd className="font-display mt-1 text-lg leading-tight">{fact.value}</dd>
              </div>
            ))}
          </dl>
        </div>
        <div className="mt-10 flex items-start gap-3 border-t border-white/20 pt-8">
          {CROPS.map((crop) => (
            <figure key={crop.label} className="w-28 shrink-0 sm:w-36">
              <div className="relative h-32 overflow-hidden sm:h-40">
                <img src={crop.src} alt="" className="h-full w-full object-cover" />
              </div>
              <figcaption className="mt-2">
                <MicroLabel className="text-white/70">{crop.label}</MicroLabel>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
