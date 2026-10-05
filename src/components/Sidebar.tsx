import { useState, type FormEvent } from "react";

interface Props {
  chatIds: string[];
  activeChatId: string | null;
  theme: "max" | "whatsapp";
  onToggleTheme: () => void;
  onSelect: (chatId: string) => void;
  onCreate: (phone: string) => void;
  onLogout: () => void;
}

export const toChatId = (phone: string) => `${phone.replace(/\D/g, "")}@c.us`;

export function Sidebar({
  chatIds,
  activeChatId,
  theme,
  onToggleTheme,
  onSelect,
  onCreate,
  onLogout,
}: Props) {
  const [phone, setPhone] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleCreate = (e: FormEvent) => {
    e.preventDefault();
    const digits = phone.replace(/\D/g, "");
    if (digits.length < 10) {
      setError("Введите номер в международном формате, например 79991234567");
      return;
    }
    setError(null);
    onCreate(digits);
    setPhone("");
  };

  return (
    <aside className="sidebar">
      <header className="sidebar-header">
        <span className="logo">
          {theme === "max" ? "MAX Chat" : "WhatsApp Chat"}
        </span>
        <div className="header-actions">
          <button
            className="theme-toggle"
            onClick={onToggleTheme}
            title="Сменить тему"
          >
            {theme === "max" ? "🔵" : "🟢"}
          </button>
          <button className="logout" onClick={onLogout} title="Выйти">
            Выйти
          </button>
        </div>
      </header>

      <form className="new-chat" onSubmit={handleCreate}>
        <input
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder="Новый чат: 79991234567"
        />
        <button type="submit">+</button>
      </form>
      {error && <div className="error sidebar-error">{error}</div>}

      <nav className="chat-list">
        {chatIds.length === 0 && (
          <p className="chat-list-empty">
            Введите номер телефона, чтобы начать чат
          </p>
        )}
        {chatIds.map((chatId) => (
          <button
            key={chatId}
            className={`chat-item ${chatId === activeChatId ? "active" : ""}`}
            onClick={() => onSelect(chatId)}
          >
            <span className="avatar">
              {chatId.replace(/\D/g, "").slice(-2)}
            </span>
            <span className="chat-id">{chatId}</span>
          </button>
        ))}
      </nav>
    </aside>
  );
}
