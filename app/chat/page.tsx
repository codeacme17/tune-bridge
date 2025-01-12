"use client";

import { ThemeProvider } from "@lobehub/ui";
import { ChatPrivew } from "./components/chat-preview";
import { useTheme } from "next-themes";
import { ChatArea } from "./components/chat-area";
import { useHasMounted } from "@/hooks/use-has-mounted";

const Chat = () => {
  const { theme } = useTheme();
  const { hasMounted } = useHasMounted();

  if (!hasMounted) return null;

  return (
    <section className="flex justify-center h-full">
      <div className="max-w-[800px] w-full h-full flex flex-col">
        <h1 className="text-2xl">Chat</h1>
        <h3 className="text-lg text-gray-500/80">
          you can chat there, to bridge your tune
        </h3>

        {/* Chat Container */}
        <ThemeProvider
          appearance={theme}
          className="flex flex-col justify-between">
          <ChatPrivew />
          <ChatArea />
        </ThemeProvider>
      </div>
    </section>
  );
};

export default Chat;
