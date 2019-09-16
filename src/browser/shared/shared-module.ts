import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ThemeDatabaseProvider } from './databases/theme-database';
import { HiddenHeading } from './directives/hidden-heading';
import { ApiService } from './services/api-service';
import { ThemeService } from './services/theme-service';

@NgModule({
  imports: [
    CommonModule,
  ],
  providers: [
    ThemeDatabaseProvider,
    ThemeService,
    ApiService,
  ],
  declarations: [
    HiddenHeading,
  ],
  exports: [
    CommonModule,
    HiddenHeading,
  ],
})
export class SharedModule {
}
