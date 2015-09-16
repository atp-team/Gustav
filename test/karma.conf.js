module.exports = function (config) {
    config.set({
                   basePath: '../',

                   preprocessors: {
                       '**/*.coffee': ['coffee']
                   },

                   files: [
                       'dist/lib/*.js',
                       'dist/gustav/scripts/config.js',
                       'bower_components/angular-mocks/angular-mocks.js',
                       'app/core/**/*.js',
                       'app/gustav/**/*.js',
                       'app/plugins/**/*.js',
                       //Tests are in Coffeescript :)
                       'app/core/**/*.coffee',
                       'app/gustav/**/*.coffee',
                       'app/plugins/**/*.coffee'
                   ],

                   autoWatch: true,

                   frameworks: ['jasmine'],

                   browsers: ['Chrome'],

                   plugins: [
                       'karma-junit-reporter',
                       'karma-chrome-launcher',
                       'karma-firefox-launcher',
                       'karma-jasmine',
                       'karma-coffee-preprocessor'
                   ],

                   junitReporter: {
                       outputFile: 'tests/out/unit.xml',
                       suite: 'unit'
                   },

                   coffeePreprocessor: {
                       // options passed to the coffee compiler
                       options: {
                           bare: true,
                           sourceMap: false
                       },
                       // transforming the filenames
                       transformPath: function (path) {
                           return path.replace(/\.js$/, '.coffee');
                       }
                   }
               });
};
