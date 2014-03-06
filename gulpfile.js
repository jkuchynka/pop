var path   = require('path');

var gulp   = require('gulp');
var gutil  = require('gulp-util');

var _      = require('lodash');
var bower  = require('bower');
var npm    = require('npm');
var rimraf = require('rimraf');
var q      = require('q');

var less   = require('gulp-less');

// start config

var dest = 'public/';
var src = 'src/';

var destAbsPath = path.resolve(dest);

var npmConfig = require('./package.json');
var includeBrowserSync = true;

if (_.contains(gutil.env._, 'build')) { 
  if (!gutil.env.production) gutil.env.production = true;
  includeBrowserSync = false;
}

var jadeLocals = { includeBrowserSync: includeBrowserSync, time: new Date().getTime() };

var scripts = [
  src + 'js/app.js',
  src + 'js/**/*.js',
];

// end config

var onError = function (err) {
  gutil.beep();
  console.log(wrap(err.message), wrap(err));
};

gulp.task('styles', function () {
  return gulp.src(src + 'css/app.less')
    .pipe(plumber({
      errorHandler: onError
    }))
/*
    .pipe(rubysass({
      style: gutil.env.production ? 'compressed' : 'nested',
    }))
*/
    .pipe(less({
      paths: [path.join(__dirname, 'less', 'includes')]
    }))
    .pipe(autoprefixer('last 1 version'))
    .pipe(gutil.env.production ? rev() : gutil.noop())
    .pipe(gulp.dest(dest + 'css/'))
    .pipe(gutil.env.production ? inject(dest + 'index.html', {
      transform: function (filepath) {
        return '<link rel="stylesheet" href="' + filepath.replace(dest.substr(0,2) == '..' ? destAbsPath : dest, '') + '">';
      }
    }) : gutil.noop())
    .pipe(gutil.env.production ? gulp.dest(dest) : gutil.noop());
});

gulp.task('copy', function () {
  // apparently gulp ignores dotfiles with globs
  gulp.src(src + 'copy/**/*', { dot: true })
    .pipe(gulp.dest(dest));

  gulp.src(src + 'img/**/*.{png,svg,gif,jpg}')
    .pipe(gulp.dest(dest + 'img/'));
});

var jadeOpts = {
  locals: jadeLocals,
  pretty: !gutil.env.production
};

gulp.task('templates', function () {
  gulp.src([src + 'views/**/*.jade', '!' + src + 'views/partials/**/*'])
    .pipe(jade(jadeOpts))
    .pipe(gulp.dest(dest + 'views/'));
});

gulp.task('scripts', ['index', 'bower'], function () {
  return gulp.src(scripts)
    .pipe(plumber({
      errorHandler: onError
    }))
    .pipe(gutil.env.production ? ngmin() : gutil.noop())
    .pipe(gutil.env.production ? concat('script.js') : gutil.noop())
    .pipe(gutil.env.production ? uglify() : gutil.noop())
    .pipe(rev())
    .pipe(gulp.dest(dest + 'js/'))
    .pipe(inject(dest + 'index.html', {
      transform: function (filepath) {
        return '<script src="' + filepath.replace(dest.substr(0,2) == '..' ? destAbsPath : dest, '') + '"></script>';
      }
    }))
    .pipe(gulp.dest(dest));
});

gulp.task('bower', ['index'], function () {
  wiredep({
    directory: './bower_components',
    bowerJson: require('./bower.json'),
    src: [dest + 'index.html'],
    fileTypes: {
      html: {
        replace: {
          js: '<script src="/{{filePath}}"></script>',
          css: '<link rel="stylesheet" href="/{{filePath}}" />'
        }
      }
    }
  });
/*
  gulp.src('./bower_components/components-font-awesome/fonts/*')
    .pipe(gulp.dest(dest + 'bower_components/components-font-awesome/fonts/'));
*/
  if (!gutil.env.production)
    return bowerfiles().pipe(gulp.dest(dest + 'bower_components/'));
    // return gulp.src('bower_components/**/*').pipe(gulp.dest(dest + 'bower_components/'));
});

gulp.task('usemin', ['bower', 'scripts'], function () {
  if (!gutil.env.production) return;

  gulp.src(dest + 'index.html')
    .pipe(usemin({
      jsmin: uglify()
    }))
    .pipe(gulp.dest(dest));
});

gulp.task('index', function () {
  // returning makes task synchronous 
  // if something else depends on it
  return gulp.src(src + 'index.jade')
    .pipe(jade(jadeOpts))
    .pipe(gulp.dest(dest));
});

var wrap;
var loadModules = function () {
  _.each(npmConfig.devDependencies, function (version, module) {
    var name = module == 'gulp-util' ? 'gutil' : module.replace('gulp-', '').replace('-', '');
    global[name] = require(module);
  });
  wrap = wordwrap(80);
};

var prereqs = function () {
  var rimrafDeferred = q.defer();

  rimraf(dest, function (er) {
    if (er) throw er;
    rimrafDeferred.resolve();
    gutil.log("rimraf'd", gutil.colors.magenta(dest));
  });

  if (!gutil.env.install) {
    loadModules();
    return rimrafDeferred.promise;
  }

  var bowerDeferred = q.defer();
  var npmDeferred = q.defer();

  bower.commands.install().on('end', function (results) {
    bowerDeferred.resolve();
    gutil.log(gutil.colors.cyan('bower install'), 'finished');
  });

  npm.load(npmConfig, function (er) {
    npm.commands.install([], function (er, data) {
      gutil.log(gutil.colors.cyan('npm install'), 'finished');
      loadModules();
      npmDeferred.resolve();
    });
  });

  return q.all([
    rimrafDeferred.promise,
    bowerDeferred.promise,
    npmDeferred.promise
  ]);    
};

gulp.task('build', function () {
  prereqs().then(function () {
    gulp.start('run');
  });
});

var isWatching = false;
gulp.task('default', function () {
  prereqs().then(function () {
    gulp.start('run', function () {
      if (isWatching) return;
      isWatching = true;

      gulp.watch(src + 'css/**/*.less', ['styles']);
      gulp.watch(src + 'js/**/*.js', ['scripts']);
      gulp.watch(src + 'views/**/*.jade', ['templates']);
      gulp.watch([
        src + 'copy/**/*', 
        src + 'img/**/*.{png,svg,gif,jpg}'
      ], { dot: true }, ['copy']);

      gulp.watch(src + 'index.jade', ['index', 'scripts', 'bower', 'usemin']);

      var bs = browsersync.init([dest + 'css/app.css', dest + '**/*.*'], {
        ghostMode: {
          clicks: false,
          links: false,
          forms: false,
          scroll: false
        }
      });

      bs.on("file:changed", function (file) {
        terminalnotifier(file.path.replace(destAbsPath, ''), { title: 'File Changed' });
      });
    });
  });
});

gulp.task('run', ['copy', 'styles', 'templates', 'scripts', 'bower', 'usemin']);
