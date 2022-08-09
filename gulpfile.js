const gulp = require('gulp')
const webpackStream = require('webpack-stream')
const webpackConfig = require('./webpack.config')
const browserSync = require('browser-sync').create()
const plumber = require('gulp-plumber')
const sass = require('gulp-sass')(require('sass'))
const autoprefixer = require('gulp-autoprefixer')
const sourcemap = require('gulp-sourcemaps')
const cgmq = require('gulp-group-css-media-queries')
const csso = require('gulp-csso')
const rename = require('gulp-rename')

const js = () => {
  return gulp
    .src('./src/js/index.js')
    .pipe(webpackStream(webpackConfig))
    .pipe(gulp.dest('./dist/js'))
}

const html = () => {
  return gulp.src('./src/html/**/*.html').pipe(gulp.dest('./dist'))
}

const scss = () => {
  return gulp
    .src('./src/scss/main.scss')
    .pipe(plumber())
    .pipe(sourcemap.init())
    .pipe(sass())
    .pipe(autoprefixer())
    .pipe(cgmq())
    .pipe(gulp.dest('./dist/scss'))
    .pipe(csso())
    .pipe(rename('main.min.css'))
    .pipe(sourcemap.write('.'))
    .pipe(gulp.dest('./dist/scss'))
}

const serve = () => {
  browserSync.init({
    server: { baseDir: './dist' },
    notify: false,
  })

  gulp.watch('src/html/**/*.html', gulp.series(html, browserSync.reload))
  gulp.watch('src/js/**/*.js', gulp.series(js, browserSync.reload))
  gulp.watch('src/scss/**/*.scss', gulp.series(scss, browserSync.stream))
}

const build = gulp.series(js, html, scss)
const start = gulp.series(build, serve)

exports.build = build
exports.start = start
