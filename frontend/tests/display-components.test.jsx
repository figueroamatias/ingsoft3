import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { FinancialSummary } from "../src/components/FinancialSummary.jsx";
import { MovementList } from "../src/components/MovementList.jsx";

describe("FinancialSummary", () => {
  it("muestra el estado de carga antes de tener el resumen", () => {
    // Act
    render(
      <FinancialSummary
        isLoading
        summary={{ totalIncome: 0, totalExpense: 0, balance: 0 }}
      />,
    );

    // Assert
    expect(screen.getByText("Cargando resumen…")).toBeInTheDocument();
  });

  it.each([
    [-20, "amount-expense"],
    [20, "amount-income"],
    [0, "amount-income"],
  ])("clasifica el saldo %s con la clase %s", (balance, expectedClass) => {
    // Act
    render(
      <FinancialSummary
        isLoading={false}
        summary={{ totalIncome: 100, totalExpense: 80, balance }}
      />,
    );

    // Assert
    expect(screen.getByText("Saldo").nextElementSibling).toHaveClass(expectedClass);
  });
});

describe("MovementList", () => {
  it("informa cuando todavía no existen movimientos", () => {
    // Act
    render(<MovementList movements={[]} />);

    // Assert
    expect(
      screen.getByText("Todavía no hay movimientos registrados."),
    ).toBeInTheDocument();
  });

  it("muestra los datos y el tipo de un movimiento", () => {
    // Arrange
    const movements = [
      {
        id: 1,
        description: "Compra semanal",
        amount: 125.5,
        date: "2026-10-09",
        category: { id: 3, name: "Alimentación", type: "expense" },
      },
    ];

    // Act
    render(<MovementList movements={movements} />);

    // Assert
    expect(screen.getByText("Compra semanal")).toBeInTheDocument();
    expect(screen.getByText(/Alimentación · Gasto/)).toBeInTheDocument();
    expect(screen.getByText(/125,50/)).toHaveClass("amount-expense");
  });
});
