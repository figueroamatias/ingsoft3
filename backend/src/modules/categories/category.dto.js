export function toCategoryDto(category) {
  return {
    id: Number(category.id),
    name: category.name,
    type: category.type,
  };
}
