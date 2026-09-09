import { DoorCategory, type DoorCategoryDocument } from '@/lib/db/models/DoorCategory.model';
import { createCategoryService } from '@/lib/services/category.service';

export const {
  listCategories: listDoorCategories,
  getCategoryById: getDoorCategoryById,
  createCategory: createDoorCategory,
  updateCategory: updateDoorCategory,
  archiveCategory: archiveDoorCategory,
} = createCategoryService<DoorCategoryDocument>(DoorCategory);
