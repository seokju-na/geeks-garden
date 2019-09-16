import * as Sentry from '@sentry/electron';
import { SentryEvent } from '@sentry/electron';
import { app } from 'electron';
import { readJson, writeJson } from 'fs-extra';
import * as path from 'path';
import { from, Subject, Subscription } from 'rxjs';
import { debounceTime, switchMap } from 'rxjs/operators';
import { environment } from '../../core/environment';

interface LogMonitorState {
  enabled: boolean;
}

export class LogMonitorService {
  get installed(): boolean {
    return this._installed;
  }

  get enabled(): boolean {
    return this._enabled;
  }

  private _installed: boolean = false;
  private _enabled: boolean = false;

  readonly stateFilePath = path.resolve(
    app.getPath('userData'),
    'log-monitor-state.json',
  );

  private readonly stateSaveStream = new Subject<LogMonitorState>();
  private stateSaveSubscription = Subscription.EMPTY;

  constructor() {
    this.stateSaveSubscription = this.stateSaveStream.asObservable().pipe(
      debounceTime(50),
      switchMap(state => from(writeJson(
        this.stateFilePath,
        state,
      ))),
    ).subscribe();
  }


  logMessage(message: string) {
    if (this._installed && this._enabled) {
      Sentry.captureMessage(message);
    }
    return this;
  }

  logException(exception: any) {
    if (this._installed && this._enabled) {
      Sentry.captureException(exception);
    }
    return this;
  }

  async initialize(basePath: string) {
    if (this._installed) {
      return;
    }

    let state: LogMonitorState;

    try {
      state = await readJson(this.stateFilePath, { throws: true });
    } catch (error) {
      state = { enabled: false };
      await writeJson(this.stateFilePath, state);
    }

    this._enabled = state.enabled;

    Sentry.init({
      dsn: environment.getSentryDsn(),
      release: environment.version,
      beforeSend(event: SentryEvent): SentryEvent {
        if (event.user) {
          delete event.user.ip_address;
        }

        if (event.exception && event.exception.values) {
          event.exception.values.forEach((value) => {
            if (value.stacktrace && value.stacktrace.frames) {
              value.stacktrace.frames.forEach((frame) => {
                frame.filename = path.join('/', basePath, path.basename(frame.filename));
              });
            }
          });
        }

        return event;
      },
    });

    this._installed = true;
  }

  enable() {
    this._enabled = true;
    this.stateSaveStream.next({ enabled: true });

    return this;
  }

  disable() {
    this._enabled = false;
    this.stateSaveStream.next({ enabled: false });

    return this;
  }
}
