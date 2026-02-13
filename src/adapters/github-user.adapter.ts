import axios, { AxiosInstance } from 'axios';
import axiosRetry from 'axios-retry';

export interface GitHubUser {
  login: string;
  id: number;
  avatar_url: string;
}

export class GitHubUserAdapter {
  private readonly API_URL = 'https://api.github.com/users';
  private client: AxiosInstance;

  constructor() {
    this.client = axios.create({
      baseURL: this.API_URL,
      timeout: 5000,
      headers: {
        'Authorization': process.env.GITHUB_TOKEN ? `token ${process.env.GITHUB_TOKEN}` : undefined
      }
    });

    // Configure retry logic
    axiosRetry(this.client, {
      retries: 3,
      retryDelay: axiosRetry.exponentialDelay,
      retryCondition: (error) => {
        // Retry on network errors or 5xx status codes
        return axiosRetry.isNetworkOrIdempotentRequestError(error) || 
               (error.response?.status ? error.response.status >= 500 : false);
      }
    });
  }

  async getRandomUser(): Promise<GitHubUser> {
    try {
      // Fetch a list of users (since we can't easily get a truly random single user)
      // We use a random offset to simulate randomness
      const randomOffset = Math.floor(Math.random() * 1000);
      const response = await this.client.get<GitHubUser[]>('', {
        params: {
          since: randomOffset,
          per_page: 1
        }
      });

      if (!response.data || response.data.length === 0) {
        throw new Error('No GitHub users found');
      }

      return response.data[0];
    } catch (error) {
      console.error('GitHub API Error:', error);
      throw new Error('Failed to fetch GitHub user');
    }
  }
}
