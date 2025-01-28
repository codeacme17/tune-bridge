import {
  AIMessage,
  AIMessageChunk,
  BaseMessage,
  HumanMessage,
} from "@langchain/core/messages";
import { BaseChatModel } from "@langchain/core/language_models/chat_models";
import {
  ChatResult,
  ChatGenerationChunk,
} from "@langchain/core/outputs";

interface CustomChatModelParams {
  apiUrl: string;
  apiKey: string;
  model: string;
}

export class DeepseekChatModel extends BaseChatModel {
  private apiUrl: string;
  private apiKey: string;
  private model: string;

  constructor(params: CustomChatModelParams) {
    super({});
    this.apiUrl = params.apiUrl;
    this.apiKey = params.apiKey;
    this.model = params.model;
  }

  _llmType(): string {
    return "custom_chat_model";
  }

  // Realize generation response
  async _generate(
    messages: BaseMessage[],
    options?: Record<string, any>
  ): Promise<ChatResult> {
    const formattedMessages = messages.map((message) => {
      if (message instanceof HumanMessage) {
        return { role: "user", content: message.text };
      } else if (message instanceof AIMessage) {
        return { role: "assistant", content: message.text };
      } else {
        return { role: "system", content: message.text };
      }
    });

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
    const formattedMessages = messages.map((message) => {
      if (message instanceof HumanMessage) {
        return { role: "user", content: message.text };
      } else if (message instanceof AIMessage) {
        return { role: "assistant", content: message.text };
      } else {
        return { role: "system", content: message.text };
      }
    });

    const response = await fetch(`${this.apiUrl}/chat/completions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${this.apiKey}`,
      },
      body: JSON.stringify({
        model: this.model,
        messages: formattedMessages,
        stream: true, // trigger streaming model
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

      // Split the chunk into individual JSON objects
      const parsedChunks = chunk
        .split("\n")
        .filter((line) => line.trim())
        .map((line) => JSON.parse(line));

      for (const parsed of parsedChunks) {
        if (parsed.choices) {
          const content = parsed.choices[0]?.delta?.content;
          if (content) {
            yield new ChatGenerationChunk({
              message: new AIMessageChunk({
                content,
              }),
              text: content,
            });
          }
        }
      }
    }
  }
}
