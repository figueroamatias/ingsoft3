import { AppError } from "../errors/app-error.js";

// Express y sus middlewares (por ejemplo express.json) señalan los errores de
// request malformado con un status HTTP propio. Se respeta sólo si es un 4xx
// válido; cualquier otro valor se trata como error inesperado.
function getClientErrorStatus(error) {
  const status = error?.status ?? error?.statusCode;

  if (!Number.isInteger(status) || status < 400 || status > 499) {
    return null;
  }

  return status;
}

export function errorHandler(error, _request, response, _next) {
  if (error instanceof AppError) {
    return response.status(error.statusCode).json({ error: error.message });
  }

  const clientErrorStatus = getClientErrorStatus(error);

  if (clientErrorStatus !== null) {
    return response
      .status(clientErrorStatus)
      .json({ error: "La solicitud recibida no es válida." });
  }

  console.error(error);
  return response.status(500).json({ error: "Ocurrió un error interno." });
}
