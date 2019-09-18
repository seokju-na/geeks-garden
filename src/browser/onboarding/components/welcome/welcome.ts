import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Subscription } from 'rxjs';
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

  readonly themeOptions = [
    { value: Themes.BASIC_LIGHT_THEME, icon: 'sun-fill' },
    { value: Themes.BASIC_DARK_THEME, icon: 'moon-fill' },
  ];

  private themeFormValueChangesSubscription = Subscription.EMPTY;

  constructor(private readonly themeService: ThemeService) {
  }

  ngOnInit(): void {
    this.themeFormValueChangesSubscription =
      this.themeFormValue.valueChanges.subscribe((value) => {
        this.themeService.setTheme(value as Themes);
      });
  }

  ngOnDestroy(): void {
    this.themeFormValueChangesSubscription.unsubscribe();
  }
}
