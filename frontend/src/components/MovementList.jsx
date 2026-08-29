const currencyFormatter = new Intl.NumberFormat("es-AR", {
  style: "currency",
  currency: "ARS",
});

const typeLabels = {
  income: "Ingreso",
  expense: "Gasto",
};

function formatDate(date) {
  return new Intl.DateTimeFormat("es-AR").format(
    new Date(`${date}T00:00:00`),
  );
}

export function MovementList({ movements }) {
  if (movements.length === 0) {
    return <p className="empty-state">Todavía no hay movimientos registrados.</p>;
  }

  return (
    <div className="movement-list">
      {movements.map((movement) => (
        <article className="movement-item" key={movement.id}>
          <div>
            <p className="movement-description">{movement.description}</p>
            <p className="movement-detail">
              {formatDate(movement.date)} · {movement.category.name} · {typeLabels[movement.category.type]}
            </p>
          </div>
          <strong className={`amount amount-${movement.category.type}`}>
            {currencyFormatter.format(movement.amount)}
          </strong>
        </article>
      ))}
    </div>
  );
}
