import { beforeEach, describe, expect, it, vi } from "vitest";
import { createCategoryService } from "../src/modules/categories/category.service.js";

describe("category service", () => {
  let repository;
  let service;

  beforeEach(() => {
    // Arrange: el repositorio real se reemplaza por una dependencia controlable.
    repository = {
      create: vi.fn(),
      findAll: vi.fn(),
      findByName: vi.fn(),
    };
    service = createCategoryService({ categoryRepository: repository });
  });

  it.each([undefined, null, "", "   "])(
    "rechaza el nombre obligatorio cuando recibe %j",
    async (name) => {
      // Act y Assert
      await expect(
        service.createCategory({ name, type: "expense" }),
      ).rejects.toMatchObject({
        message: "El nombre de la categoría es obligatorio.",
        statusCode: 400,
      });
      expect(repository.findByName).not.toHaveBeenCalled();
    },
  );

  it("rechaza nombres que superan los 80 caracteres", async () => {
    // Arrange
    const name = "a".repeat(81);

    // Act y Assert
    await expect(
      service.createCategory({ name, type: "expense" }),
    ).rejects.toMatchObject({ statusCode: 400 });
  });

  it.each(["saving", "", undefined])(
    "rechaza el tipo de categoría no permitido %j",
    async (type) => {
      // Act y Assert
      await expect(
        service.createCategory({ name: "Ahorro", type }),
      ).rejects.toMatchObject({
        message: "El tipo debe ser income o expense.",
        statusCode: 400,
      });
    },
  );

  it("rechaza una categoría cuyo nombre ya existe", async () => {
    // Arrange
    repository.findByName.mockResolvedValue({ id: 1, name: "Ocio" });

    // Act y Assert
    await expect(
      service.createCategory({ name: "Ocio", type: "expense" }),
    ).rejects.toMatchObject({
      message: "Ya existe una categoría con ese nombre.",
      statusCode: 409,
    });
    expect(repository.create).not.toHaveBeenCalled();
  });

  it("traduce la restricción única de PostgreSQL en un conflicto", async () => {
    // Arrange
    repository.findByName.mockResolvedValue(null);
    repository.create.mockRejectedValue({ code: "23505" });

    // Act y Assert
    await expect(
      service.createCategory({ name: "Ocio", type: "expense" }),
    ).rejects.toMatchObject({ statusCode: 409 });
  });

  it("propaga errores inesperados del repositorio", async () => {
    // Arrange
    const databaseError = new Error("database unavailable");
    repository.findByName.mockResolvedValue(null);
    repository.create.mockRejectedValue(databaseError);

    // Act y Assert
    await expect(
      service.createCategory({ name: "Ocio", type: "expense" }),
    ).rejects.toBe(databaseError);
  });

  it("normaliza el nombre y crea una categoría válida usando el repositorio", async () => {
    // Arrange
    const createdCategory = { id: 7, name: "Trabajo extra", type: "income" };
    repository.findByName.mockResolvedValue(null);
    repository.create.mockResolvedValue(createdCategory);

    // Act
    const result = await service.createCategory({
      name: "  Trabajo   extra  ",
      type: "income",
    });

    // Assert
    expect(repository.findByName).toHaveBeenCalledWith("Trabajo extra");
    expect(repository.create).toHaveBeenCalledWith({
      name: "Trabajo extra",
      type: "income",
    });
    expect(result).toBe(createdCategory);
  });

  it("delega el listado de categorías al repositorio", async () => {
    // Arrange
    const categories = [{ id: 1, name: "Sueldo", type: "income" }];
    repository.findAll.mockResolvedValue(categories);

    // Act
    const result = await service.getAllCategories();

    // Assert
    expect(result).toBe(categories);
    expect(repository.findAll).toHaveBeenCalledOnce();
  });
});
