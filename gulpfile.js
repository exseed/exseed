var path = require('path');
var gulp = require('gulp');
var changed = require('gulp-changed');
var babel = require('gulp-babel');
var sourcemaps = require('gulp-sourcemaps');
var gulpif = require('gulp-if');
var notify = require("gulp-notify");
var program = require('commander');

program
  .usage('[options]')
  .option(
    '-e, --env <env>',
    'specify environment (development|test|production)',
    'development')
  .option(
    '-w, --watch',
    'watching the changes of files',
    false)
  .parse(process.argv);

var env = {
  d: program.env === 'development',
  t: program.env === 'test',
  p: program.env === 'production',
};

var files = {
  library: [
    './src/**/*.js',
    '!./src/templates/**/*.js',
  ],
  template: './src/templates/**/*.js',
};

// watching source files
gulp.task('watch', function() {
  if (program.watch) {
    gulp.watch(files.library, ['build:library']);
    gulp.watch(files.template, ['build:template']);
  }
});

// build source files
gulp.task('build:library', function() {
  return gulp
    .src(files.library)
    .pipe(gulpif(program.watch, changed('./dist')))
    .pipe(gulpif(env.d, sourcemaps.init()))
      .pipe(babel({
        presets: [
          'es2015',
          'stage-0',
          'stage-1',
          'react',
        ],
      }))
      .on('error', notify.onError({
        title: 'babel fail',
        message: '<%= error.message %>',
      }))
    .pipe(gulpif(env.d, sourcemaps.write({
      includeContent: false,
      sourceRoot: function(file) {
        return path.resolve(__dirname, 'src');
      },
    })))
    .pipe(gulp.dest('./dist'));
});

gulp.task('build:template', function() {
  return gulp
    .src(files.template)
    .pipe(gulpif(program.watch, changed('./core')))
    .pipe(gulpif(env.d, sourcemaps.init()))
      .pipe(babel({
        presets: [
          'es2015',
          'stage-0',
          'stage-1',
          'react',
        ],
      }))
      .on('error', notify.onError({
        title: 'babel fail',
        message: '<%= error.message %>',
      }))
    .pipe(gulpif(env.d, sourcemaps.write({
      includeContent: false,
      sourceRoot: function(file) {
        return path.resolve(__dirname, 'src/templates');
      },
    })))
    .pipe(gulp.dest('./core'));
});

// run gulp tasks
gulp.task('default', function() {
  gulp.start('build:library', 'build:template', 'watch');
});