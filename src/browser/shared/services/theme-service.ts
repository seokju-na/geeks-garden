import { Inject, Injectable, OnDestroy } from '@angular/core';
import { from, Subject, Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged, switchMap, tap } from 'rxjs/operators';
import { Themes } from '../../ui/style/theme';
import { THEME_DATABASE, ThemeDatabase } from '../databases/theme-database';

@Injectable()
export class ThemeService implements OnDestroy {
  private setThemes = new Subject<Themes>();
  private readonly setThemeSubscription: Subscription;
  private _currentTheme: Themes | null = null;

  constructor(@Inject(THEME_DATABASE) private themeDatabase: ThemeDatabase) {
    this.setThemeSubscription = this.setThemes.asObservable().pipe(
      distinctUntilChanged(),
      debounceTime(50),
      tap(theme => this.applyThemeToHtml(theme)),
      switchMap(theme => from(this.themeDatabase.updateTheme(theme))),
    ).subscribe();
  }

  get currentTheme() {
    return this._currentTheme;
  }

  initialize() {
    const theme = this.themeDatabase.theme!;

    this.applyThemeToHtml(theme);
    this.setTheme(theme);
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
}
