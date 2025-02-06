"use client";

import { useEffect, useRef, useState } from "react";
import { HumanMessage, AIMessage } from "@langchain/core/messages";
import { generate } from "shortid";
import { IMessage, useChatStore } from "@/store";
import { agent } from "@/langchain/agent";
import { LOCAL_STORAGE_KEY } from "@/lib/constants";
import { useToast } from "./use-toast";
import { cloneDeep } from "lodash";
import { useScroll } from "./use-scroll";

export const useChat = () => {
  const {
    messages,
    setMessages,
    loading,
    setLoading,
    // If you need special handling with setMessagesWithStreaming, keep it
  } = useChatStore();

  const [error, setError] = useState<Error | null>(null);
  const { toast } = useToast();
  const [initialized, setInitialized] = useState(false);

  // Reference to store the agent instance
  const agentRef = useRef<any>(null);

  // Used to scroll to the bottom. Assume you have an element with id="chat-preview"
  const { scrollToBottom } = useScroll({
    element: document.getElementById("chat-preview") as HTMLElement,
  });

  /**
   * On the first render:
   * 1. Initialize the agent
   * 2. Load history messages from localStorage
   */
  useEffect(() => {
    const { init } = agent({
      llmParams: { llm: "openai", streaming: false },
    });
    agentRef.current = init();

    // Load messages from localStorage
    const localData = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (localData) {
      try {
        const parsed = JSON.parse(localData) as IMessage[];
        setMessages(parsed);
      } catch (err) {
        console.error("Failed to parse localStorage data:", err);
        setMessages([]);
      }
    } else {
      setMessages([]);
    }

    setInitialized(true);
  }, [setMessages]);

  /**
   * Whenever messages change:
   * 1. Write to localStorage
   * 2. Scroll to the bottom
   */
  useEffect(() => {
    if (!initialized) return;
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(messages));
    scrollToBottom();
  }, [messages, scrollToBottom]);

  /**
   * Send a user message
   */
  const sendMessage = async (userInput: string) => {
    try {
      if (!userInput.trim()) return;
      setLoading(true);

      // Create a user message
      const userMessage: IMessage = {
        content: userInput,
        role: "user",
        id: `user-${generate()}`,
        createAt: Date.now(),
      };

      // Append the user message to the end of the messages array
      setMessages([userMessage], { merge: true });

      // Invoke the agent with the user input
      await invokeAgent(userInput);
    } catch (err: any) {
      setError(err);
      toast({
        variant: "destructive",
        title: "Error",
        description: String(err),
      });
      setLoading(false);
    }
  };

  /**
   * Call the Agent to get the AI response
   */
  const invokeAgent = async (message: string) => {
    try {
      if (!agentRef.current) {
        throw new Error("Model not initialized");
      }

      // Build the initial structure of the assistant message
      const assistantMessage: IMessage = {
        content: "",
        role: "assistant",
        id: `assistant-${generate()}`,
        createAt: Date.now(),
      };

      // Take the last 5 messages as context
      const recentMessages = cloneDeep(messages)
        .slice(-5)
        .map((m) => {
          if (m.role === "user") return new HumanMessage(m.content);
          return new AIMessage({ content: m.content, id: m.id });
        });

      // Append the assistant message to the messages array
      setMessages([assistantMessage], { merge: true });

      // Invoke the agent
      const res = await agentRef.current.invoke({
        chat_history: recentMessages,
        input: message,
        agent_scratchpad: "",
      });

      setMessages([assistantMessage], { merge: true });

      // Assign the AI's response content
      assistantMessage.content = res.output;

      setLoading(false);
      return assistantMessage.content;
    } catch (err: any) {
      console.error("invokeAgent error ===>", err);
      setError(err);
      setLoading(false);
    }
  };

  return {
    messages,
    loading,
    error,
    sendMessage,
  };
};
