const gulp = require('gulp');
const postcss = require('gulp-postcss');
const cleanCSS = require('gulp-clean-css');
require('dotenv').config();
const gulpIf = require('gulp-if');

var env = process.env.NODE_ENV || 'development';

function css() {

  return gulp.src('src/styles.css').pipe(postcss([
                                                   require('tailwindcss'),
                                                   require('autoprefixer'),
                                                 ])).
              pipe(gulpIf(env === 'production', cleanCSS())).
              pipe(gulp.dest('html/css'));
}

function watchFiles() {
  gulp.watch('src/*', css);
}

exports.watch = watchFiles;
exports.css = css;
exports.default = css;
