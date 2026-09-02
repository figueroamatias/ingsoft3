import { AppError } from "../../errors/app-error.js";
import * as categoryRepository from "../categories/category.repository.js";
import * as movementRepository from "./movement.repository.js";

// Límites del modelo: description es VARCHAR(160) y amount es NUMERIC(12,2),
// es decir 10 dígitos enteros y 2 decimales.
const DESCRIPTION_MAX_LENGTH = 160;
const AMOUNT_MAX = 9999999999.99;

function parseDescription(description) {
  if (typeof description !== "string") {
    throw new AppError("La descripción es obligatoria.", 400);
  }

  // El Service normaliza por su cuenta para no depender de que el DTO
  // haya recortado los espacios antes de llamarlo.
  const normalizedDescription = description.trim();

  if (normalizedDescription === "") {
    throw new AppError("La descripción es obligatoria.", 400);
  }

  if (normalizedDescription.length > DESCRIPTION_MAX_LENGTH) {
    throw new AppError(
      `La descripción no puede superar los ${DESCRIPTION_MAX_LENGTH} caracteres.`,
      400,
    );
  }

  return normalizedDescription;
}

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

  // PostgreSQL redondea a dos decimales antes de comprobar la precisión,
  // así que el rango se valida sobre el valor que realmente se almacenaría.
  const storedAmount = Math.round(numericAmount * 100) / 100;

  if (storedAmount > AMOUNT_MAX) {
    throw new AppError(`El importe no puede superar ${AMOUNT_MAX}.`, 400);
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

export async function getAllMovements(userId) {
  return movementRepository.findAllByUser(userId);
}

export async function getFinancialSummary(userId) {
  const summary = await movementRepository.summarizeByUser(userId);
  const totalIncome = Number(summary.total_income);
  const totalExpense = Number(summary.total_expense);

  return {
    totalIncome,
    totalExpense,
    balance: Math.round((totalIncome - totalExpense) * 100) / 100,
  };
}

export async function createMovement(userId, data) {
  const description = parseDescription(data.description);
  const amount = parseAmount(data.amount);
  validateDate(data.date);
  const categoryId = parseCategoryId(data.categoryId);

  const category = await categoryRepository.findByIdForUser(categoryId, userId);

  if (!category) {
    throw new AppError("La categoría seleccionada no existe.", 404);
  }

  return movementRepository.create({
    userId,
    description,
    amount,
    date: data.date,
    categoryId,
  });
}
