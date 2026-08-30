import { useEffect, useState } from "react";

function getLocalDate() {
  const now = new Date();
  const timezoneOffset = now.getTimezoneOffset() * 60_000;
  return new Date(now.getTime() - timezoneOffset).toISOString().slice(0, 10);
}

const initialForm = {
  description: "",
  amount: "",
  date: getLocalDate(),
  categoryId: "",
};

export function MovementForm({ categories, isSubmitting, onSubmit }) {
  const [form, setForm] = useState(initialForm);

  useEffect(() => {
    if (categories.length > 0 && form.categoryId === "") {
      setForm((current) => ({
        ...current,
        categoryId: String(categories[0].id),
      }));
    }
  }, [categories, form.categoryId]);

  function handleChange(event) {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  }

  async function handleSubmit(event) {
    event.preventDefault();

    const wasCreated = await onSubmit({
      description: form.description,
      amount: form.amount,
      date: form.date,
      categoryId: Number(form.categoryId),
    });

    if (!wasCreated) {
      return;
    }

    setForm((current) => ({
      ...current,
      description: "",
      amount: "",
    }));
  }

  return (
    <form className="movement-form" onSubmit={handleSubmit}>
      <div className="form-field form-field-wide">
        <label htmlFor="description">Descripción</label>
        <input
          id="description"
          name="description"
          type="text"
          maxLength="160"
          required
          value={form.description}
          onChange={handleChange}
        />
      </div>

      <div className="form-field">
        <label htmlFor="amount">Importe</label>
        <input
          id="amount"
          name="amount"
          type="number"
          min="0.01"
          step="0.01"
          required
          value={form.amount}
          onChange={handleChange}
        />
      </div>

      <div className="form-field">
        <label htmlFor="date">Fecha</label>
        <input
          id="date"
          name="date"
          type="date"
          required
          value={form.date}
          onChange={handleChange}
        />
      </div>

      <div className="form-field">
        <label htmlFor="categoryId">Categoría</label>
        <select
          id="categoryId"
          name="categoryId"
          required
          value={form.categoryId}
          onChange={handleChange}
        >
          {categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name} ({category.type === "income" ? "ingreso" : "gasto"})
            </option>
          ))}
        </select>
      </div>

      <button disabled={isSubmitting || categories.length === 0} type="submit">
        {isSubmitting ? "Guardando…" : "Registrar movimiento"}
      </button>
    </form>
  );
}
