
// Require packages
var
    es          = require('event-stream'),
    bowerfiles  = require('main-bower-files'),
    gulp        = require('gulp'),
    autoprefixer= require('gulp-autoprefixer'),
    changed     = require('gulp-changed'),
    expect      = require('gulp-expect-file'),
    ignore      = require('gulp-ignore'),
    imagemin    = require('gulp-imagemin'),
    inject      = require('gulp-inject'),
    jade        = require('gulp-jade'),
    less        = require('gulp-less'),
    plumber     = require('gulp-plumber'),
    rev         = require('gulp-rev'),
    gutil       = require('gulp-util'),
    watch       = require('gulp-watch'),
    del         = require('del'),
    path        = require('path');

// Setup config
var config = {
  dest: 'public/',
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
    pretty: true
  },
  lrPort: 35729
};

var onError = function (err) {
  gutil.beep();
  //console.log(wrap(err.message), wrap(err));
  console.log(err.message);
};

// Clean out built assets
gulp.task('clean', function () {
  return del([
    config.dest + '**/*',
    '!' + config.dest + '{uploads,uploads/**}',
    '!' + config.dest + '{image,image/**}'
  ]);
});

gulp.task('copy', function () {
  gulp.src(config.src + 'copy/**/*', { dot: true })
    .pipe(gulp.dest(config.dest));
  return gulp.src(config.src + 'img/**/*.{png,svg,gif,jpg}')
    .pipe(gulp.dest(config.dest + 'assets/img/'));
});

gulp.task('inject', function () {
  var bfiles = gulp.src(bowerfiles(), { base: './bower_components' })
    .pipe(gulp.dest(config.dest + 'assets/bower_components/'));

  var scripts = gulp.src([config.src + 'js/app.js', config.src + 'js/**/*.js'])
    .pipe(plumber({
      errorHandler: onError
    }))
    .pipe(rev())
    .pipe(gulp.dest(config.dest + 'assets/js/'));

  var styles = gulp.src(config.src + 'css/app.less')
    .pipe(plumber({
      errorHandler: onError
    }))
    .pipe(less({
      paths: [path.join(__dirname, 'less', 'includes')]
    }))
    .pipe(autoprefixer('last 1 version'))
    .pipe(gutil.env.production ? rev() : gutil.noop())
    .pipe(gulp.dest(config.dest + 'assets/css/'))
    .pipe(gutil.env.production ? gulp.dest(config.dest) : gutil.noop());

  return gulp.src(config.src + 'index.jade')
    .pipe(jade(config.jade))
    .pipe(inject( bfiles, config.injectVendor ))
    .pipe(inject( es.merge(styles, scripts), config.inject ))
    .pipe(gulp.dest('public'));
});

gulp.task('templates', function () {
  return gulp.src(config.src + 'views/**/*.jade')
    .pipe(jade(config.jade))
    .pipe(gulp.dest(config.dest + 'assets/views/'));
});

// Watch for changes and re-run tasks
gulp.task('watch', function () {
  gulp.start('default', function () {
    //server.listen(config.lrPort, function (err) {
      //if (err) {
        //return console.log(err);
      //}
      watch([
        config.src + 'js/**/*.js',
        config.src + 'css/**/*.less',
        config.src + 'views/**/*.jade',
        config.src + 'copy/**/*',
        config.src + 'img/**/*.{png,svg,gif,jpg}',
        config.src + 'index.jade'
      ], ['default']);
    });
});

gulp.task('default', ['copy', 'templates', 'inject']);
