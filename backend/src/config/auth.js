import { AppError } from "../errors/app-error.js";

export const AUTH_COOKIE_NAME = "session";
export const AUTH_TOKEN_DURATION_SECONDS = 8 * 60 * 60;

export function getJwtSecret() {
  const secret = process.env.JWT_SECRET;

  if (typeof secret !== "string" || secret.length < 32) {
    throw new AppError("La autenticación no está configurada correctamente.", 500);
  }

  return secret;
}

export function getAuthCookieOptions() {
  return {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.COOKIE_SECURE === "true",
    maxAge: AUTH_TOKEN_DURATION_SECONDS * 1000,
    path: "/",
  };
}
