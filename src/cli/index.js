#! /usr/bin/env node

import path from 'path';
import program from 'commander';
import pkg from '../package.json';

import gulp from 'gulp';
import gulpLogEvents from './gulpLogEvents';
import gutil from 'gulp-util';
import changed from 'gulp-changed';
import babel from 'gulp-babel';
import sourcemaps from 'gulp-sourcemaps';
import gulpif from 'gulp-if';
import notify from 'gulp-notify';
import nodemon from 'gulp-nodemon';

// since we are calling gulp tasks from node scripts
// instead of `gulp` command, we use the logging
// function extracted from gulp's source code
// to keep logs working properly
gulpLogEvents(gulp);

/**
 * Definition of commands
 */

program
  .version(pkg.version);

program
  .command('serve')
  .alias('s')
  .usage('[-d|-t|-p] [-w]')
  .description('launch server')
  .option(
    '-d, --development',
    'specify NODE_ENV=development')
  .option(
    '-t, --test',
    'specify NODE_ENV=test')
  .option(
    '-p, --production',
    'specify NODE_ENV=production')
  .option(
    '-w, --watch',
    'watching the changes of files')
  .action((options) => {
    const env = {
      d: options.development,
      t: options.test,
      p: options.production,
    };

    // give default environment
    if (!env.d && !env.t && !env.p) {
      env.d = true;
    }

    // check correctness
    if (!((env.d && !env.t && !env.p) ||
          (!env.d && env.t && !env.p) ||
          (!env.d && !env.t && env.p))) {
      gutil.log(gutil.colors.red(
        '-d, -t and -p switches cannot be used in parallel'));
      return;
    }

    const NODE_ENV = (
      env.d? 'development':
      env.t? 'test':
             'production');

    const dest = (
      env.d? 'debug':
      env.t? 'test':
             'release');

    /**
     * Specify gulp tasks
     */

    // watching source files
    gulp.task('watch', () => {
      if (options.watch) {
        return gulp
          .watch('./src/**/*.js', ['build']);
      }
    });

    // build source files
    gulp.task('build', () => {
      return gulp
        .src('./src/**/*.js')
        .pipe(gulpif(options.watch, changed('./build/' + dest)))
        .pipe(gulpif(env.d, sourcemaps.init()))
          .pipe(babel({
            presets: [
              'es2015',
              'stage-0',
              'stage-1',
            ],
          }))
          .on('error', notify.onError({
            title: 'babel fail',
            message: '<%= error.message %>',
          }))
        .pipe(gulpif(env.d, sourcemaps.write({
          includeContent: false,
          sourceRoot: (file) => {
            return path.join(process.cwd(), 'src');
          },
        })))
        .pipe(gulp.dest('./build/' + dest));
    });

    gulp.task('nodemon', (cb) => {
      let started = false;

      return nodemon({
        script: `build/${dest}/app.js`,
        watch: [`build/${dest}/**/*.js`],
        ext: 'js',
        env: {
          NODE_ENV: NODE_ENV,
        },
        ignore: [
          'gulpfile.js',
          'node_modules/**/*',
          'src/**/*',
          'build/debug/public/js/*/bundle.js',
          'build/debug/public/js/common.js',
          'build/release/public/js/*/bundle.js',
          'build/release/public/js/common.js',
          'build/test/public/js/*/bundle.js',
          'build/test/public/js/common.js',
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
    });

    // run gulp tasks
    gulp.start('build', 'nodemon', 'watch');
  });

// to customize command name in help information
// ref: https://github.com/tj/commander.js/issues/466
process.argv[1] = 'sd';
program.parse(process.argv);

if (!program.args.length) {
  program.help();
}