import axios from 'axios';

export class AnalyticsService {
  private readonly WEBSITE_ID = process.env.UMAMI_WEBSITE_ID;

  private getUmamiUrl(): string {
    const rawUrl = process.env.UMAMI_API_URL || 'https://analytics.umami.is/api/send';
    // If it's a script URL, convert it to the send API endpoint
    if (rawUrl.endsWith('/script.js')) {
      return rawUrl.replace('/script.js', '/api/send');
    }
    return rawUrl;
  }

  async trackEvent(eventName: string, data: Record<string, unknown> = {}) {
    if (!this.WEBSITE_ID) {
      console.warn('UMAMI_WEBSITE_ID not set, skipping analytics');
      return;
    }

    const umamiUrl = this.getUmamiUrl();

    try {
      await axios.post(
        umamiUrl,
        {
          type: 'event',
          payload: {
            website: this.WEBSITE_ID,
            name: eventName,
            data,
            url: '/', // Context URL
            hostname: typeof window !== 'undefined' ? window.location.hostname : 'backend',
            language: 'en-US',
            screen: '1920x1080',
            title: 'GitHub Shoppers',
          },
        },
        {
          headers: {
            'User-Agent': 'GitHub-Shoppers-Backend/1.0',
          },
        }
      );
    } catch (error: any) {
      // Detailed error in development, silent in production
      if (process.env.NODE_ENV === 'development') {
        console.error('Analytics Error:', error.response?.data || error.message);
      }
    }
  }
}

export const analytics = new AnalyticsService();
