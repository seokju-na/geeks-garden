import { Location, LocationStrategy, PathLocationStrategy } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'gg-onboarding-navigator',
  templateUrl: './onboarding-navigator.html',
  styleUrls: ['./onboarding-navigator.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
  providers: [
    Location,
    {
      provide: LocationStrategy,
      useClass: PathLocationStrategy,
    },
  ],
  host: {
    class: 'OnboardingNavigator',
    role: 'navigation',
    '[attr.aria-labelledby]': 'headingId',
  },
})
export class OnboardingNavigator {
  readonly headingId = 'onboarding-navigator-heading';

  @Input() title: string;

  constructor(private readonly location: Location) {
  }

  goBack() {
    this.location.back();
  }
}
