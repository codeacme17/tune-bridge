import { BaseCallbackHandler } from "@langchain/core/callbacks/base";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { createToolCallingAgent, AgentExecutor } from "langchain/agents";
import { ILlmParams, llm } from "./llm";
import { tools } from "./tool";
import { useChatStore } from "@/store";

interface AgentParams {
  llmParams: ILlmParams;
}

export const agent = (params: AgentParams) => {
  const { llmParams } = params;

  const handler = BaseCallbackHandler.fromMethods({
    handleAgentAction(action) {
      const { log } = action;
      const { setMessagesWithStreaming, messages } = useChatStore.getState();
      setMessagesWithStreaming(`> ${log} \n`, messages[messages.length - 1].id);
    },
  });

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
        streamRunnable: llmParams.streaming,
      });

      const agentExecutor = new AgentExecutor({
        agent,
        tools,
        callbacks: [handler],
        verbose: true,
      });

      return agentExecutor;
    } catch (error) {
      console.error("agent init error ===>", error);
      throw error;
    }
  };

  return { init };
};
