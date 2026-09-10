import {
  LaminateCategory,
  type LaminateCategoryDocument,
} from '@/lib/db/models/LaminateCategory.model';
import { createCategoryService } from '@/lib/services/category.service';

export const {
  listCategories: listLaminateCategories,
  getCategoryById: getLaminateCategoryById,
  createCategory: createLaminateCategory,
  updateCategory: updateLaminateCategory,
  archiveCategory: archiveLaminateCategory,
} = createCategoryService<LaminateCategoryDocument>(LaminateCategory);
