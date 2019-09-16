import { Window, WindowOptions } from '../interfaces/window';

interface Options extends WindowOptions {
}

export class AppWindow extends Window {
  constructor(options?: Options) {
    super('browser/app/index.html', {
      ...options,
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
