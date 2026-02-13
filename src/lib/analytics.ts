import axios from 'axios';

export class AnalyticsService {
  private readonly UMAMI_API_URL = process.env.UMAMI_API_URL || 'https://analytics.umami.is/api/send';
  private readonly WEBSITE_ID = process.env.UMAMI_WEBSITE_ID;

  async trackEvent(eventName: string, data: Record<string, unknown> = {}) {
    if (!this.WEBSITE_ID) {
      console.warn('UMAMI_WEBSITE_ID not set, skipping analytics');
      return;
    }

    try {
      await axios.post(
        this.UMAMI_API_URL,
        {
          type: 'event',
          payload: {
            website: this.WEBSITE_ID,
            name: eventName,
            data,
            url: '/', // Default url context
          },
        },
        {
          headers: {
            'User-Agent': 'GitHub-Shoppers-Backend/1.0',
          },
        }
      );
    } catch (error) {
      console.error('Analytics Error:', error);
      // Fail silently to not disrupt business logic
    }
  }
}

export const analytics = new AnalyticsService();
