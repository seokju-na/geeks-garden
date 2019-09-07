import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { environment } from '../../core/environment';
import { themeDatabase } from '../shared/databases/theme-database';
import { OnboardingModule } from './onboarding-module';

if (environment.production) {
  enableProdMode();
}

async function bootstrap() {
  await themeDatabase.initialize();
  await platformBrowserDynamic().bootstrapModule(OnboardingModule);
}

bootstrap().catch((error) => {
  console.error(error);
});
