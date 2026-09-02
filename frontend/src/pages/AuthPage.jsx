import { useState } from "react";
import { login, register } from "../services/api.js";

const initialForm = {
  email: "",
  password: "",
  passwordConfirmation: "",
};

export function AuthPage({ onAuthenticated }) {
  const [mode, setMode] = useState("login");
  const [form, setForm] = useState(initialForm);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const isRegisterMode = mode === "register";

  function handleChange(event) {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  }

  function changeMode(nextMode) {
    setMode(nextMode);
    setForm(initialForm);
    setError("");
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");

    if (isRegisterMode && form.password !== form.passwordConfirmation) {
      setError("Las contraseñas no coinciden.");
      return;
    }

    setIsSubmitting(true);

    try {
      const credentials = { email: form.email, password: form.password };
      const user = isRegisterMode
        ? await register(credentials)
        : await login(credentials);
      onAuthenticated(user);
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="auth-shell">
      <section className="auth-panel" aria-labelledby="auth-title">
        <p className="eyebrow">Ingeniería de Software 3</p>
        <h1 id="auth-title">
          {isRegisterMode ? "Crear cuenta" : "Iniciar sesión"}
        </h1>
        <p className="subtitle auth-subtitle">
          {isRegisterMode
            ? "Creá tu cuenta para administrar tus ingresos y gastos."
            : "Ingresá para acceder a tu control de gastos."}
        </p>

        {error && (
          <p className="status status-error" role="alert">
            {error}
          </p>
        )}

        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="form-field">
            <label htmlFor="email">Email</label>
            <input
              autoComplete="email"
              id="email"
              name="email"
              required
              type="email"
              value={form.email}
              onChange={handleChange}
            />
          </div>

          <div className="form-field">
            <label htmlFor="password">Contraseña</label>
            <input
              autoComplete={isRegisterMode ? "new-password" : "current-password"}
              id="password"
              maxLength="72"
              minLength={isRegisterMode ? "8" : undefined}
              name="password"
              required
              type="password"
              value={form.password}
              onChange={handleChange}
            />
          </div>

          {isRegisterMode && (
            <div className="form-field">
              <label htmlFor="passwordConfirmation">Confirmar contraseña</label>
              <input
                autoComplete="new-password"
                id="passwordConfirmation"
                maxLength="72"
                minLength="8"
                name="passwordConfirmation"
                required
                type="password"
                value={form.passwordConfirmation}
                onChange={handleChange}
              />
            </div>
          )}

          <button disabled={isSubmitting} type="submit">
            {isSubmitting
              ? "Procesando…"
              : isRegisterMode
                ? "Crear cuenta"
                : "Iniciar sesión"}
          </button>
        </form>

        <button
          className="button-link"
          disabled={isSubmitting}
          type="button"
          onClick={() => changeMode(isRegisterMode ? "login" : "register")}
        >
          {isRegisterMode
            ? "Ya tengo una cuenta"
            : "Quiero crear una cuenta"}
        </button>
      </section>
    </main>
  );
}
