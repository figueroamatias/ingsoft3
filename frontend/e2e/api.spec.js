import { expect, test } from "@playwright/test";

const API = (process.env.API_BASE_URL || "http://localhost:3000").replace(/\/$/, "");

async function movements(request) {
  const response = await request.get(`${API}/api/movements`);
  expect(response.status()).toBe(200);
  return response.json();
}

async function expenseCategoryId(request) {
  const response = await request.get(`${API}/api/categories`);
  expect(response.status()).toBe(200);
  const categories = await response.json();
  const category = categories.find((item) => item.type === "expense");
  expect(category).toBeTruthy();
  return category.id;
}

test("las categorías de QA son reales y tienen la estructura esperada", async ({ request }) => {
  const response = await request.get(`${API}/api/categories`);
  expect(response.status()).toBe(200);
  const categories = await response.json();

  expect(categories.length).toBeGreaterThan(0);
  expect(categories).toEqual(expect.arrayContaining([
    expect.objectContaining({ id: expect.any(Number), name: expect.any(String), type: expect.stringMatching(/^(income|expense)$/) }),
  ]));
});

test("crear un movimiento se persiste en QA y se elimina al finalizar", async ({ request }) => {
  const description = `TP7 API ${Date.now()}`;
  const categoryId = await expenseCategoryId(request);
  let id;

  try {
    const created = await request.post(`${API}/api/movements`, {
      data: { description, amount: 123.45, date: "2026-10-21", categoryId },
    });
    expect(created.status()).toBe(201);
    const movement = await created.json();
    id = movement.id;

    expect((await movements(request)).some((item) => item.id === id && item.description === description)).toBe(true);
  } finally {
    if (id) {
      const deleted = await request.delete(`${API}/api/movements/${id}`);
      expect(deleted.status()).toBe(204);
      expect((await movements(request)).some((item) => item.id === id)).toBe(false);
    }
  }
});

test("QA rechaza una descripción vacía y no persiste un movimiento", async ({ request }) => {
  const before = await movements(request);
  const categoryId = await expenseCategoryId(request);
  const response = await request.post(`${API}/api/movements`, {
    data: { description: "   ", amount: 1, date: "2026-10-21", categoryId },
  });

  expect(response.status()).toBe(400);
  const after = await movements(request);
  expect(after.length).toBe(before.length);
});
