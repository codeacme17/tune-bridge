import { ChatOpenAI } from "@langchain/openai";

export type TLlm = "openai" | "deepseek";

export interface ILlmParams {
  llm: TLlm;
  streaming?: boolean;
}

const OPENAI_API_KEY = process.env.NEXT_PUBLIC_OPENAI_API_KEY;
const DEEPSEEK_API_KEY = process.env.NEXT_PUBLIC_DEEPSEEK_API_KEY;

export const llm = (param: ILlmParams) => {
  const { streaming = false } = param;

  const init = () => {
    switch (param.llm) {
      case "openai":
        return new ChatOpenAI({
          apiKey: OPENAI_API_KEY,
          model: "gpt-4o-mini",
          streaming,
        });

      case "deepseek":
        return new ChatOpenAI(
          {
            apiKey: DEEPSEEK_API_KEY,
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
