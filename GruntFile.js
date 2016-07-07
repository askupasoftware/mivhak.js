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
                        '<%= dirs.js %>/jquery.template.js',
                        '<%= dirs.js %>/mivhak.js',
                        '<%= dirs.js %>/mivhak.defaults.js',
                        '<%= dirs.js %>/mivhak.resources.js',
                        '<%= dirs.js %>/mivhak.buttons.js',
                        '<%= dirs.js %>/mivhak.methods.js',
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
            },
            bundle: { // Create a version that includes all dependencies
                files: {
                    '<%= dirs.build %>/mivhak.bundle.min.js': ['<%= dirs.js %>/lib/*.js','<%= dirs.build %>/mivhak.js']
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
                    '<%= dirs.build %>/mivhak.min.js': ['<%= dirs.build %>/mivhak.js'],
                    '<%= dirs.build %>/mivhak.bundle.min.js': ['<%= dirs.build %>/mivhak.bundle.min.js']
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
        components: {
            dist: function() {
                var src = '<%= dirs.js %>/components/*.js',
                    out = '<%= dirs.js %>/components/_compiled.js',
                    fileList = grunt.file.expand(grunt.template.process(src)),
                    contents = '';
                
                fileList.forEach(function(file) {
                    var script = grunt.file.read(file),
                        template = (function() {
                            var src = file.replace('.js','.html');
                            if(grunt.file.exists(src)) return grunt.file.read(src).replace("\n"," ");
                            return '';
                        });
                        
                    console.log(script,template);
                    contents += "\n(function(template){\n" + script + "\n})(`"+template+"`);\n";
                });
                
//                grunt.file.write(grunt.template.process(out),contents);
            }
        }
    });

    // Load grunt plugins
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-compass');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-strip-code');
    
    // Default task(s).
    grunt.registerTask('build', ['concat:js','concat:dev','concat:bundle','strip_code','uglify','compass','concat:css','jshint']);
    grunt.registerMultiTask("components", ["components"],function(){this.data.call();});
};