import { beforeEach, describe, expect, it, vi } from "vitest";
import { createMovementService } from "../src/modules/movements/movement.service.js";

describe("movement service", () => {
  let categoryRepository;
  let movementRepository;
  let service;

  const validMovement = {
    description: "Compra semanal",
    amount: "125.50",
    date: "2026-10-09",
    categoryId: "3",
  };

  beforeEach(() => {
    // Arrange: ambos adaptadores de persistencia se reemplazan con mocks.
    categoryRepository = { findById: vi.fn() };
    movementRepository = {
      create: vi.fn(),
      findAll: vi.fn(),
      summarizeByType: vi.fn(),
    };
    service = createMovementService({
      categoryRepository,
      movementRepository,
    });
  });

  it.each([
    [undefined, "El importe debe ser numérico."],
    ["", "El importe debe ser numérico."],
    ["abc", "El importe debe ser un número finito."],
    [Number.POSITIVE_INFINITY, "El importe debe ser un número finito."],
    [0, "El importe debe ser mayor que cero."],
    [-1, "El importe debe ser mayor que cero."],
    [10000000000, "El importe no puede superar 9999999999.99."],
  ])("rechaza el importe inválido %j", async (amount, message) => {
    // Act y Assert
    await expect(
      service.createMovement({ ...validMovement, amount }),
    ).rejects.toMatchObject({ message, statusCode: 400 });
    expect(categoryRepository.findById).not.toHaveBeenCalled();
  });

  it.each([undefined, "", "   "])(
    "rechaza la descripción obligatoria cuando recibe %j",
    async (description) => {
      // Act y Assert
      await expect(
        service.createMovement({ ...validMovement, description }),
      ).rejects.toMatchObject({ statusCode: 400 });
    },
  );

  it("rechaza una descripción que supera los 160 caracteres", async () => {
    // Arrange
    const description = "a".repeat(161);

    // Act y Assert
    await expect(
      service.createMovement({ ...validMovement, description }),
    ).rejects.toMatchObject({ statusCode: 400 });
  });

  it.each([
    ["09-10-2026", "La fecha debe tener formato YYYY-MM-DD."],
    ["2026-02-30", "La fecha indicada no es válida."],
  ])("rechaza la fecha inválida %s", async (date, message) => {
    // Act y Assert
    await expect(
      service.createMovement({ ...validMovement, date }),
    ).rejects.toMatchObject({ message, statusCode: 400 });
  });

  it.each([undefined, "", 0, -1, 1.5, "abc"])(
    "rechaza el identificador de categoría inválido %j",
    async (categoryId) => {
      // Act y Assert
      await expect(
        service.createMovement({ ...validMovement, categoryId }),
      ).rejects.toMatchObject({ statusCode: 400 });
    },
  );

  it("rechaza una categoría que no existe", async () => {
    // Arrange
    categoryRepository.findById.mockResolvedValue(null);

    // Act y Assert
    await expect(service.createMovement(validMovement)).rejects.toMatchObject({
      message: "La categoría seleccionada no existe.",
      statusCode: 404,
    });
    expect(movementRepository.create).not.toHaveBeenCalled();
  });

  it("normaliza los datos y crea un movimiento válido", async () => {
    // Arrange
    const createdMovement = { id: 10, description: "Compra semanal" };
    categoryRepository.findById.mockResolvedValue({ id: 3 });
    movementRepository.create.mockResolvedValue(createdMovement);

    // Act
    const result = await service.createMovement({
      ...validMovement,
      description: "  Compra semanal  ",
    });

    // Assert
    expect(categoryRepository.findById).toHaveBeenCalledWith(3);
    expect(movementRepository.create).toHaveBeenCalledWith({
      description: "Compra semanal",
      amount: 125.5,
      date: "2026-10-09",
      categoryId: 3,
    });
    expect(result).toBe(createdMovement);
  });

  it("calcula el resumen y redondea el saldo a dos decimales", async () => {
    // Arrange
    movementRepository.summarizeByType.mockResolvedValue({
      total_income: "200.10",
      total_expense: "100.03",
    });

    // Act
    const result = await service.getFinancialSummary();

    // Assert
    expect(result).toEqual({
      totalIncome: 200.1,
      totalExpense: 100.03,
      balance: 100.07,
    });
  });

  it("delega el listado de movimientos al repositorio", async () => {
    // Arrange
    const movements = [{ id: 1, description: "Compra" }];
    movementRepository.findAll.mockResolvedValue(movements);

    // Act
    const result = await service.getAllMovements();

    // Assert
    expect(result).toBe(movements);
    expect(movementRepository.findAll).toHaveBeenCalledOnce();
  });
});
