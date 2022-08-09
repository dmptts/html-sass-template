const gulp = require('gulp')
const webpack = require('webpack')
const webpackStream = require('webpack-stream')
const webpackConfig = require('./webpack.config')
const browserSync = require('browser-sync').create()

const js = () => {
  return gulp
    .src('./src/js/index.js')
    .pipe(webpackStream(webpackConfig))
    .pipe(gulp.dest('./dist/js'))
}

const html = () => {
  return gulp.src('./src/html/**/*.html').pipe(gulp.dest('./dist'))
}

const serve = () => {
  browserSync.init({
    server: { baseDir: './dist' },
    notify: false,
  })

  gulp.watch('src/html/**/*.html', gulp.series(html, browserSync.reload))
  gulp.watch('src/js/**/*.js', gulp.series(js, browserSync.reload))
}

const build = gulp.series(js, html)
const start = gulp.series(build, serve)

exports.build = build
exports.start = start
