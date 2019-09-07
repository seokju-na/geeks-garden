import { ipcRenderer as electronIpcRenderer } from 'electron';

interface ElectronFeatures {
  ipcRenderer: typeof electronIpcRenderer;
  isDarkMode: () => boolean;
}

export function getElectronFeatures() {
  return (window as any).electronFeatures as ElectronFeatures;
}
