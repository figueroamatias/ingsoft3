import { useEffect, useState } from "react";
import { CategoryForm } from "../components/CategoryForm.jsx";
import { FinancialSummary } from "../components/FinancialSummary.jsx";
import { MovementForm } from "../components/MovementForm.jsx";
import { MovementList } from "../components/MovementList.jsx";
import {
  createCategory,
  createMovement,
  getCategories,
  getFinancialSummary,
  getMovements,
} from "../services/api.js";

export function MovementsPage() {
  const [categories, setCategories] = useState([]);
  const [movements, setMovements] = useState([]);
  const [summary, setSummary] = useState({
    totalIncome: 0,
    totalExpense: 0,
    balance: 0,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isSummaryLoading, setIsSummaryLoading] = useState(true);
  const [isCreatingCategory, setIsCreatingCategory] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [categoryError, setCategoryError] = useState("");
  const [categoryCreationError, setCategoryCreationError] = useState("");
  const [summaryError, setSummaryError] = useState("");
  const [error, setError] = useState("");

  async function refreshSummary() {
    setIsSummaryLoading(true);
    setSummaryError("");

    try {
      setSummary(await getFinancialSummary());
    } catch (requestError) {
      setSummaryError(`No se pudo cargar el resumen: ${requestError.message}`);
    } finally {
      setIsSummaryLoading(false);
    }
  }

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

    refreshSummary();
  }, []);

  async function handleCreateMovement(input) {
    setIsSubmitting(true);
    setError("");

    try {
      const createdMovement = await createMovement(input);
      setMovements((current) => [createdMovement, ...current]);
      await refreshSummary();
      return true;
    } catch (requestError) {
      setError(requestError.message);
      return false;
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleCreateCategory(input) {
    setIsCreatingCategory(true);
    setCategoryCreationError("");

    try {
      const createdCategory = await createCategory(input);
      setCategories((current) => [...current, createdCategory]);
      return true;
    } catch (requestError) {
      setCategoryCreationError(requestError.message);
      return false;
    } finally {
      setIsCreatingCategory(false);
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
      {categoryCreationError && (
        <p className="status status-error">{categoryCreationError}</p>
      )}
      {summaryError && <p className="status status-error">{summaryError}</p>}
      {error && <p className="status status-error">{error}</p>}

      <section className="panel" aria-labelledby="financial-summary-title">
        <h2 id="financial-summary-title">Resumen financiero</h2>
        <FinancialSummary summary={summary} isLoading={isSummaryLoading} />
      </section>

      <section className="panel" aria-labelledby="new-category-title">
        <h2 id="new-category-title">Nueva categoría</h2>
        <CategoryForm
          isSubmitting={isCreatingCategory}
          onSubmit={handleCreateCategory}
        />
      </section>

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
