import { AUTH_COOKIE_NAME, getAuthCookieOptions } from "../../config/auth.js";
import { createCredentialsDto, toPublicUserDto } from "./auth.dto.js";
import * as authService from "./auth.service.js";

function setSessionCookie(response, token) {
  response.cookie(AUTH_COOKIE_NAME, token, getAuthCookieOptions());
}

export async function register(request, response, next) {
  try {
    const credentials = createCredentialsDto(request.body);
    const { user, token } = await authService.register(credentials);
    setSessionCookie(response, token);
    response.status(201).json(toPublicUserDto(user));
  } catch (error) {
    next(error);
  }
}

export async function login(request, response, next) {
  try {
    const credentials = createCredentialsDto(request.body);
    const { user, token } = await authService.login(credentials);
    setSessionCookie(response, token);
    response.json(toPublicUserDto(user));
  } catch (error) {
    next(error);
  }
}

export function logout(_request, response) {
  const { maxAge: _maxAge, ...cookieOptions } = getAuthCookieOptions();
  response.clearCookie(AUTH_COOKIE_NAME, cookieOptions);
  response.status(204).send();
}

export function me(request, response) {
  response.json(toPublicUserDto(request.user));
}
