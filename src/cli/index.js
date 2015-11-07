#! /usr/bin/env node

import { exec } from 'child_process';
import path from 'path';
import program from 'commander';
import pkg from '../package.json';

import gulp from 'gulp';
import gulpLogEvents from './gulpLogEvents';
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

program
  .command('serve')
  .alias('s')
  .description('launch server')
  .action(() => {
    const env = {
      d: program.env === 'development',
      t: program.env === 'test',
      p: program.env === 'production',
    };

    const dest = (
      env.d? 'debug':
      env.t? 'test':
             'release');

    /**
     * Specify gulp tasks
     */

    // watching source files
    gulp.task('watch', () => {
      if (program.watch) {
        return gulp
          .watch('./src/**/*.js', ['build']);
      }
    });

    // build source files
    gulp.task('build', () => {
      return gulp
        .src('./src/**/*.js')
        .pipe(gulpif(program.watch, changed('./build/' + dest)))
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