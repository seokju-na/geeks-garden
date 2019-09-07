import { InjectionToken, Provider } from '@angular/core';
import Dexie from 'dexie';
import { getElectronFeatures } from '../../../core/electron-features';
import { Themes } from '../../ui/style/theme';
import { BaseDatabase } from './base-database';

const ID = 1;
const defaultTheme = getElectronFeatures().isDarkMode()
  ? Themes.BASIC_DARK_THEME
  : Themes.BASIC_LIGHT_THEME;

interface ThemeInfo {
  id: number;
  theme: Themes;
}

export class ThemeDatabase extends BaseDatabase {
  private readonly data: Dexie.Table<ThemeInfo, number>;
  private _initialized = false;
  private _theme: Themes | null = null;

  constructor() {
    super('Theme');

    this.conditionalVersion(1, {
      data: 'id, theme',
    });
  }

  get initialized() {
    return this._initialized;
  }

  get theme() {
    return this._theme;
  }

  async initialize() {
    let info = await this.data.get(ID);

    if (!info) {
      info = {
        id: ID,
        theme: defaultTheme,
      };

      await this.data.add(info);
    }

    this._theme = info.theme;
    this._initialized = true;
  }

  async updateTheme(theme: Themes): Promise<void> {
    if (!this._initialized) {
      await this.initialize();
    }

    await this.data.update(ID, { theme });
  }
}

export const themeDatabase = new ThemeDatabase();

export const THEME_DATABASE = new InjectionToken<ThemeDatabase>('shared.ThemeDatabase');

export const ThemeDatabaseProvider: Provider = {
  provide: THEME_DATABASE,
  useValue: themeDatabase,
};
