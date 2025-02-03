import { ChatPromptTemplate } from "@langchain/core/prompts";
import { ILlmParams, llm } from "./llm";
import { tools } from "./tool";
import { createToolCallingAgent } from "langchain/agents";
import { AgentExecutor } from "langchain/agents";

interface AgentParams {
  llmParams: ILlmParams;
}

export const agent = (params: AgentParams) => {
  const { llmParams } = params;

  const init = () => {
    try {
      const model = llm(llmParams).init();

      const prompt = ChatPromptTemplate.fromMessages([
        ["system", "You are a helpful assistant"],
        ["placeholder", "{chat_history}"],
        ["human", "{input}"],
        ["placeholder", "{agent_scratchpad}"],
      ]);

      const agent = createToolCallingAgent({
        llm: model,
        tools,
        prompt,
      });

      const agentExecutor = new AgentExecutor({
        agent,
        tools,
      });

      return agentExecutor;
    } catch (error) {
      console.error("agent init error ===>", error);
      throw error;
    }
  };

  return { init };
};
