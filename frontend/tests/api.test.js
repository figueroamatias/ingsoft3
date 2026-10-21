import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  createCategory,
  createMovement,
  deleteMovement,
  getCategories,
  getFinancialSummary,
  getMovements,
} from "../src/services/api.js";

function jsonResponse(data, { ok = true } = {}) {
  return {
    ok,
    json: vi.fn().mockResolvedValue(data),
  };
}

describe("API client", () => {
  beforeEach(() => {
    // Arrange: fetch es la dependencia HTTP real reemplazada por un mock.
    vi.stubGlobal("fetch", vi.fn());
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it.each([
    ["categorías", getCategories, "/api/categories"],
    ["movimientos", getMovements, "/api/movements"],
    ["resumen", getFinancialSummary, "/api/movements/summary"],
  ])("consulta %s mediante su endpoint", async (_name, operation, url) => {
    // Arrange
    const payload = [{ id: 1 }];
    fetch.mockResolvedValue(jsonResponse(payload));

    // Act
    const result = await operation();

    // Assert
    expect(fetch).toHaveBeenCalledWith(url, undefined);
    expect(result).toEqual(payload);
  });

  it.each([
    [
      "una categoría",
      createCategory,
      "/api/categories",
      { name: "Ahorro", type: "income" },
    ],
    [
      "un movimiento",
      createMovement,
      "/api/movements",
      { description: "Compra", amount: 20, date: "2026-10-09", categoryId: 3 },
    ],
  ])("envía %s como JSON", async (_name, operation, url, input) => {
    // Arrange
    fetch.mockResolvedValue(jsonResponse({ id: 9, ...input }));

    // Act
    await operation(input);

    // Assert
    expect(fetch).toHaveBeenCalledWith(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(input),
    });
  });

  it("propaga el mensaje de error entregado por la API", async () => {
    // Arrange
    fetch.mockResolvedValue(
      jsonResponse({ error: "Ya existe una categoría con ese nombre." }, { ok: false }),
    );

    // Act y Assert
    await expect(getCategories()).rejects.toThrow(
      "Ya existe una categoría con ese nombre.",
    );
  });

  it("utiliza un mensaje seguro cuando el error no contiene JSON", async () => {
    // Arrange
    fetch.mockResolvedValue({
      ok: false,
      json: vi.fn().mockRejectedValue(new SyntaxError("invalid json")),
    });

    // Act y Assert
    await expect(getMovements()).rejects.toThrow(
      "No se pudo completar la solicitud.",
    );
  });

  it("elimina un movimiento mediante DELETE", async () => {
    fetch.mockResolvedValue(jsonResponse(null));

    await deleteMovement(9);

    expect(fetch).toHaveBeenCalledWith("/api/movements/9", { method: "DELETE" });
  });
});
