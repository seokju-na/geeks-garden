import { NgModule } from '@angular/core';
import { SharedModule } from '../../shared/shared-module';
import { ContributionCalendar } from './containers/contribution-calendar/contribution-calendar';

@NgModule({
  imports: [
    SharedModule,
  ],
  declarations: [
    ContributionCalendar,
  ],
  exports: [
  ],
})
export class ContributionsModule {
}
