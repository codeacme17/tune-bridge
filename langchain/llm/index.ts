import { ChatOpenAI } from "@langchain/openai";
import { DeepseekChatModel } from "./deepseek";

export type TLlm = "openai" | "deepseek";

export interface ILlmParams {
  llm: TLlm;
}

export const llm = (param: ILlmParams) => {
  const init = () => {
    switch (param.llm) {
      case "openai":
        return new ChatOpenAI({
          apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
          model: "gpt-4o-mini",
          streaming: true,
        });

      case "deepseek":
        const model = new DeepseekChatModel({
          apiKey: process.env.NEXT_PUBLIC_DEEPSEEK_API_KEY!,
          apiUrl: "https://api.deepseek.com",
          model: "deepseek-chat",
        });
        return model;
    }
  };

  return {
    init,
  };
};
