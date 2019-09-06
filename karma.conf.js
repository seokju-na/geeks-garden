process.env.ELECTRON_DISABLE_SECURITY_WARNINGS = 'true';

module.exports = function (config) {
  config.set({
    basePath: '',
    frameworks: ['jasmine', '@angular-devkit/build-angular'],
    plugins: [
      require('karma-jasmine'),
      require('karma-electron'),
      require('karma-jasmine-html-reporter'),
      require('karma-coverage-istanbul-reporter'),
      require('@angular-devkit/build-angular/plugins/karma'),
    ],
    client: {
      useIframe: false,
      clearContext: false, // leave Jasmine Spec Runner output visible in browser
    },
    files: [
      { pattern: 'src/assets/**/*', watched: false, included: false, served: true, nocache: false },
    ],
    proxies: {
      '/assets/': '/base/src/assets/',
    },
    coverageIstanbulReporter: {
      dir: require('path').join(__dirname, './coverage/browser/'),
      reports: ['html', 'lcovonly', 'text-summary'],
      fixWebpackSourcePaths: true,
    },
    reporters: ['dots', 'kjhtml'],
    port: 9876,
    colors: true,
    logLevel: config.LOG_INFO,
    autoWatch: true,
    browsers: ['Electron'],
    singleRun: false,
    restartOnFileChange: true,
  });
};
