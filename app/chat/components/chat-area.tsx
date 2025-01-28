import { useChat } from "@/hooks/use-chat";
import { ActionIcon } from "@lobehub/ui";
import {
  ChatInputActionBar,
  ChatInputArea,
  ChatSendButton,
  TokenTag,
} from "@lobehub/ui/chat";
import { Eraser, Languages } from "lucide-react";
import { useState } from "react";

export const ChatArea = () => {
  const [inputValue, setInputValue] = useState("");
  const { sendMessage, loading } = useChat();

  const handleSend = async () => {
    if (!inputValue.trim()) return;
    setInputValue("");
    sendMessage(inputValue);
  };

  return (
    <section className="h-48 relative">
      <ChatInputArea
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        topAddons={
          <ChatInputActionBar
            leftAddons={
              <>
                <ActionIcon icon={Languages} />
                <ActionIcon icon={Eraser} />
                <TokenTag maxValue={5000} value={1000} />
              </>
            }
          />
        }
        bottomAddons={<ChatSendButton onSend={handleSend} loading={loading} />}
      />
    </section>
  );
};
