module.exports = function(grunt) {

  var theme = grunt.option('theme') || '8800';

  // Project configuration.

  var config = {
    pkg: grunt.file.readJSON('package.json'),
    theme: theme,
    banner: '',
    
    jshint: {
	/*options: {
                "bitwise": true,
                "camelcase": true,
                "curly": true,
                "eqeqeq": true,
                "es3": false,
                "forin": true,
                "freeze": true,
                "immed": true,
                "indent": 4,
                "latedef": "nofunc",
                "newcap": true,
                "noarg": true,
                "noempty": true,
                "nonbsp": true,
                "nonew": true,
                "plusplus": false,
                "quotmark": "single",
                "undef": true,
                "unused": false,
                "strict": false,
                "maxparams": 10,
                "maxdepth": 5,
                "maxstatements": 40,
                "maxcomplexity": 8,
                "maxlen": 120,

                "asi": false,
                "boss": false,
                "debug": false,
                "eqnull": true,
                "esnext": false,
                "evil": false,
                "expr": false,
                "funcscope": false,
                "globalstrict": false,
                "iterator": false,
                "lastsemic": false,
                "laxbreak": false,
                "laxcomma": false,
                "loopfunc": true,
                "maxerr": false,
                "moz": false,
                "multistr": false,
                "notypeof": false,
                "proto": false,
                "scripturl": false,
                "shadow": false,
                "sub": true,
                "supernew": false,
                "validthis": false,
                "noyield": false,

                "browser": true,
                "node": true,

                "globals": {
                        "angular": false,
                        "$": false
                }
        },*/
	all: [
    	    'src/directives/*.js',
    	    'src/themes/<%= theme %>/**/*.js'
        ]
    },
    
    concat: {
        js: {
    	    files: {
        	'dist/<%= pkg.name %>.js': ['src/directives/*.js'],
        	'dist/themes/<%= theme %>.js': ['src/themes/<%= theme %>/**/*.js'],
	    }
	},
	css: {
	    src: ['src/themes/<%= theme %>/**/*.css'],
	    dest: 'dist/themes/<%= theme %>.css',
	}
    },
      
    uglify: {
        js: {
	    options: {
		/*sourceMap: true,
		sourceMapIncludeSources: true,
		sourceMapIn: 'example/coffeescript-sourcemap.js',*/
	    },
            files: {
        	'dist/<%= pkg.name %>.min.js': ['src/directives/*.js'],
        	'dist/themes/<%= theme %>.min.js': ['src/themes/<%= theme %>/**/*.js'],
	    },
	},
    },
    
    cssmin: {
	options: {
	    shorthandCompacting: false,
	    roundingPrecision: -1
	},
        css: {
	    files: {
		'dist/themes/<%= theme %>.min.css': ['src/themes/<%= theme %>/**/*.css']
	    }
	}
    },
                            
    rsync: {
      options: {
          args: ["--verbose -c --rsh='ssh -p22'"],
          exclude: [".git*","*.scss",".DS_Store"],
          recursive: true
      },
      milestone: {
          options: {
              src: "src/",
              dest: "/var/www/megafon/mats",
              host: "root1@10.77.64.108",
              syncDestIgnoreExcl: true
          }
      }
    }
  };

  grunt.config.init(config);

  // Load the plugin that provides needed tasks.
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-rsync');

  // Our tasks.
  grunt.registerTask('default', ['jshint', 'concat', 'uglify', 'cssmin']);
};
