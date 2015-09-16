'use strict';

module.exports = function (grunt) {

    require('time-grunt')(grunt);
    require('load-grunt-tasks')(grunt);
    grunt.loadNpmTasks('grunt-include-source');

    // Build configuration
    var config = {
        app: 'app', //application source code folder
        dist: 'dist', //application distribution folder
        livereload: 35729,
        environment: 'test'
    };

    // Define the configuration for all the tasks
    grunt.initConfig({

        // Project settings
        config: config,

        // Watches files for changes and runs tasks based on the changed files
        watch: {
            javascript: {
                options : {
                    livereload : true,
                    spawn : false
                },
                files: [
                    '<%= config.app %>/core/scripts/**/*.js',
                    '<%= config.app %>/gustav/scripts/**/*.js',
                    '<%= config.app %>/plugins/**/*.js'
                ],
                tasks: ['editor','jshint']
            },
            html: {
                options : {
                    livereload : true,
                    spawn : false
                },
                files: [
                    '<%= config.app %>/core/**/*.html',
                    '<%= config.app %>/gustav/**/*.html',
                    '<%= config.app %>/plugins/**/*.html',
                    '<%= config.app %>/index.html'
                ],
                tasks: ['editor']
            },
            styles: {
                options : {
                    livereload : true,
                    spawn : false
                },
                files: [
                    '<%= config.app %>/plugins/**/*.css',
                    '<%= config.app %>/gustav/styles/*.css',
                    '<%= config.app %>/core/styles/*.css'
                ],
                tasks: ['editor']
            },
            json: {
                options : {
                    livereload : true,
                    spawn : false
                },
                files: [
                    '<%= config.app %>/core/i18n/*.json',
                    '<%= config.app %>/gustav/i18n/*.json',
                    '<%= config.app %>/plugins/*/i18n/*.json'
                ],
                tasks: ['editor']
            },
            image: {
                options : {
                    livereload : true,
                    spawn : false
                },
                files: [
                    '<%= config.app %>/gustav/images/*.{png,jpg,jpeg,gif}',
                    '<%= config.app %>/plugins/**/*.{png,jpg,jpeg,gif}'
                ],
                tasks: ['editor']
            },
            less: {
                options : {
                    livereload : true,
                    spawn : false
                },
                files: [
                    '<%= config.app %>/core/less/*.less'
                ],
                tasks: ['editor']

            }
        },

        less: {
            style: {
                files: {
                    '<%= config.app %>/core/styles/main.css': '<%= config.app %>/core/less/main.less'
                }
            }
        },

        // Grunt server and debug server settings
        connect: {
            server: {
                options: {
                    port: 9000,
                    base: '<%= config.dist %>'
                }
            },
            livereload_server: {
                options: {
                    port: 9000,
                    livereload: '<%= config.livereload %>',
                    base: '<%= config.dist %>'
                }
            }
        },

        ngAnnotate: {
            options: {
                singleQuotes: true
            },
            default: {
                files: [
                    {
                        expand: true,
                        src: ['<%= config.dist %>/core/**/*.js'],
                        /*dest: '<%= config.dist %>/',
                         ext: '.annotated.js', // Dest filepaths will have this extension.*/
                        extDot: 'last'      // Extensions in filenames begin after the last dot
                    },
                    {
                        expand: true,
                        src: ['<%= config.dist %>/gustav/**/*.js'],
                        /*dest: '<%= config.dist %>/',
                         ext: '.annotated.js', // Dest filepaths will have this extension.*/
                        extDot: 'last'      // Extensions in filenames begin after the last dot
                    },
                    {
                        expand: true,
                        src: ['<%= config.dist %>/plugins/**/*.js'],
                        /*dest: '<%= config.dist %>/',
                         ext: '.annotated.js', // Dest filepaths will have this extension.*/
                        extDot: 'last'      // Extensions in filenames begin after the last dot
                    }
                ]
            }
        },



        concat: {
            release: {
                src: [
                    '<%= config.dist %>/lib/*.js',
                    '<%= config.dist %>/gustav/scripts/**/*.js',
                    '<%= config.dist %>/core/scripts/**/*.js',
                    '<%= config.dist %>/plugins/**/*.js'
                    ],
                dest: 'temp/gustav.js'
            },
            //concat only app files
            app: {
                src: [
                    '<%= config.dist %>/gustav/scripts/*.js',
                    '<%= config.dist %>/core/scripts/*.js',
                    '<%= config.dist %>/plugins/**/*.js'
                ],
                dest: '<%= config.dist %>/gustav.js'
            }
        },

        uglify: {
            options: {
                mangle: false,
                flatten: true
            },
            release: {
                files: {
                    '<%= config.dist %>/gustav.js': ['temp/gustav.js']
                }
            }
        },

        // Empties folders to start fresh
        clean: {
            dist: {
                files: [{
                    dot: true,
                    src: ['<%= config.dist %>/*', '!<%= config.dist %>/gustav/scripts/config.js']
                }]
            },
            release: {
                files: [{
                    dot: true,
                    src: ['temp','<%= config.dist %>/**/scripts','<%= config.dist %>/lib/*.js']
                }]
            }
        },

        karma: {
            unit: {
                configFile: 'test/karma.conf.js',
                singleRun: true
            }
        },

        // Copies remaining files to places other tasks can use
        copy: {
            dist: {
                files: [
                    {
                        expand: true,
                        dot: true,
                        cwd: '<%= config.app %>',
                        dest: '<%= config.dist %>',
                        src: [
                            'core/**/*',
                            'gustav/**/*',
                            'plugins/**/*',
                            'index.html'
                        ]
                    }]
            },
            bower: {
                files: [
                    {src: ['bower_components/jquery/dist/jquery.js'], dest: '<%= config.dist %>/lib/1_jquery.js'},
                    {src: ['bower_components/angular/angular.js'], dest: '<%= config.dist %>/lib/3_angular.js'},
                    {src: ['bower_components/angular-animate/angular-animate.js'], dest: '<%= config.dist %>/lib/4_angular-animate.js'},
                    {src: ['bower_components/angular-cookies/angular-cookies.js'], dest: '<%= config.dist %>/lib/4_angular-cookies.js'},
                    {src: ['bower_components/angular-local-storage/dist/angular-local-storage.js'], dest: '<%= config.dist %>/lib/4_angular-local-storage.js'},
                    {src: ['bower_components/angular-sanitize/angular-sanitize.js'], dest: '<%= config.dist %>/lib/4_angular-sanitize.js'},
                    {src: ['bower_components/angular-touch/angular-touch.js'], dest: '<%= config.dist %>/lib/4_angular-touch.js'},

                    {src: ['bower_components/angular-bootstrap/ui-bootstrap.js'], dest: '<%= config.dist %>/lib/51_ui-bootstrap.js'},
                    {src: ['bower_components/angular-bootstrap/ui-bootstrap-tpls.js'], dest: '<%= config.dist %>/lib/52_ui-bootstrap-tpls.js'},

                    {src: ['bower_components/angular-dynamic-locale/tmhDynamicLocale.min.js'], dest: '<%= config.dist %>/lib/6_tmhDynamicLocale.min.js'},
                    {src: ['bower_components/angular-dynamic-locale/tmhDynamicLocale.min.js.map'], dest: '<%= config.dist %>/lib/tmhDynamicLocale.min.js.map'},
                    {src: ['bower_components/angular-i18n/angular-locale_cs.js'], dest: '<%= config.dist %>/lib/6_angular-locale_cs.js'},
                    {src: ['bower_components/angular-loading-bar/build/loading-bar.js'], dest: '<%= config.dist %>/lib/6_loading-bar.js'},
                    {src: ['bower_components/angular-loading-bar/build/loading-bar.css'], dest: '<%= config.dist %>/lib/6_loading-bar.css'},
                    {src: ['bower_components/angular-resource/angular-resource.js'], dest: '<%= config.dist %>/lib/6_angular-resource.js'},
                    {src: ['bower_components/angular-ui-router/release/angular-ui-router.js'], dest: '<%= config.dist %>/lib/6_angular-ui-router.js'},

                    {src: ['bower_components/moment/moment.js'], dest:'<%= config.dist %>/lib/6_moment.js'},

                    {src: ['bower_components/oclazyload/dist/ocLazyLoad.js'], dest: '<%= config.dist %>/lib/6_ocLazyLoad.js'},
                    {src: ['bower_components/angular-translate/angular-translate.js'], dest: '<%= config.dist %>/lib/6_angular-translate.js'},
                    {src: ['bower_components/angular-translate-loader-partial/angular-translate-loader-partial.js'], dest: '<%= config.dist %>/lib/7_angular-translate-loader-partial.js'},
                    {src: ['bower_components/angular-translate-storage-cookie/angular-translate-storage-cookie.js'], dest: '<%= config.dist %>/lib/7_angular-translate-storage-cookie.js'},
                    {src: ['bower_components/angular-translate-storage-local/angular-translate-storage-local.js'], dest: '<%= config.dist %>/lib/7_angular-translate-storage-local.js'},
                    {
                        expand: true,
                        dot: true,
                        cwd: 'bower_components/bootstrap/dist',
                        dest: '<%= config.dist %>/core',
                        src: [
                            'fonts/**/*'
                        ]
                    }
                ]
            }
        },

        includeSource: {
            options: {
                basePath: '<%= config.dist %>',
                baseUrl: '',
                templates: {
                    html: {
                        js: '<script src="{filePath}"></script>',
                        css: '<link rel="stylesheet" type="text/css" href="{filePath}" />'
                    }
                }
            },
            dist: {
                files: {
                    '<%= config.dist %>/index.html': '<%= config.dist %>/index.html'
                }
            }
        },

        jshint: {
            options: {
                "node": true,
                "browser": true,
                "esnext": true,
                "bitwise": true,
                "camelcase": false,
                "curly": true,
                "eqeqeq": true,
                "immed": true,
                "latedef": true,
                "newcap": true,
                "noarg": true,
                "quotmark": false,
                "undef": true,
                "strict": false,
                "trailing": true,
                "smarttabs": true,
                "devel": true,
                "unused": true,
                "globals" : {
                    "chrome": true,
                    "angular": true,
                    "BootstrapDialog": true
                },
                reporter: require('jshint-stylish')
            },
            uses_defaults:[
                '<%= config.app %>/core/scripts/**/*.js',
                '<%= config.app %>/gustav/scripts/**/*.js',
                '<%= config.app %>/plugins/**/*.js'
            ]
        },

        // Environment configuration
        ngconstant: {

            // Options for all targets
            options: {
                space: '  ',
                wrap: '"use strict";\n\n {%= __ngModule %}',
                name: 'gustav.config'
            },

            // ST2 - debug environment
            test: {
                options: {
                    dest: '<%= config.dist %>/gustav/scripts/config.js'
                },
                constants: {
                    ENV: {
                        name: 'test',
                        apiEndpoint: 'https://www.csas.cz',
                        apiKey: '0bca73a4-0ebb-4837-a841-7dcb189e9c02',
                        authToken: 'demo_b8d3fb54a86b63641727eba34fd638ef',

                        profileApiPath:"/webapi/api/v1/netbanking/my/profile",
                        accountsApiPath:'/webapi/api/v1/netbanking/my/accounts',
                        cardsApiPath:'/webapi/api/v1/netbanking/my/cards',
                        historyApiPath:'/webapi/api/v1/netbanking/my/accounts/:account/transactions?dateStart=:from&dateEnd=:to',
                        buildingSavingsApiPath:'/webapi/api/v1/netbanking/my/contracts/buildings'
                    }
                }
            },
        },

         ngdocs: {
             options: {
                 doc: 'docs',
                 title: 'Gustav Docs',
                 html5Mode: false
             },

             all: ['app/**/*.js', '!app/bower_components/**/*.js']
         }
    });

    grunt.registerTask('test', [
        'karma'
    ]);

    grunt.registerTask('debug', function (environment) {
        environment = environment || 'test';
        grunt.config.set('config.environment', environment);
        grunt.task.run([
            'clean:dist',
            'copy:dist',
            'ngAnnotate',
            'copy:bower',
            'less',
            'ngconstant:' + environment,
            'includeSource:dist',
            'connect:livereload_server',
            'watch'
        ]);
    });

    grunt.registerTask('release', function(environment) {
        environment = environment || 'test';
        grunt.task.run([
            'clean:dist',
            'copy:dist',
            'ngAnnotate',
            'copy:bower',
            'less',
            'ngconstant:' + environment,
            'concat:release',
            'uglify:release',
            'clean:release',
            'includeSource:dist',
            //'ngdocs'
        ]);
    });

    grunt.registerTask('editor', function () {
        var env = grunt.config.get('config.environment');
        grunt.task.run([
            'clean:dist',
            'less',
            'copy:dist',
            'ngAnnotate',
            'copy:bower',
            'ngconstant:' + env,
            'includeSource:dist'
        ]);
    });

    grunt.registerTask('default', function(environment) {
        environment = environment || 'test';
        grunt.task.run([
            'jshint',
            'debug'
        ]);
    });

};
