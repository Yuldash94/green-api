import { useState, type FormEvent } from "react";
import type { Credentials, Messenger } from "../types";
import { getStateInstance } from "../api/greenApi";

interface Props {
  theme: Messenger;
  onToggleTheme: () => void;
  onLogin: (credentials: Credentials) => void;
}

export function LoginForm({ theme, onToggleTheme, onLogin }: Props) {
  const [idInstance, setIdInstance] = useState("");
  const [apiTokenInstance, setApiTokenInstance] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const credentials: Credentials = {
      idInstance,
      apiTokenInstance,
      messenger: theme,
    };

    try {
      const { stateInstance } = await getStateInstance(credentials);
      if (stateInstance !== "authorized") {
        setError(
          `Инстанс не авторизован (state: ${stateInstance}). Авторизуйте его в GREEN-API.`,
        );
        return;
      }
      onLogin(credentials);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Не удалось подключиться к GREEN-API",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <form className="login-form" onSubmit={handleSubmit}>
        <div className="login-title-row">
          <h1>{theme === "max" ? "MAX Chat" : "WhatsApp Chat"}</h1>
          <button
            type="button"
            className="theme-toggle"
            onClick={onToggleTheme}
            title="Сменить тему"
          >
            {theme === "max" ? "🔵" : "🟢"}
          </button>
        </div>
        <p className="login-hint">
          Введите данные инстанса из личного кабинета{" "}
          <a
            href="https://console.green-api.com"
            target="_blank"
            rel="noreferrer"
          >
            GREEN-API
          </a>
          . Мессенджер определяется инстансом.
        </p>

        <label>
          idInstance
          <input
            value={idInstance}
            onChange={(e) => setIdInstance(e.target.value)}
            placeholder="7103..."
            required
          />
        </label>

        <label>
          apiTokenInstance
          <input
            type="password"
            value={apiTokenInstance}
            onChange={(e) => setApiTokenInstance(e.target.value)}
            placeholder="token"
            required
          />
        </label>

        {error && <div className="error">{error}</div>}

        <button type="submit" disabled={loading}>
          {loading ? "Проверка..." : "Войти"}
        </button>
      </form>
    </div>
  );
}
