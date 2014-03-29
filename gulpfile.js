/**
 * Gulp config
 *
 * Returning from a task makes that task synchronous
 * if something else depends on it.
 */


// Require packages
var bower       = require('bower'),
    es          = require('event-stream'),
    bowerfiles  = require('gulp-bower-files'),
    gulp        = require('gulp'),
    autoprefixer= require('gulp-autoprefixer'),
    inject      = require('gulp-inject'),
    jade        = require('gulp-jade'),
    less        = require('gulp-less'),
    plumber     = require('gulp-plumber'),
    rev         = require('gulp-rev'),
    gutil       = require('gulp-util'),
    rimraf      = require('gulp-rimraf')
    watch       = require('gulp-watch')
    path        = require('path'),
    lr          = require('tiny-lr'),
    server      = lr();

// Setup config
var config = {
  dest: 'public/',
  //destAbsPath: path.resolve(config.dest),
  src: 'src/',
  inject: {
    // Change tags for injection due to how Jade is creating them
    starttag: '<!-- inject:{{ext}}-->',
    endtag: '<!-- endinject-->',
    // Don't need to read file content, speeds up inject
    read: false,
    ignorePath: 'public'
  },
  injectVendor: {
    starttag: '<!-- inject:vendor:{{ext}}-->',
    endtag: '<!-- endinject-->',
    read: false,
    ignorePath: 'public'
  },
  jade: {
    locals: {},
    pretty: !gutil.env.production
  },
  lrPort: 35729
};

var onError = function (err) {
  gutil.beep();
  //console.log(wrap(err.message), wrap(err));
  console.log(err.message);
};

gulp.task('clean', function () {
  return gulp.src(config.dest + '**/*', {read: false})
    .pipe(plumber({ errorHandler: onError }))
    .pipe(rimraf());
});

gulp.task('copy', ['clean'], function () {
  gulp.src(config.src + 'copy/**/*', { dot: true })
    .pipe(gulp.dest(config.dest));
  return gulp.src(config.src + 'img/**/*.{png,svg,gif,jpg}')
    .pipe(gulp.dest(config.dest + 'img/'));
});

gulp.task('index', ['clean'], function () {
  return gulp.src(config.src + 'index.jade')
    .pipe(jade(config.jade))
    .pipe(gulp.dest(config.dest));
});

gulp.task('inject', ['clean', 'index'], function () {
  var bower = bowerfiles()
    .pipe(gulp.dest(config.dest + 'bower_components/'));

  var scripts = gulp.src([config.src + 'js/app.js', config.src + 'js/**/*.js'])
    .pipe(plumber({
      errorHandler: onError
    }))
    .pipe(gutil.env.production ? ngmin() : gutil.noop())
    .pipe(gutil.env.production ? concat('script.js') : gutil.noop())
    .pipe(gutil.env.production ? uglify() : gutil.noop())
    .pipe(rev())
    .pipe(gulp.dest(config.dest + 'js/'));

  var styles = gulp.src(config.src + 'css/app.less')
    .pipe(plumber({
      errorHandler: onError
    }))
    .pipe(less({
      paths: [path.join(__dirname, 'less', 'includes')]
    }))
    .pipe(autoprefixer('last 1 version'))
    .pipe(gutil.env.production ? rev() : gutil.noop())
    .pipe(gulp.dest(config.dest + 'css/'))
    .pipe(gutil.env.production ? gulp.dest(config.dest) : gutil.noop());

  return gulp.src(config.dest + 'index.html')
    .pipe(inject(bower, config.injectVendor))
    .pipe(inject(es.merge(styles, scripts), config.inject))
    .pipe(gulp.dest(config.dest))
    .pipe(livereload(server));
});

gulp.task('templates', ['clean'], function () {
  gulp.src(config.src + 'views/**/*.jade')
    .pipe(jade(config.jade))
    .pipe(gulp.dest(config.dest + 'views/'));
});

gulp.task('usemin', ['inject'], function () {
  if (!gutil.env.production) return;

  gulp.src(dest + 'index.html')
    .pipe(usemin({
      jsmin: uglify()
    }))
    .pipe(gulp.dest(dest));
});

gulp.task('watch', function () {
  gulp.start('run', function () {
    server.listen(config.lrPort, function (err) {
      if (err) {
        return console.log(err);
      }
      gulp.watch([
        config.src + 'js/**/*.js',
        config.src + 'css/**/*.less',
        config.src + 'views/**/*.jade',
        config.src + 'copy/**/*',
        config.src + 'img/**/*.{png,svg,gif,jpg}',
        config.src + 'index.jade'
      ], ['run']);
    })
  });
});

gulp.task('run', ['clean', 'copy', 'templates', 'index', 'inject', 'usemin']);
