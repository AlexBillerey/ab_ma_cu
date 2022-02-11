module.exports = function (grunt) {

    // 1. All configuration goes here
    //noinspection JSDuplicatedDeclaration
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        watch: {
            files: ['development/css/main.css', 'development/**/*.html', 'development/js/main.js'],
            tasks: ['concat', 'purifycss', 'postcss', 'cssmin','processhtml']
        },
        copy: {
            main: {
                expand: true,
                //cwd: 'development',
                prod: ["development/img/*.*"],
                dest: 'production/img'
            }
        },
        concat: {
            css: {
                src: ['development/css/normalize.css', 'development/css/main.css'],
                dest: 'development/css/production.css'
            }
        },
        purifycss: {
            options: {},
            target: {
                src: ['development/**/*.html', 'development/js/main.js'],
                //css: ['development/css/normalize.css','development/css/main.css'],
                css: ['development/css/production.css'],
                dest: 'development/css/production_pure.css'
            }
        },



        postcss: {
            options: {
                //map: false, // inline sourcemaps

                // or
                map: {
                    inline: false, // save all sourcemaps as separate files...
                    annotation: 'production/css/maps/' // ...to the specified directory
                },

                processors: [

                    require('pixrem')(), // add fallbacks for rem units
                    //require('autoprefixer'),/*({browsers: 'last 2 versions'})*//*({browsers: 'last 2 versions'})*/ // add vendor prefixes - NOT NEEDED AS CONFIG NOW DONE USING PACKAGE.JSON
                    require('postcss-merge-rules')(),
                    require('cssnano')(),
                    //require('postcss-custom-properties')(/* pluginOptions */),
                    require('postcss-simple-vars')(),               // Variables, a must

                ]
            },
            dist: {
                src: 'development/css/production_pure.css',
                dest: 'development/css/production_pure_pf.css'
            }
        },

        cssmin: {
            options: {
                shorthandCompacting: false,
                roundingPrecision: -1
            },
            target: {
                files: {
                    'production/css/styles.min.css': ['development/css/production_pure_pf.css']
                }
            }
        },
        processhtml: {
            dist: {
                files: {
                    'production/index.html': ['development/index.html']
                }
            }
        },

        browserSync: {
            bsFiles: {
                src: ['development/**/*.css', 'development/**/*.html', 'development/**/*.js']
            },
            options: {
                watchTask: true,
                server: {
                    baseDir: ["development"]
                },

                browser: ["chrome", "firefox"/*, "opera","microsoft-edge:http://localhost:3000"*/]
            }
        }









    });

    // 3. Where we tell Grunt we plan to use this plug-in.

    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-concat-css');
    grunt.loadNpmTasks('grunt-uncss');
    grunt.loadNpmTasks('grunt-processhtml');
    grunt.loadNpmTasks('grunt-postcss');
    grunt.loadNpmTasks('grunt-purifycss');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-browser-sync');
    grunt.loadNpmTasks('@lodder/grunt-postcss');
    /* See http://blog.ponyfoo.com/2013/11/13/grunt-tips-and-tricks */

    // 4. Where we tell Grunt what to do when we type "grunt" into the terminal.

    grunt.registerTask('default', ['browserSync','watch']);
};