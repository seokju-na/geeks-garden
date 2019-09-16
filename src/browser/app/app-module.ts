import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { EffectsModule } from '@ngrx/effects';
import { SharedModule } from '../shared/shared-module';
import { AppComponent } from './app-component';

@NgModule({
  imports: [
    BrowserModule,
    SharedModule,
    EffectsModule.forRoot([]),
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
