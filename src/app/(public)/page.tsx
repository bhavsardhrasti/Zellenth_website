export const dynamic = 'force-dynamic';

import HomeView from '@/views/home/HomeView';
import { listDoors, getFeaturedDoorsByCategory } from '@/lib/services/door.service';
import { listDoorCategories } from '@/lib/services/door-category.service';
import { listLaminates } from '@/lib/services/laminate.service';

export const revalidate = 60;

export default async function Home() {
  const { items: categories } = await listDoorCategories({ page: 1, limit: 8 });
  const categoryIds = categories.map((category) => category._id.toString());

  const [showcaseDoors, { items: featuredDoors }, { items: featuredLaminates }] = await Promise.all(
    [
      getFeaturedDoorsByCategory(categoryIds),
      listDoors({
        page: 1,
        limit: 8,
        isActive: true,
        sortBy: 'createdAt',
        sortOrder: 'desc',
      }),
      listLaminates({
        page: 1,
        limit: 10,
        isActive: true,
        sortBy: 'createdAt',
        sortOrder: 'desc',
      }),
    ],
  );

  const showcaseByCategory = new Map(
    showcaseDoors.map((door) => [door.categoryId.toString(), door]),
  );

  const categoryShowcases = categories.map((category) => {
    const door = showcaseByCategory.get(category._id.toString());
    const image = door ? (door.images.find((item) => item.isPrimary) ?? door.images[0]) : undefined;
    return { slug: category.slug, name: category.name, image };
  });

  const categoryNames = Object.fromEntries(
    categories.map((category) => [category._id.toString(), category.name]),
  );

  return (
    <HomeView
      categories={categoryShowcases}
      featuredDoors={featuredDoors}
      categoryNames={categoryNames}
      featuredLaminates={featuredLaminates}
      bannerDoor={showcaseDoors[0]}
    />
  );
}
