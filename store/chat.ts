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
}

export const useChatStore = create<ChatStore>((set) => ({
  messages: [],
  setMessages: (newMessages) => {
    set((state) => ({
      messages: [...state.messages, ...newMessages],
    }));
  },
}));
