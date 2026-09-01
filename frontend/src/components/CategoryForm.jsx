import { useState } from "react";

const initialForm = {
  name: "",
  type: "expense",
};

export function CategoryForm({ isSubmitting, onSubmit }) {
  const [form, setForm] = useState(initialForm);

  function handleChange(event) {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  }

  async function handleSubmit(event) {
    event.preventDefault();

    const wasCreated = await onSubmit(form);

    if (wasCreated) {
      setForm((current) => ({ ...current, name: "" }));
    }
  }

  return (
    <form className="category-form" onSubmit={handleSubmit}>
      <div className="form-field">
        <label htmlFor="categoryName">Nombre</label>
        <input
          id="categoryName"
          name="name"
          type="text"
          maxLength="80"
          required
          value={form.name}
          onChange={handleChange}
        />
      </div>

      <div className="form-field">
        <label htmlFor="categoryType">Tipo</label>
        <select
          id="categoryType"
          name="type"
          value={form.type}
          onChange={handleChange}
        >
          <option value="income">Ingreso</option>
          <option value="expense">Gasto</option>
        </select>
      </div>

      <button disabled={isSubmitting} type="submit">
        {isSubmitting ? "Creando…" : "Crear categoría"}
      </button>
    </form>
  );
}
