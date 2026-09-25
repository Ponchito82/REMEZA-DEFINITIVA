import { ChatMessage, MOCK_CHAT, MOCK_SUPPORT } from "../mocks/remeza";
import { mockDelay } from "./mockDelay";

// TODO API: datos de contacto de soporte.
export function getSupportContact() {
  return MOCK_SUPPORT;
}

// TODO API: historial de la conversacion con soporte.
export async function getChatHistory(): Promise<ChatMessage[]> {
  await mockDelay(200);
  return MOCK_CHAT;
}

// TODO API: enviar un mensaje al agente y recibir su respuesta.
export async function sendChatMessage(_text: string): Promise<ChatMessage> {
  await mockDelay(1500);
  return { id: `a-${Date.now()}`, from: "agent", textKey: "chatAgentReply", at: Date.now() };
}
