import { describe, expect, it, vi } from "vitest";
import { AppError } from "../src/errors/app-error.js";
import { errorHandler } from "../src/middlewares/error-handler.js";
import { notFound } from "../src/middlewares/not-found.js";
import {
  createCategoryDto,
  toCategoryDto,
} from "../src/modules/categories/category.dto.js";
import {
  createMovementDto,
  toFinancialSummaryDto,
  toMovementDto,
} from "../src/modules/movements/movement.dto.js";

function createResponse() {
  const response = {
    json: vi.fn(),
    status: vi.fn(),
  };
  response.status.mockReturnValue(response);
  return response;
}

describe("DTOs", () => {
  it("normaliza la entrada y la salida de categorías", () => {
    // Arrange y Act
    const input = createCategoryDto({ name: "  Trabajo   extra ", type: "income" });
    const output = toCategoryDto({ id: "7", name: input.name, type: input.type });

    // Assert
    expect(input).toEqual({ name: "Trabajo extra", type: "income" });
    expect(output).toEqual({ id: 7, name: "Trabajo extra", type: "income" });
  });

  it("tolera un body ausente al construir entradas", () => {
    // Act y Assert
    expect(createCategoryDto()).toEqual({ name: undefined, type: undefined });
    expect(createMovementDto()).toEqual({
      description: undefined,
      amount: undefined,
      date: undefined,
      categoryId: undefined,
    });
  });

  it("convierte los valores numéricos de un movimiento para la respuesta HTTP", () => {
    // Arrange
    const movement = {
      id: "5",
      description: "Sueldo",
      amount: "1500.25",
      date: "2026-10-09",
      category_id: "1",
      category_name: "Sueldo",
      category_type: "income",
    };

    // Act y Assert
    expect(toMovementDto(movement)).toEqual({
      id: 5,
      description: "Sueldo",
      amount: 1500.25,
      date: "2026-10-09",
      category: { id: 1, name: "Sueldo", type: "income" },
    });
  });

  it("convierte el resumen financiero a números", () => {
    // Act y Assert
    expect(
      toFinancialSummaryDto({
        totalIncome: "100",
        totalExpense: "25.50",
        balance: "74.50",
      }),
    ).toEqual({ totalIncome: 100, totalExpense: 25.5, balance: 74.5 });
  });
});

describe("HTTP error middlewares", () => {
  it("responde el estado y mensaje de un AppError", () => {
    // Arrange
    const response = createResponse();

    // Act
    errorHandler(new AppError("Dato inválido", 400), {}, response, vi.fn());

    // Assert
    expect(response.status).toHaveBeenCalledWith(400);
    expect(response.json).toHaveBeenCalledWith({ error: "Dato inválido" });
  });

  it("preserva un error HTTP 4xx generado por Express", () => {
    // Arrange
    const response = createResponse();

    // Act
    errorHandler({ status: 413 }, {}, response, vi.fn());

    // Assert
    expect(response.status).toHaveBeenCalledWith(413);
    expect(response.json).toHaveBeenCalledWith({
      error: "La solicitud recibida no es válida.",
    });
  });

  it("oculta los detalles de un error inesperado", () => {
    // Arrange
    const response = createResponse();
    const consoleError = vi.spyOn(console, "error").mockImplementation(() => {});

    // Act
    errorHandler(new Error("secreto interno"), {}, response, vi.fn());

    // Assert
    expect(response.status).toHaveBeenCalledWith(500);
    expect(response.json).toHaveBeenCalledWith({ error: "Ocurrió un error interno." });
    consoleError.mockRestore();
  });

  it("convierte una ruta desconocida en un AppError 404", () => {
    // Arrange
    const next = vi.fn();

    // Act
    notFound({ method: "GET", originalUrl: "/missing" }, {}, next);

    // Assert
    expect(next).toHaveBeenCalledWith(
      expect.objectContaining({
        message: "Ruta no encontrada: GET /missing",
        statusCode: 404,
      }),
    );
  });
});
