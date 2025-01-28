import { useEffect, useRef, useState } from "react";
import { llm } from "@/langchain/llm";
import {
  HumanMessage,
  SystemMessage,
  AIMessage,
} from "@langchain/core/messages";
import { generate } from "shortid";
import { IMessage, useChatStore } from "@/store";

export const useChat = () => {
  const {
    messages,
    setMessages,
    loading,
    setLoading,
    setMessagesWithStreaming,
  } = useChatStore();
  const [error, setError] = useState<Error | null>(null);

  const modelRef = useRef<any>(null);

  useEffect(() => {
    const { init } = llm({ llm: "deepseek" });
    const model = init();
    modelRef.current = model;

    const localData = localStorage.getItem("chat-messages");
    if (!localData) {
      localStorage.setItem("chat-messages", JSON.stringify([]));
    } else {
      setMessages(JSON.parse(localData));
    }
  }, []);

  const sendMessage = async (message: string) => {
    const newMessage: IMessage = {
      content: message,
      role: "user",
      id: `user-${generate()}`,
      createAt: Date.now(),
    };
    setMessages([newMessage]);
    localStorage.setItem(
      "chat-messages",
      JSON.stringify([...messages, newMessage])
    );
    invokeStream(message);
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

  const invokeStream = async (message: string) => {
    try {
      if (!modelRef.current) throw new Error("model not initialized");

      const { setMessages, setLoading, messages } =
        useChatStore.getState();

      // 设置加载状态为 true
      setLoading(true);

      // 准备初始消息
      const assistantMessage: IMessage = {
        content: "",
        role: "assistant",
        id: `assistant-${generate()}`,
        createAt: Date.now(),
      };

      setMessages([assistantMessage]);

      const responseStream = await modelRef.current.stream([
        new SystemMessage("You can ask me anything!"),
        ...messages
          .splice(-5) // only last 5 messages
          .map((m) => {
            if (m.role === "user") return new HumanMessage(m.content);
            else
              return new AIMessage({ content: m.content, id: m.id });
          }),
      ]);

      for await (const chunk of responseStream) {
        console.log("[chunk]", chunk);
        assistantMessage.content += chunk.content;
        setMessagesWithStreaming(chunk.content, assistantMessage.id);
      }

      setLoading(false);
      localStorage.setItem(
        "chat-messages",
        JSON.stringify([...messages, assistantMessage])
      );
      return assistantMessage.content;
    } catch (error: any) {
      const { setLoading } = useChatStore.getState();
      setLoading(false);
      console.error(error);
    }
  };

  return {
    messages,
    loading,
    error,
    sendMessage,
    invoke,
    invokeStream,
  };
};
