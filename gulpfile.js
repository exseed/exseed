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

// watching source files
gulp.task('watch', function() {
  if (program.watch) {
    return gulp
      .watch('./src/**/*.js', ['build']);
  }
});

// build source files
gulp.task('build', function() {
  return gulp
    .src('./src/**/*.js')
    .pipe(gulpif(program.watch, changed('./')))
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

// run gulp tasks
gulp.task('default', function() {
  gulp.start('build', 'watch');
});