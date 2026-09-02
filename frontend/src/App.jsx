import { useEffect, useState } from "react";
import { AuthPage } from "./pages/AuthPage.jsx";
import { MovementsPage } from "./pages/MovementsPage.jsx";
import { getCurrentUser, logout } from "./services/api.js";

export function App() {
  const [user, setUser] = useState(null);
  const [isCheckingSession, setIsCheckingSession] = useState(true);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [logoutError, setLogoutError] = useState("");

  useEffect(() => {
    function clearExpiredSession() {
      setUser(null);
    }

    window.addEventListener("auth:unauthorized", clearExpiredSession);

    getCurrentUser()
      .then(setUser)
      .catch(() => setUser(null))
      .finally(() => setIsCheckingSession(false));

    return () => {
      window.removeEventListener("auth:unauthorized", clearExpiredSession);
    };
  }, []);

  async function handleLogout() {
    setIsLoggingOut(true);
    setLogoutError("");

    try {
      await logout();
      setUser(null);
    } catch (error) {
      setLogoutError(error.message);
    } finally {
      setIsLoggingOut(false);
    }
  }

  if (isCheckingSession) {
    return (
      <main className="auth-shell">
        <p className="status">Comprobando sesión…</p>
      </main>
    );
  }

  if (!user) {
    return <AuthPage onAuthenticated={setUser} />;
  }

  return (
    <MovementsPage
      isLoggingOut={isLoggingOut}
      logoutError={logoutError}
      onLogout={handleLogout}
      user={user}
    />
  );
}
