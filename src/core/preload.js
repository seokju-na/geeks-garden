const { ipcRenderer, remote } = require('electron');

/**
 * Since we disable node integration for browser window, require electron
 * features at preload.
 *
 * See more:
 *  https://electronjs.org/docs/tutorial/security#2-do-not-enable-nodejs-integration-for-remote-content
 */
window.electronFeatures = {
  ipcRenderer,
  isDarkMode() {
    return remote.systemPreferences.isDarkMode();
  }
};
