import { create } from "zustand";
import { MessageContent } from "@langchain/core/messages";

export interface IMessage {
  id: string;
  content: string;
  role?: "user" | "assistant";
  createAt?: number;
}

interface ChatStore {
  messages: IMessage[];
  /**
   * Set a new message list. By default, it replaces the old messages.
   * If merge = true, it will merge new messages with the old ones.
   */
  setMessages: (newMessages: IMessage[], options?: { merge?: boolean }) => void;
  /**
   * Stream new content to a target message by id
   */
  setMessagesWithStreaming: (chunk: MessageContent, id: string) => void;
  loading: boolean;
  setLoading: (loading: boolean) => void;
}

export const useChatStore = create<ChatStore>((set) => ({
  messages: [],

  setMessages: (newMessages, options) => {
    const { merge = false } = options ?? {};

    set((state) => {
      if (!merge) {
        // Directly replace all messages
        return { messages: newMessages };
      } else {
        // Merge logic: use a Map to handle duplicates by id
        const updatedMap = new Map<string, IMessage>();

        // put existing messages into map
        for (const msg of state.messages) updatedMap.set(msg.id, msg);

        // override or add new messages
        for (const msg of newMessages) updatedMap.set(msg.id, msg);

        return { messages: Array.from(updatedMap.values()) };
      }
    });
  },

  setMessagesWithStreaming: (chunk, id) => {
    if (typeof chunk !== "string") throw new Error("Chunk content must be a string");

    set((state) => {
      const updatedMessages = state.messages.map((message) => {
        if (message.id === id) return { ...message, content: message.content + chunk };
        return message;
      });
      return { messages: updatedMessages };
    });
  },

  loading: false,
  setLoading: (loading) => set({ loading }),
}));
