import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Subscription } from 'rxjs';
import { ApiService } from '../../../shared/services/api-service';
import { ThemeService } from '../../../shared/services/theme-service';
import { Themes } from '../../../ui/style/theme';

@Component({
  selector: 'gg-welcome',
  templateUrl: './welcome.html',
  styleUrls: ['./welcome.scss'],
})
export class Welcome implements OnInit, OnDestroy {
  readonly themeFormValue = new FormControl(
    this.themeService.currentTheme,
  );
  readonly allowLoggingFormValue = new FormControl(false);

  readonly themeOptions = [
    { value: Themes.BASIC_LIGHT_THEME, icon: 'sun-fill' },
    { value: Themes.BASIC_DARK_THEME, icon: 'moon-fill' },
  ];

  private themeFormValueChangesSubscription = Subscription.EMPTY;
  private allowLoggingFormValueChangesSubscription = Subscription.EMPTY;

  constructor(
    private readonly themeService: ThemeService,
    private readonly apiService: ApiService,
  ) {
  }

  ngOnInit(): void {
    this.themeFormValueChangesSubscription =
      this.themeFormValue.valueChanges.subscribe((value) => {
        this.themeService.setTheme(value as Themes);
      });

    this.allowLoggingFormValueChangesSubscription =
      this.allowLoggingFormValue.valueChanges.subscribe((enabled) => {
        if (enabled) {
          this.apiService.enableLogging();
        } else {
          this.apiService.disableLogging();
        }
      });
  }

  ngOnDestroy(): void {
    this.themeFormValueChangesSubscription.unsubscribe();
    this.allowLoggingFormValueChangesSubscription.unsubscribe();
  }
}
