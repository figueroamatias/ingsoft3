import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { AUTH_TOKEN_DURATION_SECONDS, getJwtSecret } from "../../config/auth.js";
import { AppError } from "../../errors/app-error.js";
import * as authRepository from "./auth.repository.js";

const EMAIL_MAX_LENGTH = 254;
const PASSWORD_MIN_LENGTH = 8;
const PASSWORD_MAX_LENGTH = 72;
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const INITIAL_CATEGORIES = [
  { name: "Sueldo", type: "income" },
  { name: "Otros ingresos", type: "income" },
  { name: "Alimentación", type: "expense" },
  { name: "Transporte", type: "expense" },
  { name: "Servicios", type: "expense" },
  { name: "Ocio", type: "expense" },
];

function parseEmail(email) {
  if (typeof email !== "string") {
    throw new AppError("El email es obligatorio.", 400);
  }

  const normalizedEmail = email.trim().toLowerCase();

  if (
    normalizedEmail.length === 0 ||
    normalizedEmail.length > EMAIL_MAX_LENGTH ||
    !EMAIL_PATTERN.test(normalizedEmail)
  ) {
    throw new AppError("El email no es válido.", 400);
  }

  return normalizedEmail;
}

function parsePassword(password) {
  if (typeof password !== "string") {
    throw new AppError("La contraseña es obligatoria.", 400);
  }

  if (
    password.length < PASSWORD_MIN_LENGTH ||
    password.length > PASSWORD_MAX_LENGTH
  ) {
    throw new AppError(
      `La contraseña debe tener entre ${PASSWORD_MIN_LENGTH} y ${PASSWORD_MAX_LENGTH} caracteres.`,
      400,
    );
  }

  return password;
}

function createToken(user) {
  return jwt.sign({}, getJwtSecret(), {
    subject: String(user.id),
    expiresIn: AUTH_TOKEN_DURATION_SECONDS,
  });
}

export async function register(data) {
  const email = parseEmail(data.email);
  const password = parsePassword(data.password);
  const existingUser = await authRepository.findByEmail(email);

  if (existingUser) {
    throw new AppError("Ya existe una cuenta con ese email.", 409);
  }

  const passwordHash = await bcrypt.hash(password, 12);

  try {
    const user = await authRepository.createWithCategories({
      email,
      passwordHash,
      categories: INITIAL_CATEGORIES,
    });

    return { user, token: createToken(user) };
  } catch (error) {
    if (error?.code === "23505") {
      throw new AppError("Ya existe una cuenta con ese email.", 409);
    }

    throw error;
  }
}

export async function login(data) {
  const email = parseEmail(data.email);

  if (typeof data.password !== "string" || data.password.length === 0) {
    throw new AppError("Email o contraseña incorrectos.", 401);
  }

  const user = await authRepository.findByEmail(email);
  const passwordMatches = user
    ? await bcrypt.compare(data.password, user.password_hash)
    : false;

  if (!user || !passwordMatches) {
    throw new AppError("Email o contraseña incorrectos.", 401);
  }

  return { user, token: createToken(user) };
}
