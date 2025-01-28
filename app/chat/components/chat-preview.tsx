import { useMemo } from "react";
import { ActionsBar, ChatList } from "@lobehub/ui/chat";
import { useChat } from "@/hooks/use-chat";
import { ChatMessage } from "@lobehub/ui";

export const ChatPrivew = () => {
  const { messages } = useChat();

  // return (
  //   <div>
  //     {messages.map((message) => {
  //       return (
  //         <div key={message.id} className="mt-10">
  //           {message.content}
  //         </div>
  //       );
  //     })}
  //   </div>
  // );

  return (
    <section
      className="overflow-scroll py-3"
      style={{
        height: "calc(100vh - 320px)",
      }}>
      <ChatList
        data={messages as ChatMessage[]}
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
