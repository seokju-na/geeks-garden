import { addDays, endOfMonth, startOfMonth } from 'date-fns';
import { EventEmitter } from 'events';
import {
  API_NAMESPACE,
  ApiActions,
  ApiErrorCodes,
  convertApiErrorIntoMessage,
  CreateGithubAccessTokenPayload,
  EnterExistingGithubAccessTokenPayload,
  GetStorageDataQuery,
  GetUserContributionCalendarQuery,
  isApiError,
  LogExceptionPayload,
  LogMessagePayload,
  SetStorageDataPayload,
  UserContributionCalendarResponse,
  UserResponse,
} from '../../core/api';
import { IpcActionHandler, IpcActionServer, IpcErrorHandler } from '../../core/ipc';
import { GithubErrorCodes, isGithubError } from '../remotes/github';
import { GithubService } from './github-service';
import { LogMonitorService } from './log-monitor-service';
import { StorageService } from './storage-service';
import { UserService } from './user-service';

export enum ApiServiceEvents {
  GITHUB_ACCESS_TOKEN_INJECTED = 'api.githubAccessTokenInjected',
}

@IpcActionServer(API_NAMESPACE)
export class ApiService extends EventEmitter {
  constructor(
    private readonly userService: UserService,
    private readonly githubService: GithubService,
    private readonly storageService: StorageService,
    private readonly logMonitorService: LogMonitorService,
  ) {
    super();
  }

  @IpcActionHandler(ApiActions.CREATE_GITHUB_ACCESS_TOKEN)
  async createGithubAccessToken(payload: CreateGithubAccessTokenPayload) {
    await this.githubService.createAccessToken({
      ...payload,
      scopes: ['repo:status', 'public_repo'],
      note: 'Geeks grass access token',
    });

    this.emit(ApiServiceEvents.GITHUB_ACCESS_TOKEN_INJECTED);
  }

  @IpcActionHandler(ApiActions.ENTER_EXISTING_GITHUB_ACCESS_TOKEN)
  async enterExistingGithubAccessToken(payload: EnterExistingGithubAccessTokenPayload) {
    await this.githubService.loginWithAccessToken(payload.token);
    this.emit(ApiServiceEvents.GITHUB_ACCESS_TOKEN_INJECTED);
  }

  @IpcActionHandler(ApiActions.GET_PERSISTENT_USER_AS_SYNC, { sync: true })
  getPersistentUser(): UserResponse {
    return {
      user: this.userService.getPersistentUser(),
    };
  }

  @IpcActionHandler(ApiActions.GET_STORAGE_DATA, { sync: true })
  getStorageData(query: GetStorageDataQuery) {
    return this.storageService.get<any>(query.key);
  }

  @IpcActionHandler(ApiActions.SET_STORAGE_DATA, { sync: true })
  setStorageData(payload: SetStorageDataPayload) {
    this.storageService
      .set(payload.key, payload.data)
      .save();
  }

  @IpcActionHandler(ApiActions.GET_USER_CONTRIBUTION_CALENDAR)
  async getUserContributionCalendar(
    query: GetUserContributionCalendarQuery,
  ): Promise<UserContributionCalendarResponse> {
    const { monthStr, useCacheIfExists } = query;

    const month = new Date(monthStr);
    const startDatetime = addDays(startOfMonth(month), 1).toISOString();
    const endDatetime = endOfMonth(month).toISOString();

    const calendar = await this.userService.getUserContributionCalendar(
      startDatetime,
      endDatetime,
      useCacheIfExists,
    );

    return { calendar };
  }

  @IpcActionHandler(ApiActions.LOG_MESSAGE, { sync: true })
  logMessage(payload: LogMessagePayload) {
    this.logMonitorService.logMessage(payload.message);
  }

  @IpcActionHandler(ApiActions.LOG_EXCEPTION, { sync: true })
  logException(payload: LogExceptionPayload) {
    this.logMonitorService.logException(payload.exception);
  }

  @IpcErrorHandler()
  handleError(error: unknown) {
    if (isApiError(error)) {
      return convertApiErrorIntoMessage(error);
    } else if (isGithubError(error)) {
      switch (error.code) {
        case GithubErrorCodes.REQUIRED_2FA:
          return { code: ApiErrorCodes.REQUIRED_2FA };
        case GithubErrorCodes.UNAUTHORIZED:
          return { code: ApiErrorCodes.UNAUTHORIZED };
        case GithubErrorCodes.UNHANDLED:
          return { code: ApiErrorCodes.UNHANDLED };
        case GithubErrorCodes.VALIDATION_FAILED:
          return { code: ApiErrorCodes.GITHUB_VALIDATION_FAILED };
      }
    }

    return { code: ApiErrorCodes.UNHANDLED };
  }
}
