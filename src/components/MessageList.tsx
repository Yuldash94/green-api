import { useEffect, useRef } from "react";
import type { ChatMessage } from "../types";

interface Props {
  messages: ChatMessage[];
}

const formatTime = (ts: number) =>
  new Date(ts).toLocaleTimeString("ru-RU", {
    hour: "2-digit",
    minute: "2-digit",
  });

export function MessageList({ messages }: Props) {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="message-list">
      {messages.map((m) => (
        <div key={m.id} className={`bubble ${m.direction}`}>
          <div className="bubble-text">{m.text}</div>
          <div className="bubble-meta">{formatTime(m.timestamp)}</div>
        </div>
      ))}
      <div ref={bottomRef} />
    </div>
  );
}
