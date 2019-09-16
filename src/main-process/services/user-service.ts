import {
  unauthorizedApiError,
  UserContributionCalendar,
  UserContributionCalendarWeek,
  UserContributionLevel,
} from '../../core/api';
import { User } from '../../core/user';
import { GithubContributionCalendarResponse, GithubUserResponse } from '../remotes/github';
import { GithubService } from './github-service';

export class UserService {
  private user: User | null = null;
  private readonly contributionCalendarCache = new Map<string, UserContributionCalendar>();

  constructor(private readonly github: GithubService) {
  }

  isUserExists() {
    return this.user !== null;
  }

  async initialize() {
    if (this.user !== null) {
      return;
    }

    try {
      const githubUser = await this.github.authorize();

      this.user = this.createUserFromGithubUser(githubUser);
    } catch {
      this.user = null;
    }
  }

  getPersistentUser() {
    return this.user;
  }

  async getUserContributionCalendar(
    startDatetime: string,
    endDatetime: string,
    useCacheIfExists?: boolean,
  ) {
    const key = `${startDatetime}:${endDatetime}`;

    if (this.contributionCalendarCache.has(key) && useCacheIfExists) {
      return this.contributionCalendarCache.get(key)!;
    }

    if (this.user === null) {
      throw unauthorizedApiError();
    }

    const { username } = this.user;
    const response = await this.github.getUserContributionCalendar({
      username,
      startDatetime,
      endDatetime,
    });

    const calendar = this.parseUserContributionCalendar(response);
    this.contributionCalendarCache.set(key, calendar);

    return calendar;
  }

  private createUserFromGithubUser(response: GithubUserResponse): User {
    return {
      username: response.login,
      email: response.email,
      displayName: response.name,
      profileUrl: response.html_url,
      profileImage: response.avatar_url,
    };
  }

  private parseUserContributionCalendar(
    response: GithubContributionCalendarResponse,
  ): UserContributionCalendar {
    const colors = response.colors;
    const calendar: UserContributionCalendar = {
      totalCount: response.totalContributions,
      weeks: [],
    };

    for (const { contributionDays } of response.weeks) {
      const week: UserContributionCalendarWeek = {
        days: [],
      };

      for (const { color, contributionCount, weekday, date } of contributionDays) {
        week.days.push({
          level: this.getContributionLevelFromColor(colors, color),
          count: contributionCount,
          dateStr: date,
          weekday,
        });
      }

      calendar.weeks.push(week);
    }

    return calendar;
  }

  private getContributionLevelFromColor(colors: string[], targetColor: string) {
    const index = colors.indexOf(targetColor);

    // colors are sorted.
    switch (index) {
      case 0:
        return UserContributionLevel.LOW;
      case 1:
        return UserContributionLevel.MEDIUM;
      case 2:
        return UserContributionLevel.HIGH;
      case 3:
        return UserContributionLevel.ULTRA_HIGH;
      default:
        return UserContributionLevel.NONE;
    }
  }
}
