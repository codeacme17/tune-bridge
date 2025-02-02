import {
  AIMessage,
  AIMessageChunk,
  BaseMessage,
  HumanMessage,
} from "@langchain/core/messages";
import {
  BaseChatModel,
  BindToolsInput,
} from "@langchain/core/language_models/chat_models";
import { ChatResult, ChatGenerationChunk } from "@langchain/core/outputs";
import { ChatOpenAICallOptions, OpenAIClient } from "@langchain/openai";
import { Runnable } from "@langchain/core/runnables";
import {
  BaseLanguageModelInput,
  isOpenAITool,
} from "@langchain/core/language_models/base";
import { _convertToOpenAITool } from "./_convertToOpenAITool";

// Define the tool interface
interface Tool {
  name: string;
  execute: (params: any) => Promise<any>;
}

type ChatOpenAIToolType = BindToolsInput | OpenAIClient.ChatCompletionTool;

interface CustomChatModelParams {
  apiUrl: string;
  apiKey: string;
  model: string;
  tools?: Tool[]; // Optional tools to invoke
}

function _convertChatOpenAIToolTypeToOpenAITool(
  tool: ChatOpenAIToolType,
  fields?: {
    strict?: boolean;
  }
): OpenAIClient.ChatCompletionTool {
  if (isOpenAITool(tool)) {
    if (fields?.strict !== undefined) {
      return {
        ...tool,
        function: {
          ...tool.function,
          strict: fields.strict,
        },
      };
    }

    return tool;
  }
  return _convertToOpenAITool(tool, fields);
}

export class DeepseekChatModel<
  CallOptions extends ChatOpenAICallOptions = ChatOpenAICallOptions
> extends BaseChatModel {
  private apiUrl: string;
  private apiKey: string;
  private model: string;
  private tools: Tool[];

  /**
   * Whether the model supports the `strict` argument when passing in tools.
   * If `undefined` the `strict` argument will not be passed to OpenAI.
   */
  supportsStrictToolCalling?: boolean;

  constructor(params: CustomChatModelParams) {
    super({});
    this.apiUrl = params.apiUrl;
    this.apiKey = params.apiKey;
    this.model = params.model;
    this.tools = params.tools || []; // Initialize tools
  }

  _llmType(): string {
    return "custom_chat_model";
  }

  override bindTools(
    tools: ChatOpenAIToolType[],
    kwargs?: Partial<CallOptions>
  ): Runnable<BaseLanguageModelInput, AIMessageChunk, CallOptions> {
    let strict: boolean | undefined;
    if (kwargs?.strict !== undefined) {
      strict = kwargs.strict;
    } else if (this.supportsStrictToolCalling !== undefined) {
      strict = this.supportsStrictToolCalling;
    }
    return this.bind({
      tools: tools.map((tool) =>
        _convertChatOpenAIToolTypeToOpenAITool(tool, { strict })
      ),
      ...kwargs,
    } as Partial<CallOptions>);
  }

  // Realize generation response
  async _generate(
    messages: BaseMessage[],
    options?: Record<string, any>
  ): Promise<ChatResult> {
    const formattedMessages = this.formatMessages(messages);

    const response = await fetch(`${this.apiUrl}/chat/completions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${this.apiKey}`,
      },
      body: JSON.stringify({
        model: this.model,
        messages: formattedMessages,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(`API Error: ${data.error}`);
    }

    // Check if we need to call a tool based on the assistant's response
    const assistantMessage = data.choices[0]?.message?.content;
    if (assistantMessage && assistantMessage.includes("tool:")) {
      const toolName = assistantMessage.split("tool:")[1].trim();
      const toolResult = await this.invokeTool(toolName, {
        // You can pass relevant parameters based on your tool logic
      });

      return {
        generations: [
          {
            text: toolResult,
            message: new AIMessage(toolResult),
          },
        ],
        llmOutput: data.usage,
      };
    }

    return {
      generations: [
        data.choices.map((choice: any) => ({
          text: choice.message.content,
          message: new AIMessage(choice.message.content),
        })),
      ],
      llmOutput: data.usage,
    };
  }

  // Realize streaming response
  async *_streamResponseChunks(
    messages: BaseMessage[],
    options?: Record<string, any>
  ): AsyncGenerator<ChatGenerationChunk> {
    const formattedMessages = this.formatMessages(messages);

    const response = await fetch(`${this.apiUrl}/chat/completions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${this.apiKey}`,
      },
      body: JSON.stringify({
        model: this.model,
        messages: formattedMessages,
        stream: true,
      }),
    });

    if (!response.ok || !response.body) {
      throw new Error("Failed to connect to stream endpoint.");
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder("utf-8");

    let done = false;
    while (!done) {
      const { value, done: readerDone } = await reader.read();
      done = readerDone;
      const chunk = decoder.decode(value);

      const lines = chunk
        .split("\n")
        .filter((line) => line.trim() && line.trim() !== "data: [DONE]")
        .map((line) => {
          if (line.startsWith("data: ")) {
            try {
              return JSON.parse(line.slice(6));
            } catch (e) {
              console.error("Failed to parse chunk line:", line, e);
              return null;
            }
          }
          return null;
        })
        .filter((parsed) => parsed !== null);

      for (const parsed of lines) {
        if (parsed.choices) {
          const delta = parsed.choices[0]?.delta;
          const content = delta?.content;

          if (content) {
            // Check for tool invocation in the streaming content
            if (content.includes("tool:")) {
              const toolName = content.split("tool:")[1].trim();
              const toolResult = await this.invokeTool(toolName, {
                // Parameters for tool execution
              });
              yield new ChatGenerationChunk({
                message: new AIMessageChunk({ content: toolResult }),
                text: toolResult,
              });
            } else {
              yield new ChatGenerationChunk({
                message: new AIMessageChunk({ content }),
                text: content,
              });
            }
          }
        }
      }
    }
  }

  // Format messages for API request
  private formatMessages(messages: BaseMessage[]) {
    return messages.map((message) => {
      if (message instanceof HumanMessage) {
        return { role: "user", content: message.text };
      } else if (message instanceof AIMessage) {
        return { role: "assistant", content: message.text };
      } else {
        return { role: "system", content: message.text };
      }
    });
  }
}
