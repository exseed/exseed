#! /usr/bin/env node

import path from 'path';
import fs from 'fs';
import program from 'commander';
import pkg from '../../package.json';
import { getEnv } from '../share/env';

import gulp from 'gulp';
import gulpLogEvents from './gulpLogEvents';
import gutil from 'gulp-util';
import changed from 'gulp-changed';
import babel from 'gulp-babel';
import webpack from 'webpack';
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

  let _env = getEnv(options);
  if (_env.errors) {
    if (_env.errors.ERR_NO_ENV) {
      gutil.log('using `development` environment');
    } else if (_env.errors.ERR_MULTIPLE_ENV) {
      gutil.log(gutil.colors.red(
        '-d, -t and -p switches cannot be used in parallel'));
      process.exit(1);
    }
  }

  let _appProcess;

  /**
   * Specify gulp tasks
   */

  const files = {
    scripts: [
      './src/**/*.js',
      '!src/*/public/**/*.js',
    ],
    flux: [
      './src/*/flux/**/*.js',
    ],
    statics: [
      'src/*/public/**/*',
    ],
    nodemonRestartIgnore: [
      'gulpfile.js',
      'node_modules/**/*',
      'src/**/*',
      'build/debug/*/public/js/bundle.js',
      'build/debug/public/js/common.js',
      'build/debug/*/flux/**/*',
      'build/release/*/public/js/bundle.js',
      'build/release/public/js/common.js',
      'build/test/*/public/js/bundle.js',
      'build/test/public/js/common.js',
    ],
  };

  // watching source files
  gulp.task('watch', () => {
    if (_env.watch) {
      gulp.watch(files.scripts, ['build']);
      gulp.watch(files.flux, ['webpack']);
      gulp.watch(files.statics, ['copy']);
    }
  });

  // build source files
  gulp.task('build', () => {
    return gulp
      .src(files.scripts)
      .pipe(gulpif(_env.watch, changed(_env.dir.projectTarget)))
      .pipe(gulpif(_env.env.development, sourcemaps.init()))
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
      .pipe(gulpif(_env.env.development, sourcemaps.write({
        includeContent: false,
        sourceRoot: (file) => {
          return path.join(process.cwd(), 'src');
        },
      })))
      .pipe(gulp.dest(_env.dir.projectTarget));
  });

  gulp.task('webpack', ['build'], (cb) => {
    // to require `app.js` in the correct environment
    process.env.NODE_ENV = _env.NODE_ENV;
    const config = require(`../webpack/webpack.config.${_env.NODE_ENV}`);
    const exseed = require(path.join(
      _env.dir.projectTarget, 'app.js')).default;
    let _appInstances = exseed.getAppInstances();
    let appArray = [];
    for (let appName in _appInstances) {
      let exseedApp = _appInstances[appName];
      const srcPath = path.join(
        _env.dir.projectSrc, exseedApp.dir, 'flux/boot.js');
      if (fs.existsSync(srcPath)) {
        appArray.push(appName);
        config.entry[exseedApp.dir] = [
          srcPath,
        ];
      }
    }

    config.output.path = _env.dir.projectTarget;
    config.plugins.push(
      new webpack.optimize.CommonsChunkPlugin('public/js/common.js', appArray),
    );

    webpack(config, (err, stats) => {
      if (err) {
        gutil.log(err);
      } else {
        cb();
      }
    });
  });

  gulp.task('copy', function() {
    return gulp
      .src(files.statics)
      .pipe(gulpif(_env.watch, changed(_env.dir.projectTarget)))
      .pipe(gulp.dest(_env.dir.projectTarget));
  });

  gulp.task('exec', ['build', 'webpack', 'copy'], (cb) => {
    const exec = require('child_process').exec;
    _appProcess = exec(`node ${_env.dir.projectTarget}/server.js`, {
      env: {
        // inherit all parent environment variables
        // to run `node` binary with $PATH
        // ref: https://github.com/travis-ci/travis-ci/issues/3894
        ...process.env,
        NODE_ENV: _env.NODE_ENV,
        EXSEED_INIT: _env.init,
      },
    });

    // show outputs in realtime
    _appProcess.stdout.on('data', (data) => {
      console.log(data);
    });

    _appProcess.stderr.on('data', (data) => {
      console.log(data);
    });

    if (!_env.env.test) {
      _appProcess.on('close', (code) => {
        cb();
      });
    } else {
      cb();
    }
  });

  gulp.task('nodemon', ['build', 'webpack', 'copy'], (cb) => {
    let started = false;

    return nodemon({
      script: `${_env.dir.projectTarget}/server.js`,
      watch: [`${_env.dir.projectTarget}/**/*.js`],
      ext: 'js',
      env: {
        NODE_ENV: _env.NODE_ENV,
        EXSEED_WATCH: _env.watch,
        EXSEED_INIT: _env.init,
      },
      ignore: files.nodemonRestartIgnore,
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
          _appProcess.kill('SIGINT');
          process.exit(1);
        })
        .once('end', () => {
          _appProcess.kill('SIGINT');
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
    gulp.start('build', 'webpack', 'copy', 'exec');
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
    gulp.start('build', 'webpack', 'copy', 'nodemon', 'watch');
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
    gulp.start('build', 'webpack', 'copy', 'exec', 'test');
  });

// to customize command name in help information
// ref: https://github.com/tj/commander.js/issues/466
process.argv[1] = 'sd';
program.parse(process.argv);

if (!program.args.length) {
  program.help();
}