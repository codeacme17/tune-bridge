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
  /**
   * Set a new message list, merge new messages and update the state
   * @param newMessages New messages to be added
   */
  setMessages: (newMessages: IMessage[]) => void;
  /**
   * Set a new message content chunk to the target message
   * @param chunk New message content chunk
   * @param id Target message id
   */
  setMessagesWithStreaming: (
    chunk: MessageContent,
    id: string
  ) => void;
  loading: boolean;
  /**
   * Set the loading state
   * @param loading Loading state
   */
  setLoading: (loading: boolean) => void;
}

export const useChatStore = create<ChatStore>((set) => ({
  messages: [],
  setMessages: (newMessages) => {
    set((state) => {
      const existingIds = new Set(
        state.messages.map((msg) => msg.id)
      );
      const filteredMessages = newMessages.filter(
        (msg) => !existingIds.has(msg.id)
      );
      return { messages: [...state.messages, ...filteredMessages] };
    });
  },
  setMessagesWithStreaming: (chunk, id) => {
    if (typeof chunk !== "string") {
      throw new Error("Chunk content must be a string");
    }
    set((state) => {
      const updatedMessages = state.messages.map((message) =>
        message.id === id
          ? { ...message, content: message.content + chunk }
          : message
      );
      console.log("[updatedMessages]", updatedMessages);
      return { messages: updatedMessages };
    });
  },
  loading: false,
  setLoading: (loading) => set({ loading }),
}));
