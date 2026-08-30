import { toCategoryDto } from "./category.dto.js";
import * as categoryService from "./category.service.js";

export async function getAll(_request, response, next) {
  try {
    const categories = await categoryService.getAllCategories();
    response.json(categories.map(toCategoryDto));
  } catch (error) {
    next(error);
  }
}
