#! /usr/bin/env node

import path from 'path';
import fs from 'fs';
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
import mocha from 'gulp-mocha';

// since we are calling gulp tasks from node scripts
// instead of `gulp` command, we use the logging
// function extracted from gulp's source code
// to keep logs working properly
gulpLogEvents(gulp);

const registerTasks = (options) => {
  /**
   * Prepare env parameters
   */

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

  let appProcess;

  /**
   * Specify gulp tasks
   */

  // watching source files
  gulp.task('watch', () => {
    if (options.watch) {
      gulp
        .watch([
          // refer to `build` task's src
          './src/**/*.js',
          '!src/*/public/**/*.js',
        ], ['build']);
      gulp
        .watch([
          // refer to `copy` task's src
          'src/*/public/**/*',
        ], ['copy']);
    }
  });

  // build source files
  gulp.task('build', () => {
    return gulp
      .src([
        './src/**/*.js',
        '!src/*/public/**/*.js',
      ])
      .pipe(gulpif(options.watch, changed('./build/' + dest)))
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
        sourceRoot: (file) => {
          return path.join(process.cwd(), 'src');
        },
      })))
      .pipe(gulp.dest('./build/' + dest));
  });

  gulp.task('copy', function() {
    return gulp
      .src([
        'src/*/public/**/*',
      ])
      .pipe(gulpif(options.watch, changed('./build/' + dest)))
      .pipe(gulp.dest('./build/' + dest));
  });

  gulp.task('exec', ['build', 'copy'], (cb) => {
    const exec = require('child_process').exec;
    appProcess = exec(`node build/${dest}/app.js`, {
      env: {
        // inherit all parent environment variables
        // to run `node` binary with $PATH
        // ref: https://github.com/travis-ci/travis-ci/issues/3894
        ...process.env,
        NODE_ENV: NODE_ENV,
        EXSEED_INIT: options.init,
      },
    });

    // show outputs in realtime
    appProcess.stdout.on('data', (data) => {
      console.log(data);
    });

    appProcess.stderr.on('data', (data) => {
      console.log(data);
    });

    if (!env.t) {
      appProcess.on('close', (code) => {
        cb();
      });
    } else {
      cb();
    }
  });

  gulp.task('nodemon', ['build', 'copy'], (cb) => {
    let started = false;

    return nodemon({
      script: `build/${dest}/app.js`,
      watch: [`build/${dest}/**/*.js`],
      ext: 'js',
      env: {
        NODE_ENV: NODE_ENV,
        EXSEED_WATCH: options.watch,
        EXSEED_INIT: options.init,
      },
      ignore: [
        'gulpfile.js',
        'node_modules/**/*',
        'src/**/*',
        'build/debug/public/js/*/bundle.js',
        'build/debug/public/js/common.js',
        'build/debug/*/flux/**/*',
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

  gulp.task('test', ['exec'], (cb) => {
    // the mocha spec file(s)
    let specSrc;
    const cwd = process.cwd();
    if (options.appDir === undefined) {
      // test all apps
      let targetDir = path.join(cwd, 'build/test');
      specSrc = fs
        .readdirSync(targetDir)
        .map((appDir) => {
          return path.join(targetDir, appDir, 'test/index.js');
        })
        .filter((appSpecPath) => {
          return fs.existsSync(appSpecPath);
        });
    } else {
      // test single app
      specSrc = path.join(
        cwd, 'build/test', options.appDir, 'test/index.js');
    }

    // run mocha test
    setTimeout(() => {
      gulp
        .src(specSrc, { read: false })
        .pipe(mocha({ reporter: 'spec' }))
        .once('error', () => {
          appProcess.kill('SIGINT');
          process.exit(1);
        })
        .once('end', () => {
          appProcess.kill('SIGINT');
          process.exit();
        });
      cb();
    }, 5000);
  });
};

/**
 * Definition of commands
 */

// add custom chain method `addEnvOptions`
program.Command.prototype.addEnvOptions = function() {
  return this
    .option(
      '-d, --development',
      'specify NODE_ENV=development',
      true)
    .option(
      '-t, --test',
      'specify NODE_ENV=test')
    .option(
      '-p, --production',
      'specify NODE_ENV=production');
};

// specify cli version number
program
  .version(pkg.version);

// specify command `initialize`
program
  .command('initialize')
  .alias('init')
  .usage('[-d|-t|-p]')
  .description('initialize installed apps')
  .addEnvOptions()
  .action((options) => {
    options.init = true;
    registerTasks(options);
    // run gulp tasks
    gulp.start('build', 'copy', 'exec');
  });

// specify command `serve`
program
  .command('serve')
  .alias('s')
  .usage('[-d|-t|-p] [-w]')
  .description('launch server')
  .addEnvOptions()
  .option(
    '-w, --watch',
    'watching the changes of files')
  .action((options) => {
    registerTasks(options);
    // run gulp tasks
    gulp.start('build', 'copy', 'nodemon', 'watch');
  });

// specify command `test`
program
  .command('test [appDir]')
  .alias('t')
  .description('test apps')
  .action((appDir) => {
    registerTasks({
      development: false,
      test: true,
      production: false,
      appDir: appDir,
    });
    gulp.start('build', 'copy', 'exec', 'test');
  });

// to customize command name in help information
// ref: https://github.com/tj/commander.js/issues/466
process.argv[1] = 'sd';
program.parse(process.argv);

if (!program.args.length) {
  program.help();
}