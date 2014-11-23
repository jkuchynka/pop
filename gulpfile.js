
// Require packages
var
    es          = require('event-stream'),
    bowerfiles  = require('main-bower-files'),
    gulp        = require('gulp'),
    autoprefixer= require('gulp-autoprefixer'),
    changed     = require('gulp-changed'),
    imagemin    = require('gulp-imagemin'),
    inject      = require('gulp-inject'),
    jade        = require('gulp-jade'),
    less        = require('gulp-less'),
    rev         = require('gulp-rev'),
    gutil       = require('gulp-util'),
    watch       = require('gulp-watch'),
    del         = require('del'),
    debug       = require('gulp-debug'),
    path        = require('path');

// Setup config
var config = {

    // Set to true to debug specific tasks
    debug: true,
    // Set a task to true to debug it
    debugTask: {
        'copy:static': false,
        'copy:images': false,
        'inject:bowerfiles': false,
        'inject:scripts': false,
        'inject:styles': false,
        'inject:index': false,
        'inject:watchindex': true,
        'templates:views': false
    },
    // Where to find source files
    src: 'src/',
    // Default "public" destination
    dest: 'public/',
    // Destination for built assets
    destAssets: 'public/assets/',

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
    }
};

var pipeDebug = function (title) {
    if (config.debug && config.debugTask[title]) {
        return debug({ title: title });
    } else {
        return gutil.noop();
    }
};

// Clean out built assets
gulp.task('clean', function () {
    return del([
        config.dest + '**/*',
        // Don't delete server upload files
        '!' + config.dest + '{uploads,uploads/**}',
        '!' + config.dest + '{image,image/**}'
    ]);
});

gulp.task('copy', function () {
    // Copy static files (.htaccess, favicon, index.php, robots.txt, etc...)
    gulp.src(config.src + 'copy/**/*', { dot: true })
        .pipe(changed(config.dest))
        .pipe(pipeDebug('copy:static'))
        .pipe(gulp.dest(config.dest));
    // Copy images
    return gulp.src(config.src + 'img/**/*.{png,svg,gif,jpg}')
        .pipe(changed(config.destAssets + 'images/'))
        .pipe(pipeDebug('copy:images'))
        // Optimize images
        .pipe(imagemin())
        .pipe(gulp.dest(config.destAssets + 'images/'));
});

gulp.task('inject', function () {
    var bfiles = gulp.src(bowerfiles(), { base: './bower_components' })
        .pipe(pipeDebug('inject:bowerfiles'))
        .pipe(gulp.dest(config.destAssets + 'bower_components/'));

    var scriptsSrc = [config.src + 'js/app.js', config.src + 'js/**/*.js'];
    var scripts = gulp.src(scriptsSrc)
        .pipe(pipeDebug('inject:scripts'))
        .pipe(gulp.dest(config.destAssets + 'js/'));

    var styles = gulp.src(config.src + 'css/app.less')
        .pipe(pipeDebug('inject:styles'))
        .pipe(less({
            paths: [path.join(__dirname, 'less', 'includes')]
        }))
        .pipe(autoprefixer('last 1 version'))
        .pipe(gulp.dest(config.destAssets + 'css/'));

    return gulp.src(config.src + 'index.jade')
        .pipe(pipeDebug('inject:index'))
        .pipe(jade(config.jade))
        .pipe(inject( bfiles, config.injectVendor ))
        .pipe(inject( es.merge(styles, scripts), config.inject ))
        .pipe(gulp.dest('public'));
});

gulp.task('templates', function () {
    return gulp.src(config.src + 'views/**/*.jade')
        .pipe(pipeDebug('templates:views'))
        .pipe(jade(config.jade))
        .pipe(gulp.dest(config.destAssets + 'views/'));
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
