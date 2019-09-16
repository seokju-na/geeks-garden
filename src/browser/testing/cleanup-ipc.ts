import { getElectronFeatures } from '../../core/electron-features';

export function cleanupIpc() {
  afterEach(() => {
    const { ipcRenderer } = getElectronFeatures();

    for (const name of ipcRenderer.eventNames()) {
      ipcRenderer.removeAllListeners(name as string);
    }
  });
}
