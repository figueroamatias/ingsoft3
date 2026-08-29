async function request(url, options) {
  const response = await fetch(url, options);
  const data = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(data?.error ?? "No se pudo completar la solicitud.");
  }

  return data;
}

export function getCategories() {
  return request("/api/categories");
}

export function getMovements() {
  return request("/api/movements");
}

export function createMovement(movement) {
  return request("/api/movements", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(movement),
  });
}
