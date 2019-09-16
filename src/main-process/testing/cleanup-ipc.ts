import { ipcMain } from 'electron';

export function cleanupIpc() {
  afterEach(() => {
    for (const name of ipcMain.eventNames()) {
      ipcMain.removeAllListeners(name as string);
    }
  });
}
