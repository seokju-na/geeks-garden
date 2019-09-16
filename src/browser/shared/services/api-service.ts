import { Injectable, NgZone } from '@angular/core';
import {
  API_NAMESPACE,
  ApiActions,
  CreateGithubAccessTokenPayload, EnterExistingGithubAccessTokenPayload,
  GetStorageDataQuery,
  GetUserContributionCalendarQuery,
  LogExceptionPayload,
  LogMessagePayload,
  SetStorageDataPayload,
  UserContributionCalendar,
} from '../../../core/api';
import { IpcActionClient } from '../../../core/ipc';
import { User } from '../../../core/user';

@Injectable()
export class ApiService {
  private readonly ipc = new IpcActionClient(API_NAMESPACE);

  constructor(private readonly ngZone: NgZone) {
  }

  getPersistentUser() {
    return this.ngZone.run(() => this.ipc.performSyncAction<void, User>(ApiActions.GET_PERSISTENT_USER_AS_SYNC));
  }

  async getContributionCalendar(query: GetUserContributionCalendarQuery) {
    return await this.ngZone.run(() =>
      this.ipc.performAction<GetUserContributionCalendarQuery, UserContributionCalendar>(
        ApiActions.GET_USER_CONTRIBUTION_CALENDAR,
        query,
      ),
    );
  }

  getStorageData<T>(key: string) {
    return this.ngZone.run(() => this.ipc.performSyncAction<GetStorageDataQuery, T | null>(
      ApiActions.GET_STORAGE_DATA,
      { key },
    ));
  }

  setStorageData<T>(key: string, data: T) {
    this.ngZone.run(() => this.ipc.performSyncAction<SetStorageDataPayload<T>, void>(
      ApiActions.SET_STORAGE_DATA,
      { key, data },
    ));
  }

  async createGithubAccessToken(payload: CreateGithubAccessTokenPayload) {
    await this.ngZone.run(() => this.ipc.performAction<CreateGithubAccessTokenPayload, void>(
      ApiActions.CREATE_GITHUB_ACCESS_TOKEN,
      payload,
    ));
  }

  async enterExistingGithubAccessToken(payload: EnterExistingGithubAccessTokenPayload) {
    await this.ngZone.run(() =>
      this.ipc.performAction<EnterExistingGithubAccessTokenPayload, void>(
        ApiActions.ENTER_EXISTING_GITHUB_ACCESS_TOKEN,
        payload,
      ),
    );
  }

  logMessage(message: string) {
    this.ngZone.run(() => this.ipc.performSyncAction<LogMessagePayload, void>(
      ApiActions.LOG_MESSAGE,
      { message },
    ));
  }

  logException(exception: any) {
    this.ngZone.run(() => this.ipc.performSyncAction<LogExceptionPayload, void>(
      ApiActions.LOG_EXCEPTION,
      { exception },
    ));
  }
}
