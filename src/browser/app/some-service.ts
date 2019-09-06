import { Injectable } from '@angular/core';
import { IpcActionClient } from '../../core/ipc';

@Injectable()
export class SomeService {
  private _ipc = new IpcActionClient('github');

  async hello() {
    const result = await this._ipc.performAction('a');
    console.log(result);
  }
}
