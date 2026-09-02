import { createCategoryDto, toCategoryDto } from "./category.dto.js";
import * as categoryService from "./category.service.js";

export async function getAll(_request, response, next) {
  try {
    const categories = await categoryService.getAllCategories();
    response.json(categories.map(toCategoryDto));
  } catch (error) {
    next(error);
  }
}

export async function create(request, response, next) {
  try {
    const input = createCategoryDto(request.body);
    const category = await categoryService.createCategory(input);
    response.status(201).json(toCategoryDto(category));
  } catch (error) {
    next(error);
  }
}
