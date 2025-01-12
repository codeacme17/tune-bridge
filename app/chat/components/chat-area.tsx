import { ActionIcon } from "@lobehub/ui";
import {
  ChatInputActionBar,
  ChatInputArea,
  ChatSendButton,
  TokenTag,
} from "@lobehub/ui/chat";
import { Eraser, Languages } from "lucide-react";

export const ChatArea = () => {
  return (
    <section className="h-80 relative">
      <ChatInputArea
        bottomAddons={<ChatSendButton />}
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
      />
    </section>
  );
};
