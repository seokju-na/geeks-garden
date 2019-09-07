import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { SharedModule } from '../shared/shared-module';
import { OnboardingComponent } from './onboarding-component';

@NgModule({
  imports: [
    BrowserModule,
    SharedModule,
  ],
  declarations: [
    OnboardingComponent,
  ],
  bootstrap: [OnboardingComponent],
})
export class OnboardingModule {
}
