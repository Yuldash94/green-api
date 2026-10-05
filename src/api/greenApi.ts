import type {
  Credentials,
  GreenApiNotification,
  SendMessageResponse,
} from "../types";

const PROXY_PATH = import.meta.env.VITE_API_PROXY_PATH ?? "/greenapi";
const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ?? "https://api.green-api.com";

const BASE_URL = import.meta.env.DEV ? PROXY_PATH : API_BASE_URL;

const INSTANCE_PREFIX = "waInstance";

const url = (creds: Credentials, method: string, extra = "") =>
  `${BASE_URL}/${INSTANCE_PREFIX}${creds.idInstance}/${method}/${creds.apiTokenInstance}${extra}`;

async function request<T>(url: string, init?: RequestInit): Promise<T> {
  const res = await fetch(url, {
    headers: { "Content-Type": "application/json" },
    ...init,
  });

  const text = await res.text();

  if (!res.ok) {
    throw new Error(`GREEN-API error ${res.status}: ${text || "пустой ответ"}`);
  }

  if (!text) {
    return null as T;
  }

  try {
    return JSON.parse(text) as T;
  } catch {
    throw new Error(`Некорректный ответ GREEN-API: ${text.slice(0, 200)}`);
  }
}

export function getStateInstance(
  creds: Credentials,
): Promise<{ stateInstance: string }> {
  return request(url(creds, "getStateInstance"));
}

export function sendMessage(
  creds: Credentials,
  chatId: string,
  message: string,
): Promise<SendMessageResponse> {
  return request(url(creds, "sendMessage"), {
    method: "POST",
    body: JSON.stringify({ chatId, message }),
  });
}

export function receiveNotification(
  creds: Credentials,
): Promise<GreenApiNotification | null> {
  return request<GreenApiNotification | null>(
    url(creds, "receiveNotification"),
  );
}

export function deleteNotification(
  creds: Credentials,
  receiptId: number,
): Promise<{ result: boolean; reason: string }> {
  return request(url(creds, "deleteNotification", `/${receiptId}`), {
    method: "DELETE",
  });
}

export interface SettingsPayload {
  webhookUrl: string;
  outgoingWebhook: string;
  stateWebhook: string;
  incomingWebhook: string;
}

export function setSettings(
  creds: Credentials,
  settings: SettingsPayload,
): Promise<{ saveSettings: boolean }> {
  return request(url(creds, "setSettings"), {
    method: "POST",
    body: JSON.stringify(settings),
  });
}
