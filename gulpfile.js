/*------------------------------------*\
   Include plugins
\*------------------------------------*/
var gulp = require('gulp'),
  gutil = require('gulp-util'),
  fileinclude = require('gulp-file-include'),
  wait = require('gulp-wait'),
  browserSync = require('browser-sync'),
  sass = require('gulp-sass'),
  autoprefixer = require('gulp-autoprefixer'),
  cssnano = require('gulp-cssnano'),
  uglify = require('gulp-uglify'),
  rename = require('gulp-rename'),
  imagemin = require('gulp-imagemin'),
  filesize = require('gulp-filesize'),
  notify = require('gulp-notify');

gulp.task('html', function () {
  return gulp.src(['./src/[^_]*.html'])
    .pipe(fileinclude({
      prefix: '@@',
      basepath: '@file'
    }))
    .pipe(gulp.dest('./build/'))
    .pipe(browserSync.reload({
      stream: true
    }))
    // .pipe(notify('HTML compiled!'));
});

/*------------------------------------*\
  SCSS & CSS
\*------------------------------------*/
gulp.task('styles', function () {
  return gulp.src('src/scss/main.scss')
    .pipe(wait(1000))
    .pipe(sass().on('error', sass.logError))
    .pipe(autoprefixer('last 4 version'))
    .pipe(rename({
      basename: 'styles'
    }))
    .pipe(gulp.dest('build/css'))
    .pipe(filesize())
    .pipe(cssnano())
    .pipe(rename({
      suffix: '.min'
    }))
    .pipe(gulp.dest('build/css'))
    .pipe(filesize())
    .pipe(browserSync.reload({
      stream: true
    }))
    // .pipe(notify('Styles compiled!'));
});

/*------------------------------------*\
  JS
\*------------------------------------*/
gulp.task('js', function(done) {
  gulp.src('src/js/scripts.js')
    .pipe(gulp.dest('build/js'))
    .pipe(filesize())
    .pipe(uglify())
    .on('error', function(err) {
      gutil.log(gutil.colors.red('[Error]'), err.toString());
    })
    .pipe(rename({
      suffix: '.min'
    }))
    .pipe(gulp.dest('build/js'))
    .pipe(filesize())
    .pipe(browserSync.reload({
      stream: true
    }));
    // .pipe(notify('Scripts compiled!'));
    done();
});

/*------------------------------------*\
  Favicon
\*------------------------------------*/
gulp.task('favicon', function () {
  return gulp.src('src/*.ico')
    .pipe(gulp.dest('build'));
});

/*------------------------------------*\
  Images
\*------------------------------------*/
gulp.task('img', function () {
  return gulp.src('src/img/*')
    .pipe(imagemin())
    .pipe(gulp.dest('build/img'))
    .pipe(browserSync.reload({
      stream: true
    }));
});

/*------------------------------------*\
  Browsersync
\*------------------------------------*/
gulp.task('browser-sync', function() {
  browserSync.init(null, {
    server: {
      baseDir: 'build'
    }
  });
  browserSync.watch('build', browserSync.reload());
});

/*------------------------------------*\
  Watch
\*------------------------------------*/
gulp.task('watch', function () {
  gulp.watch("src/*.html", gulp.series('html'));
  gulp.watch("src/scss/**/*.scss", gulp.series('styles'));
  gulp.watch('src/js/**/*.js', gulp.series('js'));
  gulp.watch("src/*.ico", gulp.series('favicon'));
  gulp.watch("src/img/*.{png,jpg,jpeg,gif,svg}", gulp.series('img'));
});

/*------------------------------------*\
  Default
\*------------------------------------*/
gulp.task('default', gulp.series(
  gulp.parallel('html', 'styles', 'js', 'favicon', 'img'),
  gulp.parallel('watch', 'browser-sync')
));