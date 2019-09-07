import { Window } from '../interfaces/window';

export class OnboardingWindow extends Window {
  constructor() {
    super('browser/onboarding/index.html', {
      show: false,
    });
  }

  protected handleEvents() {
    super.handleEvents();

    this.instance.once('ready-to-show', () => {
      this.instance.show();
    });
  }
}
