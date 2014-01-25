
var path = require('path');

var stylesheetsDir = 'assets/stylesheets';

module.exports = function(grunt) {
  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    watch: {
      jsx: {
        files: 'app/**/*.jsx',
        tasks: ['browserify'],
        options: {
          interrupt: true
        }
      },
      scripts: {
        files: ['app/**/*.js','app/**/*.jsx'],
        tasks: ['browserify'],
        options: {
          interrupt: true
        }
      },
    },

    browserify: {
      options: {
        debug: true,
        verbose: true,
        transform: ['reactify'],
        extensions: ['.js','.jsx'],

        alias: [
          'node_modules/rendr-handlebars/index.js:rendr-handlebars',
          //'node_modules/react/react.js:react'
        ],
        aliasMappings: [
          {
            cwd: 'app/',
            src: ['**/*.jsx','**/*.js'],//'**/*.js','**/*.jsx'],
            dest: 'app/'
          }
        ],
        shim: {
          jquery: {
            path: 'bower_components/jquery/jquery.min.js',
            exports: '$'
          }
        }
      },
      app: {
        src: [ 'app/**/*.jsx', 'app/**/*.js','bower_components/todomvc-common/base.js'],
        dest: 'public/mergedAssets.js'
      },
      tests: {
        src: [
          'test/helper.js',
          'test/app/**/*.jsx',
          'test/app/**/*.js'
        ],
        dest: 'public/testBundle.js'
      }
    }
  });

  grunt.loadNpmTasks('grunt-browserify');
  grunt.loadNpmTasks('grunt-contrib-stylus');
  grunt.loadNpmTasks('grunt-contrib-watch');

  grunt.registerTask('runNode', function () {
    grunt.util.spawn({
      cmd: 'node',
      args: ['./node_modules/nodemon/nodemon.js', '--debug', 'index.js'],
      opts: {
        stdio: 'inherit'
      }
    }, function () {
      grunt.fail.fatal(new Error("nodemon quit"));
    });
  });


  grunt.registerTask('compile', ['browserify']);//'stylus']);

  // Run the server and watch for file changes
  grunt.registerTask('server', ['runNode', 'compile', 'watch']);

  // Default task(s).
  grunt.registerTask('default', ['compile']);

};

