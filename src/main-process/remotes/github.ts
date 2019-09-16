import axios, { AxiosError } from 'axios';
import { ClientError as GraphqlError, GraphQLClient } from 'graphql-request';
import { environment } from '../../core/environment';
import { makeBasicAuthHeader, makeTokenAuthHeader } from '../../libs/auth-headers';

// Constants
const HTTP_API_URL = 'https://api.github.com';
const GRAPHQL_API_URL = 'https://api.github.com/graphql';

const commonHeaders = {
  'user-agent': environment.serviceName,
};

const httpClient = axios.create({
  baseURL: HTTP_API_URL,
  headers: {
    ...commonHeaders,
    accept: 'application/vnd.github.v3+json',
  },
});

const createGraphqlClient = (token?: string) => {
  const client = new GraphQLClient(GRAPHQL_API_URL, {
    headers: commonHeaders,
  });

  if (token) {
    client.setHeader('authorization', makeTokenAuthHeader(token));
  }

  return client;
};

// Payloads and queries
export interface CreateGithubAccessTokenPayload {
  username: string;
  password: string;
  /** 2fa code */
  code?: string;
  scopes: string[];
  note: string;
}

export interface GetGithubUserContributionCalendarQuery {
  username: string;
  startDatetime: string;
  endDatetime: string;
  token: string;
}

export interface GetGithubAuthorizationInfoQuery {
  clientId: string;
  accessToken: string;
}

// Github api interfaces
export interface GithubAccessTokenCreatedResponse {
  url: string;
  token: string;
}

export interface GithubUserResponse {
  /** Username */
  login: string;
  avatar_url: string;
  html_url: string;
  /** Display name */
  name: string;
  email: string;
}

interface GithubContributionCalendarDay {
  color: string;
  contributionCount: number;
  /** e.g. 2019-04-01 */
  date: string;
  /** A number representing which day of the week this square represents, e.g., 1 is Monday. */
  weekday: number;
}

interface GithubContributionCalendarWeek {
  firstDay: string;
  contributionDays: GithubContributionCalendarDay[];
}

export interface GithubContributionCalendarResponse {
  /**
   * A list of hex color codes used in this calendar. The darker the color, the more contributions
   * it represents.
   */
  colors: string[];
  weeks: GithubContributionCalendarWeek[];
  totalContributions: number;
}

// Github api errors
export enum GithubErrorCodes {
  REQUIRED_2FA = 'github.2faRequired',
  UNAUTHORIZED = 'github.unauthorized',
  VALIDATION_FAILED = 'github.validationFailed',
  UNHANDLED = 'github.unhandled',
}

export class GithubError extends Error {
  readonly name = 'GithubError';

  constructor(
    public readonly code: GithubErrorCodes,
    message: string = code,
  ) {
    super(message);
  }
}

const messageRegExps = {
  required2fa: [/Must specify two-factor authentication OTP code\./],
  unauthorized: [
    /Bad credentials/,
    /This endpoint requires you to be authenticated\./,
  ],
  validationFailed: [/Validation Failed/],
};

const testMultipleRegExps = (message: string, regExps: RegExp[]) =>
  regExps.some(regExp => regExp.test(message));

export function matchErrorCode(status: number, message: string) {
  if (status === 401) {
    if (testMultipleRegExps(message, messageRegExps.required2fa)) {
      return GithubErrorCodes.REQUIRED_2FA;
    } else if (testMultipleRegExps(message, messageRegExps.unauthorized)) {
      return GithubErrorCodes.UNAUTHORIZED;
    }
  } else if (status === 422) {
    if (testMultipleRegExps(message, messageRegExps.validationFailed)) {
      return GithubErrorCodes.VALIDATION_FAILED;
    }
  }

  return GithubErrorCodes.UNHANDLED;
}

export function isGithubError(error: unknown): error is GithubError {
  if (error == null || typeof error !== 'object') {
    return false;
  }
  return error instanceof GithubError;
}

// Functions
export async function fetchGithubUser(token: string) {
  try {
    const { data: user } = await httpClient.get<GithubUserResponse>('/user', {
      headers: {
        authorization: makeTokenAuthHeader(token),
      },
    });

    return user;
  } catch (error) {
    throw new GithubError(GithubErrorCodes.UNAUTHORIZED);
  }
}

export async function createCreateGithubAccessToken(payload: CreateGithubAccessTokenPayload) {
  const { username, password, code, scopes, note } = payload;
  const headers = {
    Authorization: makeBasicAuthHeader(username, password),
  };

  if (code) {
    headers['X-GitHub-OTP'] = code;
  }

  try {
    const { data } = await httpClient.post<GithubAccessTokenCreatedResponse>(
      '/authorizations',
      { scopes, note },
      { headers },
    );

    return data;
  } catch (error) {
    throw convertHttpErrorIntoGithubError(error);
  }
}

export async function fetchGithubUserContributionCalendar(query: GetGithubUserContributionCalendarQuery) {
  const { username, startDatetime, endDatetime, token } = query;
  const client = await createGraphqlClient(token);

  try {
    const scheme = `
    query getUserContributionCalendar($username: String!, $from: DateTime!, $to: DateTime!) {
        user(login: $username) {
          contributionsCollection(from: $from, to: $to) {
            contributionCalendar {
              colors,
              totalContributions,
              weeks {
                firstDay,
                contributionDays {
                  color,
                  contributionCount,
                  date,
                  weekday
                }
              }
            }
          }
        }
      }
    `;

    const data = await client.request<{
      user: {
        contributionsCollection: {
          contributionCalendar: GithubContributionCalendarResponse;
        };
      };
    }>(scheme, { username, from: startDatetime, to: endDatetime });

    return data.user.contributionsCollection.contributionCalendar;
  } catch (error) {
    throw convertGraphqlErrorIntoGithubError(error);
  }
}

function convertHttpErrorIntoGithubError(error: AxiosError) {
  const { response } = error;

  if (!(response && response.data)) {
    return new GithubError(GithubErrorCodes.UNHANDLED);
  }

  const { data = {}, status } = response;
  const { message = '' } = data as { message?: string };

  return new GithubError(matchErrorCode(status, message));
}

function convertGraphqlErrorIntoGithubError(error: GraphqlError) {
  const { response } = error;

  if (!response.message) {
    return new GithubError(GithubErrorCodes.UNHANDLED);
  }

  const { status, message = '' } = response;

  return new GithubError(matchErrorCode(status, message));
}
