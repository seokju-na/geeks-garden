import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { EffectsModule } from '@ngrx/effects';
import { SharedModule } from '../shared/shared-module';
import { AppComponent } from './app-component';
import { ContributionsModule } from './contributions/contributions-module';

@NgModule({
  imports: [
    BrowserModule,
    SharedModule,
    EffectsModule.forRoot([]),
    ContributionsModule,
  ],
  declarations: [
    AppComponent,
  ],
  providers: [
  ],
  bootstrap: [AppComponent],
})
export class AppModule {
}
