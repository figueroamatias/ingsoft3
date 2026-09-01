const currencyFormatter = new Intl.NumberFormat("es-AR", {
  style: "currency",
  currency: "ARS",
});

export function FinancialSummary({ summary, isLoading }) {
  if (isLoading) {
    return <p className="status">Cargando resumen…</p>;
  }

  const balanceType = summary.balance < 0 ? "expense" : "income";

  return (
    <div className="summary-grid">
      <article className="summary-item">
        <span>Ingresos</span>
        <strong className="amount amount-income">
          {currencyFormatter.format(summary.totalIncome)}
        </strong>
      </article>
      <article className="summary-item">
        <span>Gastos</span>
        <strong className="amount amount-expense">
          {currencyFormatter.format(summary.totalExpense)}
        </strong>
      </article>
      <article className="summary-item">
        <span>Saldo</span>
        <strong className={`amount amount-${balanceType}`}>
          {currencyFormatter.format(summary.balance)}
        </strong>
      </article>
    </div>
  );
}
