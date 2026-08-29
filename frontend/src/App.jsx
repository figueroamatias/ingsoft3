import { useEffect, useState } from "react";
import { getCategories } from "./services/api.js";

const typeLabels = {
  income: "Ingresos",
  expense: "Gastos",
};

export function App() {
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    getCategories()
      .then(setCategories)
      .catch((requestError) => setError(requestError.message))
      .finally(() => setIsLoading(false));
  }, []);

  return (
    <main className="app-shell">
      <header>
        <p className="eyebrow">Ingeniería de Software 3</p>
        <h1>Control de gastos personales</h1>
        <p className="subtitle">
          Categorías obtenidas desde React, Express y PostgreSQL.
        </p>
      </header>

      {isLoading && <p className="status">Cargando categorías…</p>}
      {error && <p className="status status-error">{error}</p>}

      {!isLoading && !error && (
        <section className="category-grid" aria-label="Categorías disponibles">
          {Object.entries(typeLabels).map(([type, label]) => (
            <article className="category-card" key={type}>
              <h2>{label}</h2>
              <ul>
                {categories
                  .filter((category) => category.type === type)
                  .map((category) => (
                    <li key={category.id}>{category.name}</li>
                  ))}
              </ul>
            </article>
          ))}
        </section>
      )}
    </main>
  );
}
