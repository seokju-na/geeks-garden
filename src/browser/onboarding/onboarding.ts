import { Component } from '@angular/core';
import { ThemeService } from '../shared/services/theme-service';

@Component({
  selector: 'gg-onboarding',
  templateUrl: './onboarding.html',
  styleUrls: ['./onboarding.scss'],
})
export class Onboarding {
  constructor(private themeService: ThemeService) {
    this.themeService.initialize();
  }
}
