export class ApiError extends Error {
  constructor(message, status) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}

async function request(url, options = {}) {
  const response = await fetch(url, {
    ...options,
    credentials: "include",
  });
  const data = await response.json().catch(() => null);

  if (!response.ok) {
    if (response.status === 401) {
      window.dispatchEvent(new Event("auth:unauthorized"));
    }

    throw new ApiError(
      data?.error ?? "No se pudo completar la solicitud.",
      response.status,
    );
  }

  return data;
}

function sendCredentials(url, credentials) {
  return request(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(credentials),
  });
}

export function register(credentials) {
  return sendCredentials("/api/auth/register", credentials);
}

export function login(credentials) {
  return sendCredentials("/api/auth/login", credentials);
}

export function logout() {
  return request("/api/auth/logout", { method: "POST" });
}

export function getCurrentUser() {
  return request("/api/auth/me");
}

export function getCategories() {
  return request("/api/categories");
}

export function createCategory(category) {
  return request("/api/categories", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(category),
  });
}

export function getMovements() {
  return request("/api/movements");
}

export function getFinancialSummary() {
  return request("/api/movements/summary");
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
