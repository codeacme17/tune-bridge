import { ChatOpenAI } from "@langchain/openai";

export const llm = () => {
  const init = () => {
    const model = new ChatOpenAI({
      apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
      model: "gpt-4o-mini",
    });
    return model;
  };

  return {
    init,
  };
};
