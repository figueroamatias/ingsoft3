import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { CategoryForm } from "../src/components/CategoryForm.jsx";
import { MovementForm } from "../src/components/MovementForm.jsx";

describe("MovementForm", () => {
  const categories = [
    { id: 3, name: "Alimentación", type: "expense" },
    { id: 1, name: "Sueldo", type: "income" },
  ];

  it("convierte el identificador y envía un movimiento válido", async () => {
    // Arrange
    const user = userEvent.setup();
    const onSubmit = vi.fn().mockResolvedValue(true);
    render(
      <MovementForm
        categories={categories}
        isSubmitting={false}
        onSubmit={onSubmit}
      />,
    );
    await waitFor(() =>
      expect(screen.getByLabelText("Categoría")).toHaveValue("3"),
    );

    // Act
    await user.type(screen.getByLabelText("Descripción"), "Compra semanal");
    await user.type(screen.getByLabelText("Importe"), "125.50");
    fireEvent.change(screen.getByLabelText("Fecha"), {
      target: { value: "2026-10-09" },
    });
    await user.selectOptions(screen.getByLabelText("Categoría"), "1");
    fireEvent.submit(
      screen.getByRole("button", { name: "Registrar movimiento" }).closest("form"),
    );

    // Assert
    expect(onSubmit).toHaveBeenCalledWith({
      description: "Compra semanal",
      amount: "125.5",
      date: "2026-10-09",
      categoryId: 1,
    });
    await waitFor(() =>
      expect(screen.getByLabelText("Descripción")).toHaveValue(""),
    );
  });

  it("conserva los datos cuando la creación falla", async () => {
    // Arrange
    const user = userEvent.setup();
    const onSubmit = vi.fn().mockResolvedValue(false);
    render(
      <MovementForm
        categories={categories}
        isSubmitting={false}
        onSubmit={onSubmit}
      />,
    );
    await waitFor(() =>
      expect(screen.getByLabelText("Categoría")).toHaveValue("3"),
    );

    // Act
    await user.type(screen.getByLabelText("Descripción"), "Compra");
    await user.type(screen.getByLabelText("Importe"), "20");
    fireEvent.submit(
      screen.getByRole("button", { name: "Registrar movimiento" }).closest("form"),
    );

    // Assert
    expect(screen.getByLabelText("Descripción")).toHaveValue("Compra");
    expect(screen.getByLabelText("Importe")).toHaveValue(20);
  });
});

describe("CategoryForm", () => {
  it("envía la categoría y limpia el nombre después del éxito", async () => {
    // Arrange
    const user = userEvent.setup();
    const onSubmit = vi.fn().mockResolvedValue(true);
    render(<CategoryForm isSubmitting={false} onSubmit={onSubmit} />);

    // Act
    await user.type(screen.getByLabelText("Nombre"), "Ahorro");
    await user.selectOptions(screen.getByLabelText("Tipo"), "income");
    await user.click(screen.getByRole("button", { name: "Crear categoría" }));

    // Assert
    expect(onSubmit).toHaveBeenCalledWith({ name: "Ahorro", type: "income" });
    await waitFor(() => expect(screen.getByLabelText("Nombre")).toHaveValue(""));
  });
});
