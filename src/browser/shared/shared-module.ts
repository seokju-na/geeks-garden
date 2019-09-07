import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ThemeDatabaseProvider } from './databases/theme-database';
import { ThemeService } from './services/theme-service';

@NgModule({
  imports: [
    CommonModule,
  ],
  providers: [
    ThemeDatabaseProvider,
    ThemeService,
  ],
  exports: [
    CommonModule,
  ],
})
export class SharedModule {
}
