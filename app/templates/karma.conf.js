module.exports = function(config) {
  config.set({
    basePath: '',
    frameworks: ['jasmine'],
    // files: [], DO NOT ADD FILES HERE. ADD THEM TO specFiles in Gulpfile.js
    exclude: [],
    reporters: ['progress'],
    port: 9876,
    colors: true,
    logLevel: config.LOG_INFO,
    autoWatch: true,
    browsers: ['PhantomJS', 'Firefox'],
    captureTimeout: 60000,
    singleRun: false
  });
};
