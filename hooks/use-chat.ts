import { useEffect, useRef, useState } from "react";
import { llm } from "@/langchain/llm";
import {
  HumanMessage,
  SystemMessage,
  AIMessage,
} from "@langchain/core/messages";
import { generate } from "shortid";
import { IMessage, useChatStore } from "@/store";
import { LOCAL_STORAGE_KEY } from "@/lib/constants";
import { useScroll } from "./use-scroll";
import { agent } from "@/langchain/agent";
import { useToast } from "./use-toast";

export const useChat = () => {
  const {
    messages,
    setMessages,
    loading,
    setLoading,
    setMessagesWithStreaming,
  } = useChatStore();

  const [error, setError] = useState<Error | null>(null);

  const { toast } = useToast();

  const { scrollToBottom } = useScroll({
    element: document.getElementById("chat-preview") as HTMLElement,
  });

  const modelRef = useRef<any>(null);

  useEffect(() => {
    const { init } = llm({ llm: "deepseek" });
    const model = init();
    modelRef.current = model;

    const localData = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (!localData) {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify([]));
    } else {
      setMessages(JSON.parse(localData));
    }
  }, []);

  const sendMessage = async (message: string) => {
    try {
      const newMessage: IMessage = {
        content: message,
        role: "user",
        id: `user-${generate()}`,
        createAt: Date.now(),
      };

      setMessages([newMessage]);

      scrollToBottom();

      localStorage.setItem(
        LOCAL_STORAGE_KEY,
        JSON.stringify([...messages, newMessage])
      );
      await invoke(message);
    } catch (error: any) {
      setError(error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error,
      });
    }
  };

  // invoke function to send message to the model
  const invoke = async (message: string) => {
    try {
      if (!modelRef.current) throw new Error("model not initialized");
      const modelWithTool = agent({
        llmParams: { llm: "deepseek", streaming: false },
      }).init();
      const model = llm({
        llm: "deepseek",
        streaming: false,
      }).init();

      setLoading(true);

      const tempMessages = [...messages];
      const res = await modelWithTool.invoke([
        new SystemMessage("You can ask me anything!"),
        ...tempMessages
          .splice(-5) // only last 5 messages
          .map((m) => {
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

  // invokeStream function to send message to the model by streaming
  const invokeStream = async () => {
    try {
      if (!modelRef.current) throw new Error("model not initialized");
      const { setMessages, setLoading, messages } = useChatStore.getState();

      setLoading(true);

      const assistantMessage: IMessage = {
        content: "",
        role: "assistant",
        id: `assistant-${generate()}`,
        createAt: Date.now(),
      };

      setMessages([assistantMessage]);

      const tempMessages = [...messages];
      const responseStream = await modelRef.current.stream([
        new SystemMessage("You can ask me anything!"),
        ...tempMessages
          .splice(-5) // only last 5 messages
          .map((m) => {
            if (m.role === "user") return new HumanMessage(m.content);
            else return new AIMessage({ content: m.content, id: m.id });
          }),
      ]);

      for await (const chunk of responseStream) {
        // console.log("[streaming]", chunk);
        assistantMessage.content += chunk.content;
        setMessagesWithStreaming(chunk.content, assistantMessage.id);
        scrollToBottom();
      }

      setLoading(false);
      localStorage.setItem(
        LOCAL_STORAGE_KEY,
        JSON.stringify([...messages, assistantMessage])
      );

      scrollToBottom();
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
