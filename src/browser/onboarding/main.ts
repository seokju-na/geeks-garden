import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { environment } from '../../core/environment';
import { OnboardingModule } from './onboarding-module';

if (environment.production) {
  enableProdMode();
}

platformBrowserDynamic()
  .bootstrapModule(OnboardingModule)
  .catch((error) => {
    console.error(error);
  });
