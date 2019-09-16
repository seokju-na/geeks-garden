const { ipcRenderer, remote } = require('electron');

if (process.env.NODE_ENV !== 'production') {
  window.__devtron = { require: require, process: process };
  require('devtron').install();
}

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
  },
};
