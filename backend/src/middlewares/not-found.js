import { AppError } from "../errors/app-error.js";

export function notFound(request, _response, next) {
  next(new AppError(`Ruta no encontrada: ${request.method} ${request.originalUrl}`, 404));
}
