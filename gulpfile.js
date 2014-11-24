
// Require packages
var
    bowerfiles  = require('main-bower-files'),
    gulp        = require('gulp'),
    autoprefixer= require('gulp-autoprefixer'),
    changed     = require('gulp-changed'),
    concat      = require('gulp-concat'),
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
    notify      = require('gulp-notify'),
    path        = require('path'),
    filter      = require('gulp-filter'),
    flatten     = require('gulp-flatten'),
    es          = require('event-stream'),
    browserSync = require('browser-sync'),
    reload      = browserSync.reload;

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
        'templates': false
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
    },
    plumber: {
        errorHandler: notify.onError('Error: <%= error.message %>')
    }
};

var pipeDebug = function (title) {
    if (config.debug && config.debugTask[title]) {
        return debug({ title: title });
    } else {
        return gutil.noop();
    }
};

gulp.task('browser-sync', function () {
    browserSync({
        proxy: 'pop.localhost'
    });
});

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
        .pipe(plumber(config.plumber))
        .pipe(watching ? watch(config.src + 'copy/**/*') : gutil.noop())
        .pipe(changed(config.dest))
        .pipe(pipeDebug('copy'))
        .pipe(gulp.dest(config.dest))
        .pipe(reloading ? reload({ stream: true }) : gutil.noop());
});

gulp.task('images', function () {
    return gulp.src(config.src + 'img/**/*.{png,svg,gif,jpg}')
        .pipe(plumber(config.plumber))
        .pipe(watching ? watch(config.src + 'img/**/*') : gutil.noop())
        .pipe(changed(config.destAssets + 'images/'))
        .pipe(pipeDebug('images'))
        // Optimize images
        .pipe(imagemin())
        .pipe(gulp.dest(config.destAssets + 'images/'))
        .pipe(reloading ? reload({ stream: true }) : gutil.noop());
});

gulp.task('templates', function () {
    return gulp.src(config.src + 'views/**/*.jade')
        .pipe(plumber(config.plumber))
        .pipe(watching ? watch(config.src + 'views/**/*.jade') : gutil.noop())
        .pipe(pipeDebug('templates'))
        .pipe(jade(config.jade))
        .pipe(gulp.dest(config.destAssets + 'views/'))
        .pipe(reloading ? reload({ stream: true }) : gutil.noop());
});

// Default build task
gulp.task('default', function () {

    gulp.start('copy');
    gulp.start('images');
    gulp.start('templates');

    var vendor = gulp.src(bowerfiles(), { base: './bower_components' })
        .pipe(plumber(config.plumber))
        .pipe(pipeDebug('bowerfiles'))
        .pipe(gulp.dest(config.destAssets + 'bower_components/'));

    var js = gulp.src([config.src + 'js/app.js', config.src + 'js/**/*.js'])
        .pipe(plumber(config.plumber))
        .pipe(watching ? watch(config.src + 'js/**/*.js') : gutil.noop())
        .pipe(pipeDebug('scripts'))
        .pipe(gulp.dest(config.destAssets + 'js/'))
        .pipe(reloading ? reload({ stream: true }) : gutil.noop());

    var css = gulp.src(config.src + 'css/app.less')
        .pipe(plumber(config.plumber))
        .pipe(watching ? watch(config.src + 'css/**/*.less', function (files) {
            return gulp.src(config.src + 'css/app.less')
                .pipe(plumber(config.plumber))
                .pipe(pipeDebug('styles'))
                .pipe(less({
                    paths: [path.join(__dirname, 'less', 'includes')]
                }))
                .pipe(autoprefixer('last 1 version'))
                .pipe(gulp.dest(config.destAssets + 'css/'))
                .pipe(reload({ stream: true }));
        }) : gutil.noop())
        .pipe(pipeDebug('styles'))
        .pipe(less({
            paths: [path.join(__dirname, 'less', 'includes')]
        }))
        .pipe(autoprefixer('last 1 version'))
        .pipe(gulp.dest(config.destAssets + 'css/'));

    return gulp.src(config.src + 'index.jade')
        .pipe(plumber(config.plumber))
        .pipe(pipeDebug('index'))
        .pipe(jade(config.jade))
        .pipe(inject(
            vendor, config.injectVendor
        ))
        .pipe(inject(es.merge(js, css), config.inject))
        .pipe(gulp.dest('public'));
});

// Build for non-development environments (staging, production)
// Does the same as default and watch, except:
// Doesn't watch
// Concats css/js into 1 file each
// Minimizes css/js
// Revisions css/js
// @todo: Templates (public/assets/views) folder is currently
// set to expires: -1 in nginx (so doesn't cache). Maybe figure out
// a better way to do this.
gulp.task('build', function () {
    gulp.start('copy');
    gulp.start('images');
    gulp.start('templates');

    var css = gulp.src(config.src + 'css/app.less')
        .pipe(less({
            paths: [path.join(__dirname, 'less', 'includes')]
        }))
        .pipe(autoprefixer('last 1 version'))
        .pipe(concat('pop.css'))
        .pipe(rev())
        .pipe(gulp.dest(config.destAssets + 'css/'));

    var js = gulp.src([config.src + 'js/app.js', config.src + 'js/**/*.js'])
        .pipe(concat('pop.js'))
        .pipe(rev())
        .pipe(gulp.dest(config.destAssets + 'js/'));

    var vendorJs = gulp.src(bowerfiles(), { base: './bower_components' })
        .pipe(filter('**/*.js'))
        .pipe(concat('vendor.js'))
        .pipe(rev())
        .pipe(gulp.dest(config.destAssets + 'js/'));

    var vendorCss = gulp.src(bowerfiles(), { base: './bower_components' })
        .pipe(filter('**/*.css'))
        .pipe(concat('vendor.css'))
        .pipe(rev())
        .pipe(gulp.dest(config.destAssets + 'css/'));

    gulp.src(bowerfiles(), { base: './bower_components' })
        .pipe(filter(['**/*.eot', '**/*.woff', '**/*.svg', '**/*.ttf']))
        .pipe(flatten())
        .pipe(gulp.dest(config.destAssets + 'fonts/'));

    return gulp.src(config.src + 'index.jade')
        .pipe(jade(config.jade))
        .pipe(inject(es.merge(vendorJs, vendorCss), config.injectVendor))
        .pipe(inject(es.merge(css, js), config.inject))
        .pipe(gulp.dest('public'));
});

// Use watch task to run default task and trigger watching
var watching = false,
    reloading = false;
gulp.task('watch', function () {
    gulp.start('browser-sync');
    gulp.start('default', function () {
        // Set watching flag
        watching = true;
        // Set reloading flag
        reloading = true;
        // Re-start watch tasks
        gulp.start('default');
    });
});
