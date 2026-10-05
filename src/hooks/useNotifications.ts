import { useEffect, useRef } from "react";
import type { Credentials, ChatMessage } from "../types";
import { deleteNotification, receiveNotification } from "../api/greenApi";

interface Options {
  credentials: Credentials | null;
  enabled: boolean;
  onMessage: (message: ChatMessage) => void;
  onError: (message: string) => void;
}
const POLL_INTERVAL_MS = 3000;

export function useNotifications({
  credentials,
  enabled,
  onMessage,
  onError,
}: Options) {
  const onMessageRef = useRef(onMessage);
  const onErrorRef = useRef(onError);
  onMessageRef.current = onMessage;
  onErrorRef.current = onError;

  useEffect(() => {
    if (!enabled || !credentials) return;

    let stopped = false;
    let timer: ReturnType<typeof setTimeout>;

    const drainQueue = async () => {
      for (;;) {
        if (stopped) return;
        try {
          const notification = await receiveNotification(credentials);
          if (!notification) break; // таймаут — очередь пуста

          const { receiptId, body } = notification;
          const isTextIncoming =
            body.typeWebhook === "incomingMessageReceived" &&
            body.messageData?.textMessageData?.textMessage;

          if (isTextIncoming) {
            onMessageRef.current({
              id: receiptId,
              chatId: body.senderData.chatId,
              text: body.messageData!.textMessageData!.textMessage,
              direction: "incoming",
              timestamp: body.timestamp * 1000,
            });
          }

          await deleteNotification(credentials, receiptId);
        } catch (err) {
          onErrorRef.current(
            err instanceof Error ? err.message : "Ошибка получения сообщений",
          );
          break;
        }
      }

      if (!stopped) {
        timer = setTimeout(drainQueue, POLL_INTERVAL_MS);
      }
    };

    drainQueue();

    return () => {
      stopped = true;
      clearTimeout(timer);
    };
  }, [
    enabled,
    credentials?.idInstance,
    credentials?.apiTokenInstance,
    credentials?.messenger,
  ]);
}
