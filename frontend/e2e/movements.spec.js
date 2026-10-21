import { expect, test } from "@playwright/test";

async function createMovement(page, description, amount = "123.45") {
  await page.getByLabel("Descripción").fill(description);
  await page.getByLabel("Importe").fill(amount);
  await page.getByRole("button", { name: "Registrar movimiento" }).click();
}

test("un usuario crea un movimiento y lo elimina desde la lista", async ({ page }) => {
  const description = `TP7 E2E ${Date.now()}`;
  await page.goto("/");

  await createMovement(page, description);
  await expect(page.getByText(description)).toBeVisible();
  await page.getByRole("button", { name: `Eliminar ${description}` }).click();
  await expect(page.getByText(description)).toHaveCount(0);
});

test("una descripción formada sólo por espacios muestra el error de validación", async ({ page }) => {
  await page.goto("/");

  await createMovement(page, "   ", "1");
  await expect(page.getByText("La descripción es obligatoria.")).toBeVisible();
});

test("el resumen se actualiza con el movimiento propio y vuelve al eliminarlo", async ({ page }) => {
  const description = `TP7 resumen ${Date.now()}`;
  await page.goto("/");
  const summary = page.getByLabel("Resumen financiero");
  const before = await summary.textContent();

  await createMovement(page, description, "77.77");
  await expect(page.getByText(description)).toBeVisible();
  await expect(summary).not.toHaveText(before ?? "");

  await page.getByRole("button", { name: `Eliminar ${description}` }).click();
  await expect(page.getByText(description)).toHaveCount(0);
  await expect(summary).toHaveText(before ?? "");
});
