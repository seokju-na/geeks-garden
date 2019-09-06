import { ipcRenderer as electronIpcRenderer } from 'electron';

interface ElectronFeatures {
  ipcRenderer: typeof electronIpcRenderer;
}

export function getElectronFeatures() {
  return (window as any).electronFeatures as ElectronFeatures;
}
