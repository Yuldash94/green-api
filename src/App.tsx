import { useCallback, useEffect, useMemo, useState } from "react";
import type { ChatMessage, Credentials, Messenger } from "./types";
import { sendMessage, setSettings } from "./api/greenApi";
import { useNotifications } from "./hooks/useNotifications";
import { LoginForm } from "./components/LoginForm";
import { Sidebar, toChatId } from "./components/Sidebar";
import { Chat } from "./components/Chat";

const STORAGE_KEY = "greenapi-chat-data";

interface PersistedState {
  credentials: Credentials | null;
  chatIds: string[];
  messages: ChatMessage[];
  theme: Messenger;
}

const DEFAULT_STATE: PersistedState = {
  credentials: null,
  chatIds: [],
  messages: [],
  theme: "max",
};

const loadState = (): PersistedState => {
  try {
    const parsed = JSON.parse(
      localStorage.getItem(STORAGE_KEY) ?? "null",
    ) as PersistedState | null;

    return { ...DEFAULT_STATE, ...parsed };
  } catch {
    return DEFAULT_STATE;
  }
};

export default function App() {
  const [{ credentials, chatIds, messages, theme }, setState] =
    useState<PersistedState>(loadState);
  const [activeChatId, setActiveChatId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ credentials, chatIds, messages, theme }),
    );
  }, [credentials, chatIds, messages, theme]);

  const handleLogin = useCallback(async (creds: Credentials) => {
    try {
      await setSettings(creds, {
        webhookUrl: "",
        outgoingWebhook: "yes",
        stateWebhook: "yes",
        incomingWebhook: "yes",
      });
      setState((s) => ({ ...s, credentials: creds }));
      setError(null);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Не удалось настроить инстанс",
      );
    }
  }, []);

  const handleLogout = useCallback(() => {
    localStorage.removeItem(STORAGE_KEY);
    setState(DEFAULT_STATE);
    setActiveChatId(null);
  }, []);

  const handleToggleTheme = useCallback(() => {
    setState((s) => ({
      ...s,
      theme: s.theme === "max" ? "whatsapp" : "max",
    }));
  }, []);

  const handleCreateChat = useCallback((phone: string) => {
    const chatId = toChatId(phone);
    setState((s) =>
      s.chatIds.includes(chatId)
        ? s
        : { ...s, chatIds: [chatId, ...s.chatIds] },
    );
    setActiveChatId(chatId);
  }, []);

  const handleIncoming = useCallback((message: ChatMessage) => {
    setState((s) => {
      const chatIds = s.chatIds.includes(message.chatId)
        ? s.chatIds
        : [message.chatId, ...s.chatIds];
      return { ...s, chatIds, messages: [...s.messages, message] };
    });
    setError(null);
  }, []);

  const handleSend = useCallback(
    async (text: string) => {
      if (!credentials || !activeChatId) return;
      try {
        const { idMessage } = await sendMessage(
          credentials,
          activeChatId,
          text,
        );
        setState((s) => ({
          ...s,
          messages: [
            ...s.messages,
            {
              id: idMessage,
              chatId: activeChatId,
              text,
              direction: "outgoing",
              timestamp: Date.now(),
            },
          ],
        }));
        setError(null);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Не удалось отправить сообщение",
        );
      }
    },
    [credentials, activeChatId],
  );

  useNotifications({
    credentials: credentials!,
    enabled: Boolean(credentials),
    onMessage: handleIncoming,
    onError: setError,
  });

  const activeMessages = useMemo(
    () => messages.filter((m) => m.chatId === activeChatId),
    [messages, activeChatId],
  );

  if (!credentials) {
    return (
      <div className={`app theme-${theme}`}>
        <LoginForm
          theme={theme}
          onToggleTheme={handleToggleTheme}
          onLogin={handleLogin}
        />
      </div>
    );
  }

  return (
    <div className={`app theme-${theme}`}>
      <Sidebar
        chatIds={chatIds}
        activeChatId={activeChatId}
        theme={theme}
        onToggleTheme={handleToggleTheme}
        onSelect={setActiveChatId}
        onCreate={handleCreateChat}
        onLogout={handleLogout}
      />
      {activeChatId ? (
        <Chat
          chatId={activeChatId}
          messages={activeMessages}
          onSend={handleSend}
          error={error}
        />
      ) : (
        <main className="chat chat-empty">
          <p>Выберите чат или создайте новый по номеру телефона</p>
        </main>
      )}
    </div>
  );
}
