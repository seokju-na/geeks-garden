import { BrowserWindow, IpcMain, IpcMainEvent, IpcRenderer } from 'electron';
import { Observable, Subject } from 'rxjs';
import 'reflect-metadata';
import { getElectronFeatures } from './electron-features';

type IpcActionHandler<T, R> = (data?: T) => Promise<R>;
type IpcSyncActionHandler<T, R> = (data?: T) => R;

interface IpcAction<D> {
  name: string;
  data?: D;
  sync: boolean;
}

interface IpcAsyncActionResponse<R = any> {
  result?: R;
  error?: any;
}

function makeResponseChannelName(namespace: string, actionName: string): string {
  return `${namespace}-${actionName}-response`;
}

export interface IpcMessage<D> {
  name: string;
  data?: D;
}

const IPC_ACTION_HANDLER_METADATA_TOKEN = '__ipc_action_handler__';
const IPC_ERROR_HANDLER_METADATA_TOKEN = '__ipc_error_handler__';

interface IpcHandlerBaseMetadata {
  handlerMethodName: string;
}

interface IpcActionHandlerMetadata extends IpcHandlerBaseMetadata {
  actionName: string;
  sync: boolean;
}

interface IpcErrorHandlerMetadata extends IpcHandlerBaseMetadata {
}

/**
 * Ipc action server used in main process.
 * When action is requested, handle the action and response result or error which generated from
 * registered handlers.
 *
 * @example
 * const server = new IpcActionServer('service-id');
 *
 * server.setActionHandler<string, string>('actionA', async (data: string) => {
 *     const result = await someAsyncTask(data);
 *     return result as string;
 * });
 */
class IpcActionServerInstance {
  readonly _ipc: IpcMain;

  private readonly actionHandlers = new Map<string, IpcActionHandler<any, any>>();
  private readonly syncActionHandlers = new Map<string, IpcSyncActionHandler<any, any>>();
  private errorHandler: (error: any) => any;
  private readonly actionListener: any;

  constructor(public readonly namespace: string) {
    this._ipc = require('electron').ipcMain;

    this.actionListener = (event: any, action: IpcAction<any>) => this.handleIpcEvent(
      event,
      action,
    );
    this._ipc.on(this.namespace, this.actionListener);
  }

  destroy(): void {
    this.actionHandlers.clear();
    this._ipc.removeListener(this.namespace, this.actionListener);
  }

  setActionHandler<D, R>(actionName: string, handler: IpcActionHandler<D, R>): this {
    this.actionHandlers.set(actionName, handler);
    return this;
  }

  setSyncActionHandler<D, R>(actionName: string, handler: IpcSyncActionHandler<D, R>) {
    this.syncActionHandlers.set(actionName, handler);
    return this;
  }

  setErrorHandler(handler: (error: any) => any): this {
    this.errorHandler = handler;
    return this;
  }

  sendMessage<D>(window: BrowserWindow, message: IpcMessage<D>): void {
    window.webContents.send(this.namespace, message);
  }

  private handleIpcEvent(event: IpcMainEvent, action: IpcAction<any>): Promise<void> {
    const { name, data, sync } = action;

    const handler = sync
      ? this.syncActionHandlers.get(name)
      : this.actionHandlers.get(name);

    if (!handler) {
      if (sync) {
        throw new Error(`Cannot find sync action handler: "${this.namespace}.${name}"`);
      }
      return;
    }

    if (action.sync) {
      event.returnValue = handler(data);
    } else {
      const channel = makeResponseChannelName(this.namespace, name);

      this.executeHandler(handler, data).then(response => {
        event.sender.send(channel, response);
      });
    }
  }

  private async executeHandler(handler: IpcActionHandler<any, any>, data?: any) {
    let result = null;
    let error = null;

    try {
      result = await handler(data);
    } catch (err) {
      error = this.errorHandler ? this.errorHandler(err) : err;
    }

    return { result, error } as IpcAsyncActionResponse;
  }
}

/**
 * Decorator for create ipc action server instance.
 *
 * @example
 * @IpcActionServer('myNamespace')
 * class SomeService {
 *   ...
 *
 *   @IpcActionHandler('create')
 *   async createSomething(data?: RequestData): Promise<ResponseData> {
 *     // ...
 *   }
 * }
 */
export function IpcActionServer(namespace: string) {
  return (target: any): any => {
    return class extends target {
      protected _ipc: IpcActionServerInstance;

      constructor(...args: any[]) {
        super(...args);

        this._ipc = new IpcActionServerInstance(namespace);

        const actionHandlerMetadataList: IpcActionHandlerMetadata[] =
          Reflect.getMetadata(IPC_ACTION_HANDLER_METADATA_TOKEN, this.constructor)
          || [];

        // Register action handlers
        for (const { actionName, handlerMethodName, sync } of actionHandlerMetadataList) {
          const handler = this[handlerMethodName];

          if (handler) {
            if (sync) {
              this._ipc.setSyncActionHandler(actionName, handler.bind(this));
            } else {
              this._ipc.setActionHandler(actionName, handler.bind(this));
            }
          }
        }

        // Register error handler
        const errorHandlerMetadata = Reflect.getMetadata(
          IPC_ERROR_HANDLER_METADATA_TOKEN,
          this.constructor,
        ) as IpcErrorHandlerMetadata;

        if (errorHandlerMetadata != null) {
          const { handlerMethodName } = errorHandlerMetadata;
          const handler = this[handlerMethodName];

          if (handler) {
            this._ipc.setErrorHandler(handler.bind(this));
          }
        }
      }
    };
  };
}

interface IpcActionHandlerOptions {
  sync?: boolean;
}

/**
 * Decorator for registering action handler in specific class.
 */
export const IpcActionHandler = (
  actionName: string,
  { sync = false }: IpcActionHandlerOptions = {},
): PropertyDecorator => (target, propertyKey) => {
  const metadataList: IpcActionHandlerMetadata[] =
    Reflect.getMetadata(IPC_ACTION_HANDLER_METADATA_TOKEN, target.constructor)
    || [];

  const metadata: IpcActionHandlerMetadata = {
    actionName,
    handlerMethodName: propertyKey as string,
    sync,
  };

  Reflect.defineMetadata(
    IPC_ACTION_HANDLER_METADATA_TOKEN,
    [...metadataList, metadata],
    target.constructor,
  );
};

export const IpcErrorHandler = (): PropertyDecorator => (target, propertyKey) => {
  const metadata: IpcErrorHandlerMetadata = {
    handlerMethodName: propertyKey as string,
  };

  Reflect.defineMetadata(
    IPC_ERROR_HANDLER_METADATA_TOKEN,
    metadata,
    target.constructor,
  );
};

/**
 * Ipc action client used in renderer process.
 *
 * @example
 * const client = new IpcActionClient('service-id');
 * const asyncResult = await client.performAction<RequestData, ResponseData>('asyncAction', data);
 * const result = client.performSyncAction('syncAction', data);
 */
export class IpcActionClient {
  readonly _ipc: IpcRenderer;

  private readonly messageListener: any;
  private readonly messageStream = new Subject<IpcMessage<any>>();

  constructor(public readonly namespace: string) {
    this._ipc = getElectronFeatures().ipcRenderer;

    this.messageListener = (event: any, message: IpcMessage<any>) => this.handleIpcEvent(message);
    this._ipc.on(namespace, this.messageListener);
  }

  destroy(): void {
    this._ipc.removeListener(this.namespace, this.messageListener);
  }

  /** Send action to server which handles ipc main. */
  performAction<D, R>(actionName: string, data?: D): Promise<R> {
    return new Promise<R>((resolve, reject) => {
      const channelName = makeResponseChannelName(this.namespace, actionName);
      const action: IpcAction<D> = { name: actionName, data, sync: false };

      // Listen for response event for once.
      this._ipc.once(channelName, (event: any, response: IpcAsyncActionResponse<R>) => {
        if (response.error) {
          reject(response.error);
        } else {
          resolve(response.result);
        }
      });

      this._ipc.send(this.namespace, action);
    });
  }

  performSyncAction<D, R>(actionName: string, data?: D): R {
    const action: IpcAction<D> = { name: actionName, data, sync: true };
    return this._ipc.sendSync(this.namespace, action) as R;
  }

  onMessage<D>(): Observable<IpcMessage<D>> {
    return this.messageStream.asObservable();
  }

  private handleIpcEvent(message: IpcMessage<any>): void {
    this.messageStream.next(message);
  }
}
