"use client";

import { useEffect, useRef, useState } from "react";
import { useChat } from "@/hooks/use-chat";
import { SendIcon, LoaderCircleIcon } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

export const ChatArea = () => {
  const [inputValue, setInputValue] = useState("");

  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const { sendMessage, loading } = useChat();

  const handleSend = async () => {
    if (!inputValue.trim()) return;
    setInputValue("");
    await sendMessage(inputValue);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <section className="h-48 relative mt-3">
      <div className="w-full rounded-lg p-3 bg-gray-100 dark:bg-gray-900">
        <div className="rounded-lg rounded-b-none">
          <Textarea
            id="prompt-input"
            ref={textareaRef}
            onKeyDown={handleKeyDown}
            rows={4}
            placeholder="Enter your prompt"
            required
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            style={{ resize: "none" }}
            disabled={loading}
          />
        </div>

        <div className="flex items-center justify-between px-2 py-2">
          <Button
            type="submit"
            disabled={loading}
            onClick={handleSend}
            className="ml-auto"
          >
            Generate
            {loading ? (
              <LoaderCircleIcon className="w-5 animate-spin" />
            ) : (
              <SendIcon className="w-5" />
            )}
          </Button>
        </div>
      </div>
    </section>
  );
};
