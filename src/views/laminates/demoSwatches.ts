import type { LaminateSpecimen } from '@/views/laminates/SpecimenArchive';

const FALLBACK_DOOR_IMAGES = [
  {
    src: 'https://images.unsplash.com/photo-1629999400001-5e666f0754d9?w=900&q=80',
    alt: 'Brown wood door beside greenery',
  },
  {
    src: 'https://cms.interiorcompany.com/wp-content/uploads/2024/12/sunmica-door-design.jpg',
    alt: 'Contemporary laminate door',
  },
  {
    src: 'https://cms.interiorcompany.com/wp-content/uploads/2024/12/white-sunmica-door-design.jpg',
    alt: 'White laminate door',
  },
  {
    src: 'https://cms.interiorcompany.com/wp-content/uploads/2024/12/main-door-design-in-sunmica-with-rusty-appearance.jpg',
    alt: 'Rust-toned main door design',
  },
  {
    src: 'https://cms.interiorcompany.com/wp-content/uploads/2024/12/minimalist-yet-modern-sunmica-door-design.jpg',
    alt: 'Minimal modern door design',
  },
  {
    src: 'https://cms.interiorcompany.com/wp-content/uploads/2024/12/sunmica-door-design-in-bold-and-bright-colour-1.jpg',
    alt: 'Bold coloured laminate door',
  },
  {
    src: 'https://cms.interiorcompany.com/wp-content/uploads/2024/12/sunmica-door-design-in-textured-finish.jpg',
    alt: 'Textured laminate door',
  },
  {
    src: 'https://cms.interiorcompany.com/wp-content/uploads/2024/12/sunmica-door-design-with-geometric-pattern.jpg',
    alt: 'Geometric panel door design',
  },
  {
    src: 'https://royaletouchewp.s3.ap-south-1.amazonaws.com/wp-content/uploads/2021/05/13124630/Front-door-new.jpg',
    alt: 'Woodgrain front door with panels',
  },
  {
    src: 'https://images.unsplash.com/photo-1544641724-73f0d1bee38b?w=900&q=80',
    alt: 'Classic wood panel door',
  },
  {
    src: 'https://images.unsplash.com/photo-1720265017851-c0e2d2f9c81e?w=900&q=80',
    alt: 'Entry door surrounded by greenery',
  },
  {
    src: 'https://images.unsplash.com/photo-1634822930432-0594057fdff2?w=900&q=80',
    alt: 'Modern double entry door',
  },
  {
    src: 'https://cms.interiorcompany.com/wp-content/uploads/2024/12/wood-colour-sunmica-design-for-bathroom.jpg',
    alt: 'Wood colour laminate door',
  },
];

export const DEMO_SWATCHES: LaminateSpecimen[] = [
  {
    slug: 'preview-natural-oak',
    name: 'Natural Oak',
    code: 'PRE-01',
    colorFamily: 'Warm wood',
    finish: 'textured',
    finishLabel: 'Textured',
    grainDirection: 'vertical',
  },
  {
    slug: 'preview-smoked-walnut',
    name: 'Smoked Walnut',
    code: 'PRE-02',
    colorFamily: 'Warm wood',
    finish: 'matte',
    finishLabel: 'Matte',
    grainDirection: 'vertical',
  },
  {
    slug: 'preview-sandstone',
    name: 'Soft Sandstone',
    code: 'PRE-03',
    colorFamily: 'Neutral',
    finish: 'matte',
    finishLabel: 'Matte',
    grainDirection: 'no-grain',
  },
  {
    slug: 'preview-ink-blue',
    name: 'Inkwell Blue',
    code: 'PRE-04',
    colorFamily: 'Cool tone',
    finish: 'gloss',
    finishLabel: 'Gloss',
    grainDirection: 'no-grain',
  },
  {
    slug: 'preview-driftwood',
    name: 'Pale Driftwood',
    code: 'PRE-05',
    colorFamily: 'Warm wood',
    finish: 'textured',
    finishLabel: 'Textured',
    grainDirection: 'horizontal',
  },
  {
    slug: 'preview-chalk',
    name: 'Chalk White',
    code: 'PRE-06',
    colorFamily: 'Neutral',
    finish: 'gloss',
    finishLabel: 'Gloss',
    grainDirection: 'no-grain',
  },
  {
    slug: 'preview-forest-green',
    name: 'Forest Green',
    code: 'PRE-07',
    colorFamily: 'Statement',
    finish: 'matte',
    finishLabel: 'Matte',
    grainDirection: 'no-grain',
  },
  {
    slug: 'preview-blackened-ash',
    name: 'Blackened Ash',
    code: 'PRE-08',
    colorFamily: 'Cool tone',
    finish: 'textured',
    finishLabel: 'Textured',
    grainDirection: 'vertical',
  },
  {
    slug: 'preview-clay',
    name: 'Burnt Clay',
    code: 'PRE-09',
    colorFamily: 'Statement',
    finish: 'matte',
    finishLabel: 'Matte',
    grainDirection: 'no-grain',
  },
  {
    slug: 'preview-honey-maple',
    name: 'Honey Maple',
    code: 'PRE-10',
    colorFamily: 'Warm wood',
    finish: 'gloss',
    finishLabel: 'Gloss',
    grainDirection: 'vertical',
  },
  {
    slug: 'preview-fog-grey',
    name: 'Morning Fog',
    code: 'PRE-11',
    colorFamily: 'Neutral',
    finish: 'matte',
    finishLabel: 'Matte',
    grainDirection: 'no-grain',
  },
  {
    slug: 'preview-oxblood',
    name: 'Oxblood',
    code: 'PRE-12',
    colorFamily: 'Statement',
    finish: 'gloss',
    finishLabel: 'Gloss',
    grainDirection: 'no-grain',
  },
];

export function withDoorImages(doorImages: { src: string; alt: string }[]): LaminateSpecimen[] {
  const uniqueDoorImages = Array.from(
    new Map(doorImages.map((doorImage) => [doorImage.src, doorImage])).values(),
  );
  const chalkWhiteImage =
    uniqueDoorImages.find((image) => /\bwhite\b|\bchalk\b/i.test(image.alt)) ??
    FALLBACK_DOOR_IMAGES[2]!;
  const availableImages = [...uniqueDoorImages, ...FALLBACK_DOOR_IMAGES].filter(
    (image, index, images) =>
      images.findIndex((candidate) => candidate.src === image.src) === index,
  );

  return DEMO_SWATCHES.map((swatch, index) => {
    const doorImage =
      swatch.slug === 'preview-chalk'
        ? chalkWhiteImage
        : availableImages[index % availableImages.length]!;
    return {
      ...swatch,
      image: doorImage.src,
      thumbnail: doorImage.src,
    };
  });
}

export function filterDemoSwatches(
  finish: string,
  color: string,
  swatches: LaminateSpecimen[] = DEMO_SWATCHES,
): LaminateSpecimen[] {
  return swatches.filter(
    (swatch) =>
      (finish === 'all' || swatch.finish === finish) &&
      (color === 'all' || swatch.colorFamily === color),
  );
}
