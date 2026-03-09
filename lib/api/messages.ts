import { apiRequest } from "@/lib/api/client";

export interface MessageInput {
  receiverId: string;
  content: string;
}

export async function sendMessage(input: MessageInput) {
  return apiRequest<{ id: string }>("/api/messages", {
    method: "POST",
    json: input
  });
}
