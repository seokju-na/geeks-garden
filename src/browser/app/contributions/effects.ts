import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { from, of } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';
import { ApiService } from '../../shared/services/api-service';
import { ContributionActions } from './actions';

@Injectable()
export class ContributionEffects {
  getContributionCalendar = createEffect(() => this.actions.pipe(
    ofType(ContributionActions.getCalendar),
    switchMap(action =>
      from(this.api.getContributionCalendar({ monthStr: action.month.toString() })).pipe(
        map(calendar => ContributionActions.getCalendarSuccess({ calendar })),
        catchError(error => of(ContributionActions.getCalendarFailure({ error }))),
      ),
    ),
  ));

  constructor(
    private readonly actions: Actions,
    private readonly api: ApiService,
  ) {
  }
}
