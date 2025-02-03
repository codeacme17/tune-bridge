"use client";

import { ChatArea } from "./components/chat-area";
import { useHasMounted } from "@/hooks/use-has-mounted";
import { ChatPrivew } from "./components/chat-preview";

const Chat = () => {
  const { hasMounted } = useHasMounted();

  if (!hasMounted) return null;

  return (
    <section className="flex justify-center h-full">
      <div className="max-w-[800px] md:w-full h-full flex flex-col">
        <h1 className="text-2xl">Chat</h1>
        <h3 className="text-lg text-gray-500/80">
          you can chat there, to bridge your tune
        </h3>

        {/* Chat Container */}
        <div className="flex flex-col flex-1">
          <ChatPrivew />
          <ChatArea />
        </div>
      </div>
    </section>
  );
};

export default Chat;
