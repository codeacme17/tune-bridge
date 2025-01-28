import { useMemo } from "react";
import { ActionsBar, ChatList } from "@lobehub/ui/chat";
import { useChat } from "@/hooks/use-chat";
import { ChatMessage } from "@lobehub/ui";

export const ChatPrivew = () => {
  const { messages } = useChat();

  const renderMessages = useMemo(() => {
    const parsedMessages: Array<
      // Omit for remove createAt and updateAt
      Omit<ChatMessage, "createAt" | "updateAt">
    > = messages.map((m) => ({
      id: m.id,
      role: m.role,
      content: m.content,
      // createAt: m.createAt,
      // updateAt: m.createAt,
      meta: {
        title: "CanisMinor",
        avatar:
          m.role === "user"
            ? "https://avatars.githubusercontent.com/u/17870709?v=4"
            : "😎",
        backgroundColor: m.role === "user" ? "#E8DA5A" : "#E8DA5A",
      },
    }));
    return parsedMessages;
  }, [messages]);

  return (
    <section
      className="overflow-scroll py-3"
      style={{
        height: "calc(100vh - 320px)",
      }}>
      <ChatList
        data={renderMessages as ChatMessage[]}
        renderActions={ActionsBar as any}
        className="overflow-scroll h-full"
        renderMessages={{
          default: ({ id, editableContent }) => (
            <div id={id}>{editableContent}</div>
          ),
        }}
      />
    </section>
  );
};
