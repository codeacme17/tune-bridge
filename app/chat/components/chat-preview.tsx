import { ActionsBar, ChatList } from "@lobehub/ui/chat";
import { useChat } from "@/hooks/use-chat";
import { useEffect, useMemo } from "react";
import { ChatMessage } from "@lobehub/ui";

export const ChatPrivew = () => {
  const { messages } = useChat();

  useEffect(() => {
    console.log("[messages]", messages);
  }, [messages]);

  const renderMessages = useMemo(() => {
    const parsedMessages: ChatMessage[] = messages.map((m) => ({
      content: m.content,
      role: m.role,
      createAt: m.createAt,
      id: m.id,
      meta: {
        title: "CanisMinor",
        avatar:
          m.role === "user"
            ? "https://avatars.githubusercontent.com/u/17870709?v=4"
            : "😎",
        backgroundColor: m.role === "user" ? "#E8DA5A" : "#E8DA5A",
      },
      updateAt: m.createAt,
    }));
    return parsedMessages;
  }, [messages]);

  // const data: ChatMessage[] = [
  // {
  //   content: "dayjs 如何使用 fromNow",
  //   createAt: 1_686_437_950_084,
  //   extra: {},
  //   id: "1",
  //   meta: {
  //     avatar: "https://avatars.githubusercontent.com/u/17870709?v=4",
  //     title: "CanisMinor",
  //   },
  //   role: "user",
  //   updateAt: 1_686_437_950_084,
  // },
  // {
  //   content:
  //     '要使用 dayjs 的 fromNow 函数，需要先安装 dayjs 库并在代码中引入它。然后，可以使用以下语法来获取当前时间与给定时间之间的相对时间：\n\n```javascript\ndayjs().fromNow(); // 获取当前时间的相对时间\ndayjs(\'2021-05-01\').fromNow(); // 获取给定时间的相对时间\n```\n\n第一个示例将返回类似于 "几秒前"、"一分钟前"、"2 天前" 的相对时间字符串，表示当前时间与调用 fromNow 方法时的时间差。第二个示例将返回给定时间与当前时间的相对时间字符串。',
  //   createAt: 1_686_538_950_084,
  //   extra: {},
  //   id: "2",
  //   meta: {
  //     avatar: "😎",
  //     backgroundColor: "#E8DA5A",
  //     title: "Advertiser",
  //   },
  //   role: "assistant",
  //   updateAt: 1_686_538_950_084,
  // },
  // ];

  return (
    <section
      className="overflow-scroll py-3"
      style={{
        height: "calc(100vh - 320px)",
      }}>
      <ChatList
        data={renderMessages}
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
