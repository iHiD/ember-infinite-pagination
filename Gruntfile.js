module.exports = function(grunt) {
  "use strict";

  // Project configuration.
  grunt.initConfig({
    // Metadata.
    pkg: grunt.file.readJSON('package.json'),
    banner: '/*! <%= pkg.description %>\n' +
      '* (c) <%= grunt.template.today("yyyy") %> Jeremy Walker <jez.walker@gmail.com>\n' +
      '* MIT Licensed.\n' +
      '*\n' +
      '* Written by iHiD (Jeremy Walker) - Based on an idea by @pangratz\n' +
      '*\n' +
      '* <%= pkg.homepage %>\n' +
      '*/\n',

    clean: {
      files: ['bin', 'tmp']
    },
    coffee: {
      options: {
        separator: ';'
      },
      compile: {
        files: {
          'tmp/<%= pkg.name %>.js': ['lib/src/<%= pkg.name %>.coffee', 'lib/src/**/*.coffee'],
          'bin/<%= pkg.name %>-tests.js': ['lib/tests/<%= pkg.name %>.coffee', 'lib/tests/**/*.coffee']
        }
      }
    },
    uglify: {
      options: {
        banner: '<%= banner %>'
      },
      dist: {
        src: 'tmp/<%= pkg.name %>.js',
        dest: 'bin/<%= pkg.name %>.js',
        options: {
          mangle: false,
          beautify: true,
          compress: false
        }
      },
      minified: {
        src: 'tmp/<%= pkg.name %>-stripped.js',
        dest: 'bin/<%= pkg.name %>.min.js'
      },
    },
    qunit: {
      files: ['tests/**/*.html']
    },
    jshint: {
      options: {
        jshintrc: '.jshintrc'
      },
      gruntfile: {
        src: 'Gruntfile.js'
      }
    },
    coffeelint: {
      lib: ['lib/**/*.coffee'],
      options: {
        max_line_length: {
          value: 120,
          level: 'warn',
          message: 'Line exceeds maximum allowed length'
        }
      }
    },
    watch: {
      gruntfile: {
        files: '<%= jshint.gruntfile.src %>',
        tasks: ['jshint:gruntfile']
      },
      lib: {
        files: 'lib/**/*.*',
        tasks: ['jshint', 'coffee']
      }
    },
    strip: {
      lib: {
        src: 'tmp/<%= pkg.name %>.js',
        dest: 'tmp/<%= pkg.name %>-stripped.js'
      }
    },
    connect: {
      server: {}
    }
  });

  // These plugins provide necessary tasks.
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-coffee');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-connect');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-qunit');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-coffeelint');

  // custom tasks
  grunt.registerTask('hint', ['jshint', 'coffeelint']);
  grunt.registerTask('test', ['coffee', 'qunit']);
  grunt.registerTask('default', ['clean', 'hint', 'coffee', 'qunit', 'strip', 'uglify']);

  grunt.registerMultiTask('strip', "Strip all Ember debug statements", function() {
    // make this configurable or better: create own Grunt.js task for this
    var debugStatements = [
      "Ember.assert",
      "Ember.debug",
      "Ember.warn",
      "Ember.deprecate",
      "Ember.Logger.log",
      "Ember.Logger.warn",
      "Ember.Logger.error",
      "Ember.Logger.info",
      "Ember.Logger.debug",
      "console.log"
    ];

    var stripped = function(src) {
      var falafel = require('falafel');

      var isExpression = function(node) { return node.type === 'ExpressionStatement'; };
      var isCallExpression = function(node) { return node.type === 'CallExpression'; };
      var getCalleeExpression = function(node) {
        if (node.type === 'MemberExpression') { return getCalleeExpression(node.object) + '.' + node.property.name; }
        else if (node.type === 'Identifier') { return node.name; }
      };
      var isEmberDebugStatement = function(node) {
        var callee = getCalleeExpression(node);
        return debugStatements.indexOf(callee) !== -1;
      };

      return falafel(src, function (node) {
        if (isExpression(node) && isCallExpression(node.expression) && isEmberDebugStatement(node.expression.callee)) {
          node.update("");
        }
      });
    };

    // TODO refactor this!!
    var output = stripped(grunt.file.read(this.data.src));
    grunt.file.write(this.data.dest, output);
  });
};
