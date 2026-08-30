export function createMovementDto(body) {
  // Express 5 deja req.body sin definir cuando no hay JSON que parsear.
  const source = body ?? {};

  return {
    description:
      typeof source.description === "string"
        ? source.description.trim()
        : source.description,
    amount: source.amount,
    date: source.date,
    categoryId: source.categoryId,
  };
}

export function toMovementDto(movement) {
  return {
    id: Number(movement.id),
    description: movement.description,
    amount: Number(movement.amount),
    // El Repository ya entrega la fecha como texto YYYY-MM-DD.
    date: movement.date,
    category: {
      id: Number(movement.category_id),
      name: movement.category_name,
      type: movement.category_type,
    },
  };
}
