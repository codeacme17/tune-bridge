import {
  AIMessage,
  HumanMessage,
  BaseMessage,
} from "@langchain/core/messages";
import { BaseChatModel } from "@langchain/core/language_models/chat_models";
import { ChatResult } from "@langchain/core/outputs";

interface CustomChatModelParams {
  apiUrl: string; // 自定义聊天模型的 API 地址
  apiKey: string; // API 密钥
  model: string; // 模型类型，例如 "gpt-3"、"gpt-4"s
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

  // 实现核心逻辑：向自定义 API 发出请求并返回响应
  async _generate(
    messages: BaseMessage[],
    options?: Record<string, any>
  ): Promise<ChatResult> {
    // 将 messages 转换为字符串或其他格式
    const formattedMessages = messages.map((message) => {
      if (message instanceof HumanMessage) {
        return { role: "user", content: message.text };
      } else if (message instanceof AIMessage) {
        return { role: "assistant", content: message.text };
      } else {
        return { role: "system", content: message.text };
      }
    });

    // 调用自定义 API
    const response = await fetch(this.apiUrl + "/chat/completions", {
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

    // 返回标准化的 LLMResult
    return {
      generations: [
        data.choices.map((choice: any) => ({
          text: choice.message.content,
          message: new AIMessage(choice.message.content),
        })),
      ],
      llmOutput: data.usage, // 可选：包含 API 使用统计等信息
    };
  }

  // 必须实现 get callKeys 方法（LangChain 内部使用）
  _llmType(): string {
    return "custom_chat_model";
  }
}
