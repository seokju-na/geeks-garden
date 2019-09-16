import { app, systemPreferences, Tray } from 'electron';
import { __DARWIN__ } from '../libs/platform';
import { DARK_BACKGROUND_COLOR, LIGHT_BACKGROUND_COLOR } from './constants/background-colors';
import { Window, WindowEvents } from './interfaces/window';
import { ApiService, ApiServiceEvents } from './services/api-service';
import { GithubService } from './services/github-service';
import { LogMonitorService } from './services/log-monitor-service';
import { StorageService } from './services/storage-service';
import { UserService } from './services/user-service';
import { AppWindow } from './windows/app-window';
import { OnboardingWindow } from './windows/onboarding-window';

class GeeksGrass {
  preventQuit: boolean = false;

  // Tray
  private tray: Tray;

  // Windows
  private readonly windows: Window[] = [];
  private currentOpenWindow: Window | null = null;

  // Services
  private githubService: GithubService;
  private userService: UserService;
  private apiService: ApiService;
  private storageService: StorageService;
  private logMonitorService: LogMonitorService;

  async run() {
    this.githubService = new GithubService();
    this.userService = new UserService(this.githubService);
    this.storageService = new StorageService();
    this.logMonitorService = new LogMonitorService();
    this.apiService = new ApiService(this.userService, this.githubService, this.storageService, this.logMonitorService);

    await Promise.all([
      this.userService.initialize(),
      this.storageService.initialize(),
      this.logMonitorService.initialize('geeks-grass'),
    ]);

    this.handleEvents();
    this.openDefaultWindow();

    // this.tray = new Tray(getAssetPath('tray-images/logoTemplate.png'));
  }

  openDefaultWindow() {
    if (this.userService.isUserExists()) {
      this.openWindow('app');
    } else {
      this.openWindow('onboarding');
    }
  }

  openWindow(name: 'app' | 'onboarding') {
    let win: Window;
    let backgroundColor = this.storageService.get<string>('backgroundColor');

    if (backgroundColor === null) {
      backgroundColor = systemPreferences.isDarkMode()
        ? DARK_BACKGROUND_COLOR
        : LIGHT_BACKGROUND_COLOR;
    }

    switch (name) {
      case 'app':
        win = new AppWindow({ backgroundColor });
        break;
      case 'onboarding':
        win = new OnboardingWindow({ backgroundColor });
        break;
      default:
        throw new Error();
    }

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

    if (index > -1) {
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

    this.apiService.once(ApiServiceEvents.GITHUB_ACCESS_TOKEN_INJECTED, async () => {
      await this.userService.initialize();

      this.closeCurrentWindow();
      this.openDefaultWindow();
    });

    /** Prevent links or window.open from opening new windows. */
    app.on('web-contents-created', (_, contents) => {
      contents.on('new-window', (event) => {
        event.preventDefault();
      });
    });
  }
}

export const geeksGrass = new GeeksGrass();
