export function createMovementDto(body) {
  return {
    description:
      typeof body.description === "string"
        ? body.description.trim()
        : body.description,
    amount: body.amount,
    date: body.date,
    categoryId: body.categoryId,
  };
}

export function toMovementDto(movement) {
  const date =
    movement.date instanceof Date
      ? movement.date.toISOString().slice(0, 10)
      : movement.date;

  return {
    id: Number(movement.id),
    description: movement.description,
    amount: Number(movement.amount),
    date,
    category: {
      id: Number(movement.category_id),
      name: movement.category_name,
      type: movement.category_type,
    },
  };
}
