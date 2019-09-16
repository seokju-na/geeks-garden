import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CreateGithubTokenForm } from './components/create-github-token-from/create-github-token-form';
import { TokenAuthorizeForm } from './components/token-authorize-form/token-authorize-form';
import { Welcome } from './components/welcome/welcome';

const ROUTES: Routes = [
  {
    path: '',
    component: Welcome,
  },
  {
    path: 'create-github-token-form',
    component: CreateGithubTokenForm,
  },
  {
    path: 'enter-existing-github-token-form',
    component: TokenAuthorizeForm,
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(ROUTES, {
      useHash: true,
    }),
  ],
  exports: [
    RouterModule,
  ],
})
export class OnboardingRoutingModule {
}
