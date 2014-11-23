
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
    plumber     = require('gulp-plumber'),
    rev         = require('gulp-rev'),
    gutil       = require('gulp-util'),
    watch       = require('gulp-watch'),
    del         = require('del'),
    debug       = require('gulp-debug'),
    path        = require('path');

// Setup config
var config = {

    // Set to true to debug specific tasks
    debug: false,
    // Set a task to true to debug it
    debugTask: {
        'copy': false,
        'images': false,
        'bowerfiles': false,
        'scripts': false,
        'styles': true,
        'index': false,
        'templates': true
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
    return gulp.src(config.src + 'copy/**/*', { dot: true })
        .pipe(plumber())
        .pipe(watching ? watch(config.src + 'copy/**/*') : gutil.noop())
        .pipe(changed(config.dest))
        .pipe(pipeDebug('copy'))
        .pipe(gulp.dest(config.dest));
});

gulp.task('images', function () {
    return gulp.src(config.src + 'img/**/*.{png,svg,gif,jpg}')
        .pipe(plumber())
        .pipe(watching ? watch(config.src + 'img/**/*') : gutil.noop())
        .pipe(changed(config.destAssets + 'images/'))
        .pipe(pipeDebug('images'))
        // Optimize images
        .pipe(imagemin())
        .pipe(gulp.dest(config.destAssets + 'images/'));
});

gulp.task('bowerfiles', function () {
    return gulp.src(bowerfiles(), { base: './bower_components' })
        .pipe(plumber())
        .pipe(pipeDebug('bowerfiles'))
        .pipe(gulp.dest(config.destAssets + 'bower_components/'));
});

gulp.task('scripts', function () {
    return gulp.src([config.src + 'js/app.js', config.src + 'js/**/*.js'])
        .pipe(plumber())
        // Using gulp-watch here will only rebuild changed files
        // Set config.debugTask.scripts to true to see it in action
        .pipe(watching ? watch(config.src + 'js/**/*.js') : gutil.noop())
        .pipe(pipeDebug('scripts'))
        .pipe(gulp.dest(config.destAssets + 'js/'));
});

gulp.task('styles', function () {
    var dest = config.destAssets + 'css/';
    return gulp.src(config.src + 'css/app.less')
        .pipe(plumber())
        .pipe(watching ? watch(config.src + 'css/**/*.less') : gutil.noop())
        .pipe(pipeDebug('styles'))
        .pipe(less({
            paths: [path.join(__dirname, 'less', 'includes')]
        }))
        .pipe(autoprefixer('last 1 version'))
        .pipe(gulp.dest(dest));
});

gulp.task('templates', function () {
    return gulp.src(config.src + 'views/**/*.jade')
        .pipe(plumber())
        .pipe( watching ? watch(config.src + 'views/**/*.jade') : gutil.noop())
        .pipe(pipeDebug('templates'))
        .pipe(jade(config.jade))
        .pipe(gulp.dest(config.destAssets + 'views/'));
});

gulp.task('index', ['copy', 'images', 'bowerfiles', 'scripts', 'styles', 'templates'], function () {
    console.log('in index');
    return gulp.src(config.src + 'index.jade')
        .pipe(plumber())
        .pipe(pipeDebug('index'))
        .pipe(jade(config.jade))
        .pipe(inject(
            gulp.src([config.destAssets + 'bower_components/**/*'], { read: false }),
            config.injectVendor
        ))
        .pipe(inject(
            gulp.src([config.destAssets + 'js/**/*', config.destAssets + 'css/**/*'], { read: false }),
            config.inject
        ))
        .pipe(gulp.dest('public'));
});

// Default build task
gulp.task('default', ['index']);

// Use watch task to run default task and trigger watching
var watching = false;
gulp.task('watch', function () {
    gulp.start('default', function () {
        // Set watching flag
        watching = true;
        // Re-start watch tasks
        gulp.start('copy');
        gulp.start('images');
        gulp.start('scripts');
        gulp.start('styles');
        gulp.start('templates');
    });
});
