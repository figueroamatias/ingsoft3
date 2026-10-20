import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

const api = vi.hoisted(() => ({
  createCategory: vi.fn(),
  createMovement: vi.fn(),
  getCategories: vi.fn(),
  getFinancialSummary: vi.fn(),
  getMovements: vi.fn(),
}));

vi.mock("../src/services/api.js", () => api);

import { MovementsPage } from "../src/pages/MovementsPage.jsx";

const category = { id: 3, name: "Alimentación", type: "expense" };
const movement = {
  id: 1,
  description: "Compra inicial",
  amount: 40,
  date: "2026-10-08",
  category,
};

describe("MovementsPage", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    api.getCategories.mockResolvedValue([category]);
    api.getMovements.mockResolvedValue([movement]);
    api.getFinancialSummary.mockResolvedValue({
      totalIncome: 0,
      totalExpense: 40,
      balance: -40,
    });
  });

  it("carga categorías, movimientos y resumen mediante el cliente API simulado", async () => {
    // Act
    render(<MovementsPage />);

    // Assert
    expect(screen.getByText("TP6 · Continuous Delivery")).toBeInTheDocument();
    expect(await screen.findByText("Compra inicial")).toBeInTheDocument();
    expect(screen.getByRole("option", { name: /Alimentación/ })).toBeInTheDocument();
    expect(screen.getByText("1")).toBeInTheDocument();
    expect(api.getCategories).toHaveBeenCalledOnce();
    expect(api.getMovements).toHaveBeenCalledOnce();
    expect(api.getFinancialSummary).toHaveBeenCalledOnce();
  });

  it("muestra los errores independientes de las cargas iniciales", async () => {
    // Arrange
    api.getCategories.mockRejectedValue(new Error("categorías caídas"));
    api.getMovements.mockRejectedValue(new Error("movimientos caídos"));
    api.getFinancialSummary.mockRejectedValue(new Error("resumen caído"));

    // Act
    render(<MovementsPage />);

    // Assert
    expect(
      await screen.findByText(/No se pudieron cargar las categorías: categorías caídas/),
    ).toBeInTheDocument();
    expect(screen.getByText("movimientos caídos")).toBeInTheDocument();
    expect(
      screen.getByText(/No se pudo cargar el resumen: resumen caído/),
    ).toBeInTheDocument();
  });

  it("agrega una categoría creada al selector de movimientos", async () => {
    // Arrange
    const user = userEvent.setup();
    api.createCategory.mockResolvedValue({ id: 7, name: "Ahorro", type: "income" });
    render(<MovementsPage />);
    await screen.findByText("Compra inicial");

    // Act
    await user.type(screen.getByLabelText("Nombre"), "Ahorro");
    await user.selectOptions(screen.getByLabelText("Tipo"), "income");
    await user.click(screen.getByRole("button", { name: "Crear categoría" }));

    // Assert
    expect(api.createCategory).toHaveBeenCalledWith({
      name: "Ahorro",
      type: "income",
    });
    expect(
      await screen.findByRole("option", { name: /Ahorro \(ingreso\)/ }),
    ).toBeInTheDocument();
  });

  it("agrega un movimiento y actualiza el resumen", async () => {
    // Arrange
    const user = userEvent.setup();
    const createdMovement = {
      id: 2,
      description: "Nueva compra",
      amount: 25,
      date: "2026-10-09",
      category,
    };
    api.createMovement.mockResolvedValue(createdMovement);
    render(<MovementsPage />);
    await screen.findByText("Compra inicial");
    await waitFor(() =>
      expect(screen.getByLabelText("Categoría")).toHaveValue("3"),
    );

    // Act
    await user.type(screen.getByLabelText("Descripción"), "Nueva compra");
    await user.type(screen.getByLabelText("Importe"), "25");
    fireEvent.change(screen.getByLabelText("Fecha"), {
      target: { value: "2026-10-09" },
    });
    fireEvent.submit(
      screen.getByRole("button", { name: "Registrar movimiento" }).closest("form"),
    );

    // Assert
    expect(await screen.findByText("Nueva compra")).toBeInTheDocument();
    await waitFor(() => expect(api.getFinancialSummary).toHaveBeenCalledTimes(2));
  });

  it("informa errores al crear categorías y movimientos", async () => {
    // Arrange
    const user = userEvent.setup();
    api.createCategory.mockRejectedValue(new Error("categoría duplicada"));
    api.createMovement.mockRejectedValue(new Error("movimiento inválido"));
    render(<MovementsPage />);
    await screen.findByText("Compra inicial");
    await waitFor(() =>
      expect(screen.getByLabelText("Categoría")).toHaveValue("3"),
    );

    // Act
    await user.type(screen.getByLabelText("Nombre"), "Alimentación");
    await user.click(screen.getByRole("button", { name: "Crear categoría" }));
    await user.type(screen.getByLabelText("Descripción"), "Compra");
    await user.type(screen.getByLabelText("Importe"), "10");
    fireEvent.submit(
      screen.getByRole("button", { name: "Registrar movimiento" }).closest("form"),
    );

    // Assert
    expect(await screen.findByText("categoría duplicada")).toBeInTheDocument();
    expect(await screen.findByText("movimiento inválido")).toBeInTheDocument();
  });
});
