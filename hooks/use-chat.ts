import { useEffect, useRef, useState } from "react";
import { ChatOpenAI, ChatOpenAICallOptions } from "@langchain/openai";
import { llm } from "@/langchain/llm";
import {
  HumanMessage,
  SystemMessage,
  AIMessage,
} from "@langchain/core/messages";
import { generate } from "shortid";
import { useChatStore } from "@/store";

export const useChat = () => {
  const { messages, setMessages } = useChatStore();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const hasInit = useRef(false);

  const modelRef = useRef<ChatOpenAI<ChatOpenAICallOptions>>(null);

  useEffect(() => {
    const { init } = llm();
    const model = init();
    modelRef.current = model;

    const localData = localStorage.getItem("chat-messages");
    if (!localData) localStorage.setItem("chat-messages", JSON.stringify([]));
    else setMessages(JSON.parse(localData));

    hasInit.current = true;
  }, []);

  useEffect(() => {
    if (!messages.length && !hasInit.current) return;
    localStorage.setItem("chat-messages", JSON.stringify(messages));
  }, [messages]);

  const sendMessage = async (message: string) => {
    setMessages([
      {
        content: message,
        role: "user",
        id: `user-${generate()}`,
        createAt: Date.now(),
      },
    ]);
    await invoke(message);
  };

  const invoke = async (message: string) => {
    try {
      if (!modelRef.current) throw new Error("model not initialized");
      setLoading(true);
      const res = await modelRef.current.invoke([
        new SystemMessage("You can ask me anything!"),
        ...messages.map((m) => {
          if (m.role === "user") return new HumanMessage(m.content);
          else return new AIMessage({ content: m.content, id: m.id });
        }),
        new HumanMessage(message),
      ]);

      console.log("[completed res]", res);

      setMessages([
        {
          content: res.content as string,
          role: "assistant",
          id: res.id as string,
          createAt: Date.now(),
        },
      ]);

      setLoading(false);
      return res.content;
    } catch (error: any) {
      setError(error);
    }
  };

  return {
    messages,
    loading,
    error,
    sendMessage,
    invoke,
  };
};
