
// Require packages
var bower       = require('bower'),
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
    rimraf      = require('gulp-rimraf')
    watch       = require('gulp-watch')
    path        = require('path'),
    lr          = require('tiny-lr'),
    server      = lr();

// Setup config
var config = {
    // Default destination
    dest: 'public/',
    // Destination for built assets
    destAssets: 'public/assets/',
    // Destination for built images
    destImg: 'public/assets/images/',
    // Where to find source files
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
    // Config for jade
    jade: {
        locals: {},
        pretty: !gutil.env.production
    }
};

// Clean out built assets
gulp.task('clean', function () {
    return gulp.src(config.destAssets, {read: false})
        .pipe(rimraf());
});

// Copy assets straight over to default destination
gulp.task('copy', function () {
    gulp.src(config.src + 'copy/**', { dot: true })
        .pipe(gulp.dest(config.dest));
});

// Optimize and put images in assets
gulp.task('images', function () {
    return gulp.src(config.src + 'img/**')
        .pipe(changed(config.destImg))  // Ignore unchanged files
        .pipe(imagemin())   // Optimize
        .pipe(gulp.dest(config.destImg));
});

// Build the main index html file
gulp.task('index', function () {
    return gulp.src(config.src + 'index.jade')
        .pipe(jade(config.jade))
        .pipe(gulp.dest(config.dest))
        .pipe(expect(config.dest + 'index.html'));
});

// Build js and css assets and inject into index html file
gulp.task('inject', ['index'], function () {
    
    // Get all the files from bower packages and
    // put them in assets
    var bower = gulp.src(bowerfiles(), {
            base: './bower_components'
        })
        .pipe(gulp.dest(config.destAssets + 'bower_components/'));


    // Get all the app scripts
    var scripts = gulp.src([config.src + 'js/app.js', config.src + 'js/**/*.js'])
        // Minimize if in production
        .pipe(gutil.env.production ? ngmin() : gutil.noop())
        // Concat into one file if in production
        .pipe(gutil.env.production ? concat('script.js') : gutil.noop())
        // Uglify if in production
        .pipe(gutil.env.production ? uglify() : gutil.noop())
        // Give all resulting scripts a new revision to bypass browser cache
        .pipe(rev())
        // Put in assets
        .pipe(gulp.dest(config.destAssets + 'js/'));

    
    // Get all the app styles
    var styles = gulp.src(config.src + 'css/app.less')
        .pipe(less({
            paths: [path.join(__dirname, 'less', 'includes')]
        }))
        // Add prefixes to styles
        .pipe(autoprefixer('last 1 version'))
        // Give all resulting files a new revision to bypass browser cache
        .pipe(rev())
        // Put in assets
        .pipe(gulp.dest(config.destAssets + 'css/'));

    // Get built index html file
    return gulp.src(config.dest + 'index.html')
        // Inject bower files
        .pipe(inject(bower, config.injectVendor))
        // Inject app styles and scripts
        .pipe(inject(es.merge(styles, scripts), config.inject))
        // Put in default destination
        .pipe(gulp.dest(config.dest));
});

// Build templates and put in assets
gulp.task('templates', function () {
    gulp.src(config.src + 'views/**/*.jade')
        .pipe(jade(config.jade))
        .pipe(gulp.dest(config.destAssets + 'views/'));
});

// Watch for changes and re-run tasks
gulp.task('watch', function () {
    gulp.start('default', function () {
        gulp.watch([
            config.src + 'js/**/*.js',
            config.src + 'css/**/*.less',
            config.src + 'views/**/*.jade',
            config.src + 'copy/**/*',
            config.src + 'img/**/*.{png,svg,gif,jpg}',
            config.src + 'index.jade'
      ], ['default']);
    });
});

gulp.task('default', ['images', 'copy', 'templates', 'index', 'inject']);
