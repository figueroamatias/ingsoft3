import * as categoryRepository from "./category.repository.js";

export async function getAllCategories() {
  return categoryRepository.findAll();
}
