module.exports = function(grunt) {
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        banner: grunt.file.read('banner.js'),
        dirs: {
            scss: "src/scss",
            css: "src/css",
            js: "src/js",
            demo: "demo",
            build: "build"
        },
        watch: {
            js: {
                files: ['src/js/**/*.js'],
                tasks: ['concat:js','concat:dev','strip_code','jshint']
            },
            scss: {
                files: ['src/scss/**/*.scss'],
                tasks: ['compass','concat:css']
            }
        },
        concat: {
            css: {
                options: {
                    banner: '<%= banner %>'
                },
                files: {
                    '<%= dirs.build %>/mivhak.min.css': [
                        '<%= dirs.css %>/**/*.css'
                    ]
                }
            },
            js: {
                options: {
                    separator: "",
                    banner: '<%= banner %>'
                },
                files: {
                    '<%= dirs.build %>/mivhak.js': [
                        '<%= dirs.js %>/intro.js',
                        '<%= dirs.js %>/ace.config.js',
                        '<%= dirs.js %>/utility.js',
                        '<%= dirs.js %>/mivhak.js',
                        '<%= dirs.js %>/mivhak.defaults.js',
                        '<%= dirs.js %>/mivhak.icons.js',
                        '<%= dirs.js %>/mivhak.component.js',
                        '<%= dirs.js %>/components/*.js',
                        '<%= dirs.js %>/jquery.mivhak.js',
                        '<%= dirs.js %>/outro.js'
                    ]
                }
            },
            dev: {
                files: {
                    '<%= dirs.build %>/mivhak-dev.js': ['<%= dirs.build %>/mivhak.js']
                }
            }
        },
        compass: {
            dist: {
                options: {
                    sassDir: '<%= dirs.scss %>',
                    cssDir: '<%= dirs.css %>',
                    environment: 'production',
                    raw: 'preferred_syntax = :scss\n', // Use `raw` since it's not directly available
                    outputStyle: 'compressed'
                }
            }
        },
        jshint: {
            all: ['Gruntfile.js', 'build/mivhak.js']
        },
        uglify: {
            options: {
                banner: '<%= banner %>'
            },
            dist: {
                files: {
                    '<%= dirs.build %>/mivhak.min.js': ['<%= dirs.build %>/mivhak.js']
                }
            }
        },
        strip_code: {
            options: {
                // Task-specific options go here.
            },
            your_target: {
                src: 'build/mivhak.js'
            },
        },
    });

    // Load grunt plugins
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-compass');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-strip-code');
    
    // Default task(s).
    grunt.registerTask('build', ['concat:js','concat:dev','strip_code','uglify','compass','concat:css','jshint']);
};