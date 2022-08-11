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
const svgstore = require('gulp-svgstore')
const imagemin = require('gulp-imagemin')
const webp = require('gulp-webp')

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

const optimizeImg = () => {
  return gulp
    .src('./src/img/content/*.{jpeg,jpg,png,gif,webp}')
    .pipe(
      imagemin({
        verbose: true,
      })
    )
    .pipe(gulp.dest('./dist/img'))
}

const copyImg = () => {
  return gulp
    .src('./src/img/content/**/*.{jpeg,jpg,png,gif,webp}')
    .pipe(gulp.dest('./dist/img'))
}

const fonts = () => {
  return gulp.src('src/fonts/**').pipe(gulp.dest('dist/fonts'))
}

const svgo = () => {
  return gulp
    .src('src/img/**/*.svg')
    .pipe(
      imagemin([
        imagemin.svgo({
          plugins: [
            { removeViewBox: false },
            { removeRasterImages: true },
            { removeUselessStrokeAndFill: false },
          ],
        }),
      ])
    )
    .pipe(gulp.dest('src/img'))
}

const sprite = () => {
  return gulp
    .src('src/img/sprite/*.svg')
    .pipe(svgstore({ inlineSvg: true }))
    .pipe(rename('sprite.svg'))
    .pipe(gulp.dest('dist/img'))
}

const createWebp = () => {
  return gulp
    .src('src/img/content/*.{jpeg,jpg,png}')
    .pipe(webp())
    .pipe(gulp.dest('src/img/content'))
}

const serve = () => {
  browserSync.init({
    server: { baseDir: './dist' },
    notify: false,
  })

  gulp.watch('src/html/**/*.html', gulp.series(html, browserSync.reload))
  gulp.watch('src/js/**/*.js', gulp.series(js, browserSync.reload))
  gulp.watch('src/scss/**/*.scss', gulp.series(scss, browserSync.stream))
  gulp.watch('src/img/content/**/*.{jpeg,jpg,png,gif}'),
    gulp.series(copyImg, browserSync.reload)
  gulp.watch('src/img/sprite/**/*.svg'), gulp.series(sprite, browserSync.reload)
}

const build = gulp.series(js, html, scss, optimizeImg, svgo, sprite, fonts)
const dev = gulp.series(js, html, scss, copyImg, sprite, fonts)
const start = gulp.series(dev, serve)

exports.webp = createWebp
exports.build = build
exports.dev = dev
exports.start = start
