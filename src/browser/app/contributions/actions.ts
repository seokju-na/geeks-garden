import { createAction, props } from '@ngrx/store';
import { ApiError, UserContributionCalendar } from '../../../core/api';

export const getContributionCalendar = createAction(
  'app.contributionActions.getContributionCalendar',
  props<{ month: Date; useCacheIfExists?: boolean }>(),
);

export const getContributionCalendarSuccess = createAction(
  'app.contributionActions.getContributionCalendarSuccess',
  props<{ calendar: UserContributionCalendar }>(),
);

export const getContributionCalendarFailure = createAction(
  'app.contributionActions.getContributionCalendarFailure',
  props<{ error: ApiError }>(),
);

export const moveNextMonthOfContributionCalendar = createAction(
  'app.contributionActions.moveNextMonthOfContributionCalendar',
  props(),
);

export const movePreviousMonthOfContributionCalendar = createAction(
  'app.contributionActions.movePreviousMonthOfContributionCalendar',
  props(),
);

export const ContributionActions = {
  getCalendar: getContributionCalendar,
  getCalendarSuccess: getContributionCalendarSuccess,
  getCalendarFailure: getContributionCalendarFailure,
  moveNextMonth: moveNextMonthOfContributionCalendar,
  movePreviousMonth: movePreviousMonthOfContributionCalendar,
};
