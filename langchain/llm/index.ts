import { BaseCallbackHandler } from "@langchain/core/callbacks/base";
import { ChatOpenAI } from "@langchain/openai";
import { useChatStore } from "@/store";
import { KEYS } from "@/lib/constants";

export type TLlm = "openai" | "deepseek";

export interface ILlmParams {
  llm: TLlm;
  streaming?: boolean;
  callback?: any;
}

export const llm = (param: ILlmParams) => {
  const { streaming = false } = param;

  const handler = BaseCallbackHandler.fromMethods({
    handleLLMNewToken(token) {
      const { messages } = useChatStore.getState();
      const id = messages[messages.length - 1].id;
      useChatStore.getState().setMessagesWithStreaming(token, id);
    },
  });

  const init = () => {
    switch (param.llm) {
      case "openai":
        return new ChatOpenAI({
          apiKey: KEYS.OPENAI_API_KEY,
          model: "gpt-4o-mini",
          streaming,
          callbacks: [handler],
        });

      case "deepseek":
        return new ChatOpenAI(
          {
            apiKey: KEYS.DEEPSEEK_API_KEY,
            model: "deepseek-chat",
            streaming,
          },
          {
            baseURL: "https://api.deepseek.com",
          }
        );
    }
  };

  return { init };
};
