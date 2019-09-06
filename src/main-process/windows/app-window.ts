import { Window } from '../interfaces/window';

export class AppWindow extends Window {
  constructor() {
    super('browser/index.html', {
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
