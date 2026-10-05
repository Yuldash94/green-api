import type { ChatMessage } from "../types";
import { MessageList } from "./MessageList";
import { MessageInput } from "./MessageInput";

interface Props {
  chatId: string;
  messages: ChatMessage[];
  onSend: (text: string) => void;
  error: string | null;
}

export function Chat({ chatId, messages, onSend, error }: Props) {
  return (
    <main className="chat">
      <header className="chat-header">
        <span className="avatar">{chatId.replace(/\D/g, "").slice(-2)}</span>
        <span className="chat-title">{chatId}</span>
      </header>

      <MessageList messages={messages} />

      {error && <div className="error chat-error">{error}</div>}

      <MessageInput onSend={onSend} />
    </main>
  );
}
