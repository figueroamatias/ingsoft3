import { useEffect, useState } from "react";
import { MovementForm } from "../components/MovementForm.jsx";
import { MovementList } from "../components/MovementList.jsx";
import {
  createMovement,
  getCategories,
  getMovements,
} from "../services/api.js";

export function MovementsPage() {
  const [categories, setCategories] = useState([]);
  const [movements, setMovements] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [categoryError, setCategoryError] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    getCategories()
      .then(setCategories)
      .catch((requestError) =>
        setCategoryError(`No se pudieron cargar las categorías: ${requestError.message}`),
      );

    getMovements()
      .then(setMovements)
      .catch((requestError) => setError(requestError.message))
      .finally(() => setIsLoading(false));
  }, []);

  async function handleCreateMovement(input) {
    setIsSubmitting(true);
    setError("");

    try {
      const createdMovement = await createMovement(input);
      setMovements((current) => [createdMovement, ...current]);
      return true;
    } catch (requestError) {
      setError(requestError.message);
      return false;
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="app-shell">
      <header>
        <p className="eyebrow">Ingeniería de Software 3</p>
        <h1>Control de gastos</h1>
        <p className="subtitle">
          Registrá ingresos y gastos usando categorías almacenadas en PostgreSQL.
        </p>
      </header>

      {categoryError && <p className="status status-error">{categoryError}</p>}
      {error && <p className="status status-error">{error}</p>}

      <section className="panel" aria-labelledby="new-movement-title">
        <h2 id="new-movement-title">Nuevo movimiento</h2>
        <MovementForm
          categories={categories}
          isSubmitting={isSubmitting}
          onSubmit={handleCreateMovement}
        />
      </section>

      <section className="panel" aria-labelledby="movement-list-title">
        <div className="section-heading">
          <h2 id="movement-list-title">Movimientos registrados</h2>
          {!isLoading && <span>{movements.length}</span>}
        </div>
        {isLoading ? (
          <p className="status">Cargando movimientos…</p>
        ) : (
          <MovementList movements={movements} />
        )}
      </section>
    </main>
  );
}
