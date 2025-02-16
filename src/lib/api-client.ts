// 定义接口类型
interface ChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

interface ChatCompletionChunk {
  choices: {
    delta: {
      content?: string;
    };
  }[];
}

// 创建自定义的 API 客户端
class ApiClient {
  private baseURL: string;
  private apiKey: string;

  constructor() {
    this.baseURL = 'https://api.siliconflow.cn/v1';
    this.apiKey = import.meta.env.VITE_SILICONCLOUD_API_KEY || '';
  }

  async createChatCompletion(messages: ChatMessage[], model?: string, signal?: AbortSignal) {
    // 确保消息历史不超过合理长度，这里取最近10条
    const recentMessages = messages.slice(-10);

    const response = await fetch(`${this.baseURL}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.apiKey}`,
      },
      body: JSON.stringify({
        model: model || 'deepseek-ai/DeepSeek-R1-Distill-Qwen-7B',
        messages: recentMessages, // 传入最近的消息历史
        stream: true,
      }),
      signal,
    });

    if (!response.ok) {
      throw new Error(`API request failed: ${response.statusText}`);
    }

    if (!response.body) {
      throw new Error('Response body is null');
    }

    const reader = response.body.getReader();
    const decoder = new TextDecoder();

    return {
      async* [Symbol.asyncIterator]() {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const chunk = decoder.decode(value);
          const lines = chunk
            .split('\n')
            .filter(line => line.trim() && line.trim() !== 'data: [DONE]');

          for (const line of lines) {
            if (line.startsWith('data: ')) {
              try {
                const json = JSON.parse(line.slice(6)) as ChatCompletionChunk;
                yield json;
              } catch (e) {
                console.error('Error parsing JSON:', e);
              }
            }
          }
        }
      }
    };
  }
}

export const apiClient = new ApiClient(); 