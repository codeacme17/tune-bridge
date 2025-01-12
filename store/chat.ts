import { MessageContent } from "@langchain/core/messages";
import { create } from "zustand";

export interface IMessage {
  content: string;
  role: "user" | "assistant";
  id: string;
  createAt: number;
}

interface ChatStore {
  messages: IMessage[];
  setMessages: (messages: IMessage[]) => void;
  setMessagesWithStreaming: (chunk: MessageContent, id: string) => void;
  loading: boolean;
  setLoading: (loading: any) => void;
}

export const useChatStore = create<ChatStore>((set) => ({
  messages: [],
  setMessages: (newMessages) => {
    set((state) => {
      return { messages: [...state.messages, ...newMessages] };
    });
  },
  setMessagesWithStreaming: (chunk, id) =>
    set((state) => ({
      messages: state.messages.map((item) =>
        item.id === id ? { ...item, content: item.content + chunk } : item
      ),
    })),
  loading: false,
  setLoading: (loading) => {
    set({ loading });
  },
}));
