import { BrowserWindow, BrowserWindowConstructorOptions } from 'electron';
import { EventEmitter } from 'events';
import * as path from 'path';
import { environment } from '../../core/environment';
import { encodePathAsUrl } from '../../libs/path';

export interface WindowOptions extends BrowserWindowConstructorOptions {
  /**
   * @default true when production
   */
  disableZooming?: boolean;
}

export enum WindowEvents {
  CLOSED = 'window.closed',
}

export abstract class Window extends EventEmitter {
  readonly instance: BrowserWindow;
  readonly options: WindowOptions;
  readonly url: string;

  protected constructor(url: string, options?: WindowOptions) {
    super();

    this.url = encodePathAsUrl(__dirname, url);
    this.options = {
      disableZooming: environment.production,
      frame: false,
      webPreferences: {
        preload: path.resolve(__dirname, 'preload.js'),
      },
      ...options,
    };
    this.instance = new BrowserWindow(this.options);

    this.handleEvents();
  }

  open() {
    this.instance.loadURL(this.url);
  }

  close() {
    this.instance.close();
  }

  protected handleEvents() {
    this.instance.on('closed', () => {
      this.emit(WindowEvents.CLOSED);
    });

    this.instance.webContents.on('did-finish-load', () => {
      if (this.options.disableZooming) {
        this.instance.webContents.setVisualZoomLevelLimits(1, 1);
      }
    });

    // Hide the window when it loses focus
    // this.instance.on('blur', () => {
    //   if (!environment.production) {
    //     this.instance.hide();
    //   }
    // });
  }
}
