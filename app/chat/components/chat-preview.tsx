"use client";

import { useEffect, useMemo, useRef } from "react";
import { useChat } from "@/hooks/use-chat";
import { IMessage } from "@/store";

import Shiki from "@shikijs/markdown-it";
import MarkdownIt from "markdown-it";

interface MessageItemProps extends IMessage {}

const md = MarkdownIt().use(
  await Shiki({
    themes: {
      light: "vitesse-light",
      dark: "vitesse-dark",
    },
  })
);

const MessageItem = (props: MessageItemProps) => {
  const { role, content = "" } = props;

  const renderContent = useMemo(() => {
    const rawHtml = md.render(content);
    return rawHtml;
    // return DOMPurify.sanitize(rawHtml);
  }, [content]);

  if (role === "assistant") {
    return (
      <div className="flex items-start">
        <img
          className="mr-2 h-8 w-8 rounded-full"
          src="https://dummyimage.com/128x128/363536/ffffff&text=J"
        />
        <div className="flex rounded-b-xl rounded-tr-xl bg-slate-50 p-4 dark:bg-slate-800 sm:max-w-md md:max-w-2xl">
          <div
            dangerouslySetInnerHTML={{ __html: renderContent }}
            className="w-full overflow-clip"
          ></div>
        </div>
      </div>
    );
  }

  if (role === "user") {
    return (
      <div className="flex flex-row-reverse items-start">
        <img
          className="ml-2 h-8 w-8 rounded-full"
          src="https://dummyimage.com/128x128/354ea1/ffffff&text=G"
        />

        <div className="flex min-h-[85px] rounded-b-xl rounded-tl-xl bg-slate-50 p-4 dark:bg-slate-800 sm:min-h-0 sm:max-w-md md:max-w-2xl">
          <div dangerouslySetInnerHTML={{ __html: renderContent }}></div>
        </div>
        <div className="mr-2 mt-1 flex flex-col-reverse gap-2 text-slate-500 sm:flex-row"></div>
      </div>
    );
  }
};

export const ChatPrivew = () => {
  const { messages } = useChat();
  const markdownItRef = useRef<MarkdownIt | null>(null);

  useEffect(() => {
    const initMarkdown = async () => {
      const MarkdownIt = (await import("markdown-it")).default;
      const md = MarkdownIt();
      markdownItRef.current = md;
    };

    if (!markdownItRef.current) {
      initMarkdown();
    }
  }, []);

  return (
    <div
      id="chat-preview"
      className="rounded-xl p-4 text-sm space-y-6 leading-6 text-slate-900 shadow-sm dark:text-slate-300 sm:text-base sm:leading-7"
      style={{
        height: "calc(-350px + 100vh)",
        overflowY: "scroll",
      }}
    >
      {messages.map((message) => (
        <MessageItem key={message.id} {...message} />
      ))}
    </div>
  );
};
