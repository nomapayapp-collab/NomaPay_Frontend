import { api } from "./api";

export type ChatRole = "user" | "model";

export type ChatHistoryMessage = {
  role: ChatRole;
  text: string;
};

type ChatResponse = {
  reply: string;
};

export async function sendChatMessage(
  message: string,
  history: ChatHistoryMessage[] = [],
): Promise<string> {
  const { data } = await api.post<ChatResponse>(
    "/chatbot/message",
    {
      message,
      history,
    },
  );

  return data.reply;
}