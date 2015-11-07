#! /usr/bin/env node

import {exec} from 'child_process';
import program from 'commander';
import pkg from '../package.json';

import gulp from 'gulp';
import gulpLogEvents from './gulpLogEvents';
import changed from 'gulp-changed';
import babel from 'gulp-babel';
import nodemon from 'gulp-nodemon';

/**
 * Specify gulp tasks
 */

// since we are calling gulp tasks from node scripts
// instead of `gulp` command, we use the logging
// function extracted from gulp's source code
// to keep logs working properly
gulpLogEvents(gulp);

const errorHandler = (err) => {
  console.log(err.toString());
  this.emit('end');
};

// watching source files
gulp.task('watch', () => {
  return gulp
    .watch('./src/**/*.js', ['build']);
});

// build source files
gulp.task('build', () => {
  return gulp
    .src('./src/**/*.js')
    .pipe(changed('./build/debug'))
    .pipe(babel({
      presets: [
        'es2015',
        'stage-0',
        'stage-1',
      ],
    }))
    .on('error', errorHandler)
    .pipe(gulp.dest('./build/debug'));
});

gulp.task('nodemon', (cb) => {
  if (env.d) {
    let started = false;

    return nodemon({
      script: 'build/debug/app.js',
      ext: 'js',
      env: {
        NODE_ENV: program.env,
      },
      ignore: [
        'gulpfile.js',
        'node_modules/**/*',
        'src/**/*',
        'build/debug/public/js/*/bundle.js',
        'build/debug/public/js/common.js',
        'build/release/**/*',
        'build/test/**/*',
      ],
    })
    .on('start', () => {
      if (!started) {
        cb();
        started = true;
      }
    })
    .on('restart', () => {
    });
  } else {
    cb();
  }
});

// run gulp tasks
gulp.task('default', () => {
  gulp.start('build', 'nodemon', 'watch');
});

/**
 * Definition of commands
 */

program
  .version(pkg.version)
  .usage('[options]')
  .option(
    '-e, --env <env>',
    'specify NODE_ENV (development|test|production)',
    'development')
  .option(
    '-w, --watch',
    'watching the changes of files',
    false);

const env = {
  d: program.env === 'development',
  t: program.env === 'test',
  p: program.env === 'production',
};

// to customize command name in help information
// ref: https://github.com/tj/commander.js/issues/466
process.argv[1] = 'sd';
program.parse(process.argv);

if (!program.args.length) {
  gulp.start('default');
}