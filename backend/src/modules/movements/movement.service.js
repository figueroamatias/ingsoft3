import { AppError } from "../../errors/app-error.js";
import * as categoryRepository from "../categories/category.repository.js";
import * as movementRepository from "./movement.repository.js";

function parseAmount(amount) {
  const isSupportedType =
    typeof amount === "number" || typeof amount === "string";

  if (!isSupportedType || String(amount).trim() === "") {
    throw new AppError("El importe debe ser numérico.", 400);
  }

  const numericAmount = Number(amount);

  if (!Number.isFinite(numericAmount)) {
    throw new AppError("El importe debe ser un número finito.", 400);
  }

  if (numericAmount <= 0) {
    throw new AppError("El importe debe ser mayor que cero.", 400);
  }

  return numericAmount;
}

function validateDate(date) {
  if (typeof date !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    throw new AppError("La fecha debe tener formato YYYY-MM-DD.", 400);
  }

  const [year, month, day] = date.split("-").map(Number);
  const parsedDate = new Date(Date.UTC(year, month - 1, day));
  const isValidDate =
    parsedDate.getUTCFullYear() === year &&
    parsedDate.getUTCMonth() === month - 1 &&
    parsedDate.getUTCDate() === day;

  if (!isValidDate) {
    throw new AppError("La fecha indicada no es válida.", 400);
  }
}

function parseCategoryId(categoryId) {
  const isSupportedType =
    typeof categoryId === "number" || typeof categoryId === "string";

  if (!isSupportedType || String(categoryId).trim() === "") {
    throw new AppError("La categoría es obligatoria.", 400);
  }

  const numericCategoryId = Number(categoryId);

  if (!Number.isInteger(numericCategoryId) || numericCategoryId <= 0) {
    throw new AppError("La categoría seleccionada no es válida.", 400);
  }

  return numericCategoryId;
}

export async function getAllMovements() {
  return movementRepository.findAll();
}

export async function createMovement(data) {
  if (typeof data.description !== "string" || data.description === "") {
    throw new AppError("La descripción es obligatoria.", 400);
  }

  const amount = parseAmount(data.amount);
  validateDate(data.date);
  const categoryId = parseCategoryId(data.categoryId);

  const category = await categoryRepository.findById(categoryId);

  if (!category) {
    throw new AppError("La categoría seleccionada no existe.", 404);
  }

  return movementRepository.create({
    description: data.description,
    amount,
    date: data.date,
    categoryId,
  });
}
