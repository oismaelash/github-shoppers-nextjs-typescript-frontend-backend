import axios, { AxiosInstance } from 'axios';

export class ShareContentAdapter {
  private readonly API_URL = 'https://api.sharecontent.com/v1/shorten';
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: this.API_URL,
      timeout: 5000,
      headers: {
        'Authorization': process.env.SHARE_CONTENT_API_KEY ? `Bearer ${process.env.SHARE_CONTENT_API_KEY}` : undefined,
        'Content-Type': 'application/json'
      }
    });
  }

  async generateShareLink(itemUrl: string): Promise<string | null> {
    try {
      if (!process.env.SHARE_CONTENT_API_KEY) {
        console.warn("SHARE_CONTENT_API_KEY not set, skipping share link generation");
        // Mock behavior for dev: return a fake short link
        return `https://share.me/${Math.random().toString(36).substring(7)}`;
      }

      const response = await this.client.post('', {
        url: itemUrl
      });

      return response.data.shortUrl;
    } catch (error) {
      console.error('ShareContent API Error:', error);
      return null;
    }
  }
}
