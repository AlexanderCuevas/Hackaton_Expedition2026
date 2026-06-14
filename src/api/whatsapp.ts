import { apiFetch } from "./client";
import type {
  WhatsAppConfigResponse,
  WhatsAppSendRequest,
  WhatsAppSendResponse,
} from "./types";

export async function getWhatsAppConfig(): Promise<WhatsAppConfigResponse> {
  return apiFetch<WhatsAppConfigResponse>("/whatsapp/config");
}

export async function sendWhatsAppMessage(
  params: WhatsAppSendRequest,
): Promise<WhatsAppSendResponse> {
  return apiFetch<WhatsAppSendResponse>("/whatsapp/send", {
    method: "POST",
    body: JSON.stringify(params),
  });
}
