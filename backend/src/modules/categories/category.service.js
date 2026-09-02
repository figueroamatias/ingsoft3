import { AppError } from "../../errors/app-error.js";
import * as categoryRepository from "./category.repository.js";

const NAME_MAX_LENGTH = 80;
const CATEGORY_TYPES = new Set(["income", "expense"]);

function parseName(name) {
  if (typeof name !== "string") {
    throw new AppError("El nombre de la categoría es obligatorio.", 400);
  }

  const normalizedName = name.trim().replace(/\s+/g, " ");

  if (normalizedName === "") {
    throw new AppError("El nombre de la categoría es obligatorio.", 400);
  }

  if (normalizedName.length > NAME_MAX_LENGTH) {
    throw new AppError(
      `El nombre de la categoría no puede superar los ${NAME_MAX_LENGTH} caracteres.`,
      400,
    );
  }

  return normalizedName;
}

function parseType(type) {
  if (!CATEGORY_TYPES.has(type)) {
    throw new AppError("El tipo debe ser income o expense.", 400);
  }

  return type;
}

export async function getAllCategories(userId) {
  return categoryRepository.findAllByUser(userId);
}

export async function createCategory(userId, data) {
  const name = parseName(data.name);
  const type = parseType(data.type);
  const existingCategory = await categoryRepository.findByNameForUser(name, userId);

  if (existingCategory) {
    throw new AppError("Ya existe una categoría con ese nombre.", 409);
  }

  try {
    return await categoryRepository.create({ userId, name, type });
  } catch (error) {
    if (error?.code === "23505") {
      throw new AppError("Ya existe una categoría con ese nombre.", 409);
    }

    throw error;
  }
}
