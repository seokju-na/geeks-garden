import { Injectable, OnDestroy } from '@angular/core';
import { Subject, Subscription } from 'rxjs';
import { distinctUntilChanged, tap } from 'rxjs/operators';
import { getElectronFeatures } from '../../../core/electron-features';
import { DARK_BACKGROUND_COLOR, LIGHT_BACKGROUND_COLOR } from '../../../main-process/constants/background-colors';
import { Themes } from '../../ui/style/theme';
import { ApiService } from './api-service';

@Injectable()
export class ThemeService implements OnDestroy {
  private setThemes = new Subject<Themes>();
  private readonly setThemeSubscription: Subscription;
  private _currentTheme: Themes | null = null;

  constructor(private readonly api: ApiService) {
    this.setThemeSubscription = this.setThemes.asObservable().pipe(
      distinctUntilChanged(),
      tap(theme => {
        this.api.setStorageData('theme', theme);
        this.api.setStorageData('backgroundColor', this.getBackgroundColorByTheme(theme));

        this.applyThemeToHtml(theme);
      }),
    ).subscribe();

    this.initialize();
  }

  get currentTheme() {
    return this._currentTheme;
  }

  setTheme(theme: Themes) {
    this.setThemes.next(theme);
  }

  ngOnDestroy() {
    this.setThemeSubscription.unsubscribe();
  }

  applyThemeToHtml(theme: Themes) {
    const elem: HTMLElement = document.getElementsByTagName('html')[0];

    if (this._currentTheme && elem.classList.contains(this._currentTheme)) {
      elem.classList.remove(this._currentTheme);
    }

    this._currentTheme = theme;
    elem.classList.add(this._currentTheme);
  }

  private initialize() {
    let theme = this.api.getStorageData<Themes>('theme');

    if (theme == null) {
      theme = this.getDefaultTheme();
    }

    this.applyThemeToHtml(theme);
    this.setTheme(theme);
  }

  private getBackgroundColorByTheme(theme: Themes) {
    switch (theme) {
      case Themes.BASIC_LIGHT_THEME:
        return LIGHT_BACKGROUND_COLOR;
      case Themes.BASIC_DARK_THEME:
        return DARK_BACKGROUND_COLOR;
    }
  }

  private getDefaultTheme() {
    return getElectronFeatures().isDarkMode()
      ? Themes.BASIC_DARK_THEME
      : Themes.BASIC_LIGHT_THEME;
  }
}
