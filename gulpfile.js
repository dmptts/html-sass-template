const gulp = require('gulp')
const webpack = require('webpack')
const webpackStream = require('webpack-stream')
const webpackConfig = require('./webpack.config')

const js = () => {
  return gulp
    .src('./src/js/index.js')
    .pipe(webpackStream(webpackConfig), webpack)
    .pipe(gulp.dest('./dist/js'))
}

const html = () => {
  return gulp.src('./src/*.html').pipe(gulp.dest('./dist'))
}

const build = gulp.series(js, html)

exports.build = build
