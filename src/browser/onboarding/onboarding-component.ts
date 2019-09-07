import { Component } from '@angular/core';
import { ThemeService } from '../shared/services/theme-service';

@Component({
  selector: 'gg-onboarding',
  template: 'OnBoarding',
  styleUrls: [],
})
export class OnboardingComponent {
  constructor(private themeService: ThemeService) {
    this.themeService.initialize();
  }
}
