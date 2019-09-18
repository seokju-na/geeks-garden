import { User } from './user';

// API actions
export const API_NAMESPACE = 'geeks-grass-api';

export enum ApiActions {
  GET_PERSISTENT_USER_AS_SYNC = 'getPersistentUserAsSync',
  GET_USER_CONTRIBUTION_CALENDAR = 'getUserContributionCalendar',
  CREATE_GITHUB_ACCESS_TOKEN = 'createGithubAccessToken',
  ENTER_EXISTING_GITHUB_ACCESS_TOKEN = 'enterExistingGithubAccessToken',
  GET_STORAGE_DATA = 'getStorageData',
  SET_STORAGE_DATA = 'setStorageData',
  LOG_MESSAGE = 'logMessage',
  LOG_EXCEPTION = 'logException',
  ENABLE_LOGGING = 'enableLogging',
  DISABLE_LOGGING = 'disableLogging',
}

// Payloads and queries
export interface CreateGithubAccessTokenPayload {
  username: string;
  password: string;
  code?: string;
}

export interface EnterExistingGithubAccessTokenPayload {
  token: string;
}

export interface GetUserContributionCalendarQuery {
  monthStr: string;
  useCacheIfExists?: boolean;
}

export interface GetStorageDataQuery {
  key: string;
}

export interface SetStorageDataPayload<T = any> {
  key: string;
  data: T;
}

export interface LogMessagePayload {
  message: string;
}

export interface LogExceptionPayload {
  exception: any;
}

// Responses
export interface UserResponse {
  user: User;
}

export enum UserContributionLevel {
  NONE = 'none',
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  ULTRA_HIGH = 'ultraHigh',
}

export interface UserContributionCalendarDay {
  level: UserContributionLevel;
  count: number;
  /** Format is like: 2019-09-01 */
  dateStr: string;
  weekday: number;
}

export interface UserContributionCalendarWeek {
  days: UserContributionCalendarDay[];
}

export interface UserContributionCalendar {
  weeks: UserContributionCalendarWeek[];
  totalCount: number;
}

export interface UserContributionCalendarResponse {
  calendar: UserContributionCalendar;
}

// Errors
export enum ApiErrorCodes {
  REQUIRED_2FA = 'api.required2fa',
  UNAUTHORIZED = 'api.unauthorized',
  GITHUB_VALIDATION_FAILED = 'api.githubValidationFailed',
  UNHANDLED = 'api.unhandled',
}

export class ApiError extends Error {
  readonly name = 'ApiError';

  constructor(
    public readonly code: ApiErrorCodes,
    message: string = code,
  ) {
    super(message);
  }
}

export const unauthorizedApiError = () => new ApiError(ApiErrorCodes.UNAUTHORIZED);

export function isApiError(error: unknown): error is ApiError {
  if (error == null || typeof error !== 'object') {
    return false;
  }
  return error instanceof ApiError;
}

export function convertApiErrorIntoMessage(error: ApiError): ApiErrorMessage {
  return {
    code: error.code,
    description: error.message,
  };
}

export interface ApiErrorMessage {
  code: ApiErrorCodes;
  description?: string;
}
