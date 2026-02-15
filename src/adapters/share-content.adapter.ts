import ShareContent from '@sharecontent/sdk';

export class ShareContentAdapter {
  private client: ShareContent;

  constructor() {
    this.client = new ShareContent({
      token: process.env.SHARE_CONTENT_API_KEY || '',
    });
  }

  async generateShareLink(itemUrl: string): Promise<string | null> {
    try {
      if (!process.env.SHARE_CONTENT_API_KEY) {
        console.warn("SHARE_CONTENT_API_KEY not set, skipping share link generation");
        // Mock behavior for dev: return a fake short link
        return `https://share.me/${Math.random().toString(36).substring(7)}`;
      }

      const response = await this.client.shortLinks.create({
        url: itemUrl,
      });

      return response.short_url || null;
    } catch (error) {
      console.error('ShareContent SDK Error:', error);
      return null;
    }
  }
}
