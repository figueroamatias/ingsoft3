import jwt from "jsonwebtoken";
import { AUTH_COOKIE_NAME, getJwtSecret } from "../config/auth.js";
import { AppError } from "../errors/app-error.js";
import * as authRepository from "../modules/auth/auth.repository.js";

export async function authenticate(request, _response, next) {
  try {
    const token = request.cookies?.[AUTH_COOKIE_NAME];

    if (!token) {
      throw new AppError("Debés iniciar sesión para continuar.", 401);
    }

    let payload;

    try {
      payload = jwt.verify(token, getJwtSecret());
    } catch {
      throw new AppError("La sesión no es válida o expiró.", 401);
    }

    const userId = Number(payload.sub);

    if (!Number.isInteger(userId) || userId <= 0) {
      throw new AppError("La sesión no es válida o expiró.", 401);
    }

    const user = await authRepository.findById(userId);

    if (!user) {
      throw new AppError("La sesión no es válida o expiró.", 401);
    }

    request.user = {
      id: Number(user.id),
      email: user.email,
      created_at: user.created_at,
    };
    next();
  } catch (error) {
    next(error);
  }
}
