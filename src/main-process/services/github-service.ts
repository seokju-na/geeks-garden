import * as keytar from 'keytar';
import { unauthorizedApiError } from '../../core/api';
import { environment } from '../../core/environment';
import {
  createCreateGithubAccessToken,
  CreateGithubAccessTokenPayload,
  fetchGithubUser,
  fetchGithubUserContributionCalendar,
  GetGithubUserContributionCalendarQuery,
} from '../remotes/github';

const TOKEN_ACCOUNT = 'github_token';
type WithoutToken<T> = T extends { token: string } ? Omit<T, 'token'> : T;

export class GithubService {
  private keytar = keytar;

  async authorize() {
    const token = await this.getAccessToken();
    return await fetchGithubUser(token);
  }

  async loginWithAccessToken(token: string) {
    await fetchGithubUser(token);
    await this.setAccessToken(token);
  }

  async getUserContributionCalendar(query: WithoutToken<GetGithubUserContributionCalendarQuery>) {
    const token = await this.getAccessToken();
    return await fetchGithubUserContributionCalendar({ ...query, token });
  }

  async createAccessToken(payload: CreateGithubAccessTokenPayload) {
    const { token } = await createCreateGithubAccessToken(payload);
    await this.setAccessToken(token);
  }

  private async setAccessToken(token: string) {
    await this.keytar.setPassword(
      environment.serviceName,
      TOKEN_ACCOUNT,
      token,
    );
  }

  private async getAccessToken(throwIfTokenNotExists: boolean = true) {
    const token = await this.keytar.getPassword(environment.serviceName, TOKEN_ACCOUNT);

    if (token === null && throwIfTokenNotExists) {
      throw unauthorizedApiError();
    }

    return token;
  }
}
