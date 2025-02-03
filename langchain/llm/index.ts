import { KEYS } from "@/lib/constants";
import { ChatOpenAI } from "@langchain/openai";

export type TLlm = "openai" | "deepseek";

export interface ILlmParams {
  llm: TLlm;
  streaming?: boolean;
}

export const llm = (param: ILlmParams) => {
  const { streaming = false } = param;

  const init = () => {
    switch (param.llm) {
      case "openai":
        return new ChatOpenAI({
          apiKey: KEYS.OPENAI_API_KEY,
          model: "gpt-4o-mini",
          streaming,
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
