export function formatPercentage(value) {
  const numericValue = Number(value);

  if (!Number.isFinite(numericValue)) {
    throw new Error("El porcentaje debe ser numérico.");
  }

  const roundedValue = Math.round(numericValue * 100) / 100;
  return `${roundedValue.toLocaleString("es-AR")}%`;
}
