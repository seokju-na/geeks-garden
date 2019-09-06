import { app } from 'electron';
import { __DARWIN__ } from '../libs/platform';
import { Window, WindowEvents } from './interfaces/window';
import { GithubService } from './services/github-service';
import { AppWindow } from './windows/app-window';

class AppDelegate {
  preventQuit: boolean = false;

  private readonly windows: Window[] = [];
  private currentOpenWindow: Window | null = null;
  private github: GithubService;

  run() {
    this.github = new GithubService();

    this.handleEvents();
    this.openDefaultWindow();
  }

  openDefaultWindow() {
    const win = new AppWindow();

    win.on(WindowEvents.CLOSED, () => this.removeWindow(win));
    win.open();

    this.currentOpenWindow = win;
    this.windows.push(win);
  }

  closeCurrentWindow() {
    if (this.currentOpenWindow !== null) {
      this.currentOpenWindow.close();
    }
  }

  private removeWindow(win: Window) {
    if (win === this.currentOpenWindow) {
      this.currentOpenWindow = null;
    }

    const index = this.windows.indexOf(win);

    if (index > - 1) {
      this.windows.splice(index, 1);
    }
  }

  private handleEvents() {
    app.on('activate', (event, hasVisibleWindow) => {
      if (!hasVisibleWindow) {
        this.openDefaultWindow();
      }
    });

    app.on('window-all-closed', () => {
      if (!__DARWIN__ && !this.preventQuit) {
        app.quit();
      }
    });

    /** Prevent links or window.open from opening new windows. */
    app.on('web-contents-created', (_, contents) => {
      contents.on('new-window', (event) => {
        event.preventDefault();
      });
    });
  }
}

export const appDelegate = new AppDelegate();
