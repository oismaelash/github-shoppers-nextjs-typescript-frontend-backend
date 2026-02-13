import axios from 'axios';

export interface GitHubUser {
  login: string;
  id: number;
  avatar_url: string;
}

export class GitHubUserAdapter {
  private readonly API_URL = 'https://api.github.com/users';

  async getRandomUser(): Promise<GitHubUser> {
    try {
      // Fetch a list of users (since we can't easily get a truly random single user)
      // We use a random offset to simulate randomness
      const randomOffset = Math.floor(Math.random() * 1000);
      const response = await axios.get<GitHubUser[]>(this.API_URL, {
        params: {
          since: randomOffset,
          per_page: 1
        },
        timeout: 5000, // 5s timeout
        headers: {
            'Authorization': process.env.GITHUB_TOKEN ? `token ${process.env.GITHUB_TOKEN}` : undefined
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
