export function createCredentialsDto(body) {
  const source = body ?? {};

  return {
    email:
      typeof source.email === "string"
        ? source.email.trim().toLowerCase()
        : source.email,
    password: source.password,
  };
}

export function toPublicUserDto(user) {
  return {
    id: Number(user.id),
    email: user.email,
    createdAt: user.created_at,
  };
}
