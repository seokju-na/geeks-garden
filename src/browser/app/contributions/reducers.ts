import { createReducer, on } from '@ngrx/store';
import { addMonths, subMonths } from 'date-fns';
import { UserContributionCalendar } from '../../../core/api';
import { isNextMonth } from '../../utils/calendar';
import { ContributionActions } from './actions';

export interface ContributionState {
  fetchingCalendar: boolean;
  calendar: UserContributionCalendar | null;
  month: Date;
}

export function createInitialContributionState(): ContributionState {
  return {
    fetchingCalendar: false,
    calendar: null,
    month: new Date(),
  };
}

export const contributionReducer = createReducer(
  createInitialContributionState(),
  on(ContributionActions.getCalendar, state => ({
    ...state,
    fetchingCalendar: true,
  })),
  on(ContributionActions.getCalendarSuccess, (state, { calendar }) => ({
    ...state,
    fetchingCalendar: false,
    calendar,
  })),
  on(ContributionActions.getCalendarFailure, state => ({
    ...state,
    fetchingCalendar: false,
  })),
  on(ContributionActions.moveNextMonth, state => {
    const nextMonth = addMonths(state.month, 1);

    // Can navigate to future.
    if (isNextMonth(nextMonth)) {
      return state;
    }

    return {
      ...state,
      month: nextMonth,
    };
  }),
  on(ContributionActions.movePreviousMonth, state => ({
    ...state,
    month: subMonths(state.month, 1),
  })),
);

export interface FeatureState {
  contributions: ContributionState;
}
