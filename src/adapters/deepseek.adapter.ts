import axios, { AxiosInstance } from 'axios';
import axiosRetry from 'axios-retry';

export interface AIResponse {
  improvedTitle: string;
  improvedDescription: string;
}

export class DeepSeekAdapter {
  private readonly API_URL = 'https://api.deepseek.com/v1/chat/completions';
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: this.API_URL,
      timeout: 10000, // 10s timeout for AI generation
      headers: {
        'Authorization': process.env.DEEPSEEK_API_KEY ? `Bearer ${process.env.DEEPSEEK_API_KEY}` : undefined,
        'Content-Type': 'application/json'
      }
    });

    axiosRetry(this.client, {
      retries: 3,
      retryDelay: axiosRetry.exponentialDelay,
    });
  }

  async enhanceContent(title: string, description: string): Promise<AIResponse> {
    try {
      // Mocking response for now if no key is provided, or actual call
      if (!process.env.DEEPSEEK_API_KEY) {
          console.warn("DEEPSEEK_API_KEY not set, returning mock response");
          return {
              improvedTitle: `[AI] ${title}`,
              improvedDescription: `[AI Enhanced] ${description}`
          };
      }

      const response = await this.client.post('', {
        model: "deepseek-chat",
        messages: [
          {
            role: "system",
            content: "You are an e-commerce copywriter. Improve the product title and description. Return JSON only with keys: improvedTitle, improvedDescription."
          },
          {
            role: "user",
            content: `Title: ${title}\nDescription: ${description}`
          }
        ],
        response_format: { type: "json_object" }
      });

      const content = JSON.parse(response.data.choices[0].message.content);
      return {
        improvedTitle: content.improvedTitle || title,
        improvedDescription: content.improvedDescription || description
      };
    } catch (error) {
      console.error('DeepSeek API Error:', error);
      // Fallback to original content on error
      return { improvedTitle: title, improvedDescription: description };
    }
  }
}
