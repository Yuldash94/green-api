export type Messenger = "max" | "whatsapp";

export interface Credentials {
  idInstance: string;
  apiTokenInstance: string;
  messenger: Messenger;
}

/** Текстовое сообщение в чате */
export interface ChatMessage {
  id: string | number;
  chatId: string;
  text: string;
  direction: "outgoing" | "incoming";
  timestamp: number;
}

export interface GreenApiNotification {
  receiptId: number;
  body: {
    typeWebhook: string;
    timestamp: number;
    senderData: {
      chatId: string;
      senderName: string;
    };
    messageData?: {
      typeWebhook?: string;
      textMessageData?: {
        textMessage: string;
      };
    };
  };
}

export interface SendMessageResponse {
  idMessage: string;
}
