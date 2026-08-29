import { AppError } from "../errors/app-error.js";

export function errorHandler(error, _request, response, _next) {
  if (error instanceof AppError) {
    return response.status(error.statusCode).json({ error: error.message });
  }

  console.error(error);
  return response.status(500).json({ error: "Ocurrió un error interno." });
}
