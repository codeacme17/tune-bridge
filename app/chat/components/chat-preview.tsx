"use client";

import { useMemo } from "react";
import { useChat } from "@/hooks/use-chat";
import { IMessage } from "@/store";

import Shiki from "@shikijs/markdown-it";
import MarkdownIt from "markdown-it";
import DOMPurify from "dompurify";

const md = MarkdownIt().use(
  await Shiki({
    themes: {
      light: "vitesse-light",
      dark: "vitesse-dark",
    },
  })
);

const MessageItem = (props: IMessage) => {
  const { role, content } = props;

  const renderContent = useMemo(() => {
    if (!md) return content;
    const rawHtml = md.render(content);
    return DOMPurify.sanitize(rawHtml);
  }, [content, md]);

  if (role === "assistant") {
    return (
      <div className="flex items-start">
        <img
          className="mr-2 h-8 w-8 rounded-full"
          src="https://dummyimage.com/128x128/363536/ffffff&text=J"
        />
        <div className="flex rounded-b-xl rounded-tr-xl bg-slate-50 p-4 dark:bg-slate-800 sm:max-w-md md:max-w-2xl">
          <p dangerouslySetInnerHTML={{ __html: renderContent }}></p>
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
          <p dangerouslySetInnerHTML={{ __html: renderContent }}></p>
        </div>
        <div className="mr-2 mt-1 flex flex-col-reverse gap-2 text-slate-500 sm:flex-row"></div>
      </div>
    );
  }
};

export const ChatPrivew = () => {
  const { messages } = useChat();

  return (
    <div
      className="flex-1 space-y-6 overflow-y-auto rounded-xl p-4 text-sm leading-6 text-slate-900 shadow-sm overflow-scroll dark:text-slate-300 sm:text-base sm:leading-7"
      style={{
        height: "calc(100vh - 320px)",
      }}
    >
      {messages.map((message) => (
        <MessageItem key={message.id} {...message} />
      ))}
    </div>
  );
};
