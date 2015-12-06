#! /usr/bin/env node

/**
 * Packages and modules
 */

// native packages
import path from 'path';
import fs from 'fs';

// vendor packages
import program from 'commander';
import gulp from 'gulp';

// local modules
import pkg from '../../package.json';
import { registerTasks } from './registerTasks';

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