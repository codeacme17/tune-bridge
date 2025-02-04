import { useEffect, useRef, useState } from "react";
import {
  HumanMessage,
  SystemMessage,
  AIMessage,
} from "@langchain/core/messages";
import { generate } from "shortid";
import { IMessage, useChatStore } from "@/store";
import { agent } from "@/langchain/agent";
import { LOCAL_STORAGE_KEY } from "@/lib/constants";
import { useScroll } from "./use-scroll";
import { useToast } from "./use-toast";
import { cloneDeep } from "lodash";

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

  const agentRef = useRef<any>(null);

  useEffect(() => {
    const { init } = agent({
      llmParams: { llm: "openai", streaming: false },
    });
    agentRef.current = init();

    const localData = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (!localData) {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify([]));
    } else {
      setMessages(JSON.parse(localData));
    }
  }, []);

  const sendMessage = async (message: string) => {
    try {
      setLoading(true);

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

      await invokeAgent(message);
      setLoading(false);
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
    setLoading(true);

    try {
      if (!agentRef.current) throw new Error("model not initialized");

      const chatHistory = [...messages]
        .splice(-5) // only last 5 messages
        .map((m) => {
          if (m.role === "user") return new HumanMessage(m.content);
          else return new AIMessage({ content: m.content, id: m.id });
        });

      const res = await agentRef.current.invoke({
        chat_history: chatHistory,
        input: message,
        agent_scratchpad: "",
      });

      console.log("[res]", res);

      setMessages([
        {
          content: res.content as string,
          role: "assistant",
          id: res.id as string,
          createAt: Date.now(),
        },
      ]);

      return res.content;
    } catch (error: any) {
      console.error("invoke error ===>", error);
      setError(error);
    }

    setLoading(false);
  };

  // invokeStream function to send message to the model by streaming
  const invokeStream = async () => {
    try {
      if (!agentRef.current) throw new Error("model not initialized");
      const { setMessages, setLoading, messages } = useChatStore.getState();

      const assistantMessage: IMessage = {
        content: "",
        role: "assistant",
        id: `assistant-${generate()}`,
        createAt: Date.now(),
      };

      setMessages([assistantMessage]);

      const tempMessages = [...messages];
      const responseStream = await agentRef.current.stream([
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
      console.error(error);
    }
  };

  // invokeAgent function to send message to the model
  const invokeAgent = async (message: string) => {
    setLoading(true);

    try {
      if (!agentRef.current) throw new Error("model not initialized");

      const assistantMessage: IMessage = {
        content: "",
        role: "assistant",
        id: `assistant-${generate()}`,
        createAt: Date.now(),
      };

      const chatHistory = cloneDeep(messages)
        .splice(-5) // only last 5 messages
        .map((m) => {
          if (m.role === "user") return new HumanMessage(m.content);
          else return new AIMessage({ content: m.content, id: m.id });
        });

      const res = await agentRef.current.invoke({
        chat_history: chatHistory,
        input: message,
        agent_scratchpad: "",
      });

      assistantMessage.content = res.output;

      localStorage.setItem(
        LOCAL_STORAGE_KEY,
        JSON.stringify([...messages, assistantMessage])
      );

      setMessages([assistantMessage]);

      scrollToBottom();

      return assistantMessage.content;
    } catch (error: any) {
      console.error("invoke error ===>", error);
      setError(error);
    }
  };

  return {
    messages,
    loading,
    error,
    sendMessage,
  };
};
