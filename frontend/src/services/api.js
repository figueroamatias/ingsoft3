export async function getCategories() {
  const response = await fetch("/api/categories");

  if (!response.ok) {
    throw new Error("No se pudieron obtener las categorías.");
  }

  return response.json();
}
