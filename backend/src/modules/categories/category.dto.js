export function createCategoryDto(body) {
  const source = body ?? {};

  return {
    name:
      typeof source.name === "string"
        ? source.name.trim().replace(/\s+/g, " ")
        : source.name,
    type: source.type,
  };
}

export function toCategoryDto(category) {
  return {
    id: Number(category.id),
    name: category.name,
    type: category.type,
  };
}
