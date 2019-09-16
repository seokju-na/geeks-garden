import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { SharedModule } from '../shared/shared-module';
import { UiModule } from '../ui/ui-module';
import { CreateGithubTokenForm } from './components/create-github-token-from/create-github-token-form';
import { OnboardingNavigator } from './components/onboarding-navigator/onboarding-navigator';
import { TokenAuthorizeForm } from './components/token-authorize-form/token-authorize-form';
import { Welcome } from './components/welcome/welcome';
import { Onboarding } from './onboarding';
import { OnboardingRoutingModule } from './onboarding-routing-module';

@NgModule({
  imports: [
    BrowserModule,
    SharedModule,
    UiModule,
    OnboardingRoutingModule,
  ],
  declarations: [
    Onboarding,
    Welcome,
    CreateGithubTokenForm,
    OnboardingNavigator,
    TokenAuthorizeForm,
  ],
  bootstrap: [Onboarding],
})
export class OnboardingModule {
}
