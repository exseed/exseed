#! /usr/bin/env node

import {exec} from 'child_process';
import program from 'commander';
import pkg from '../package.json';

import gulp from 'gulp';
import gulpLogEvents from './gulpLogEvents';
import changed from 'gulp-changed';
import babel from 'gulp-babel';

/**
 * Specify gulp tasks
 */

// since we are calling gulp tasks from node scripts
// instead of `gulp` command, we use the logging
// function extracted from gulp's source code
// to keep logs working properly
gulpLogEvents(gulp);

var errorHandler = function(err) {
  console.log(err.toString());
  this.emit('end');
};

// watching source files
gulp.task('watch', function() {
  return gulp
    .watch('./src/**/*.js', ['build']);
});

// build source files
gulp.task('build', function() {
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

// run gulp tasks
gulp.task('default', function() {
  gulp.start('build', 'watch');
});

/**
 * Definition of commands
 */

program
  .version(pkg.version)
  .option(
    '-e, --env <env>',
    'specify environment (development|test|production)',
    'development');

program
  .command('serve')
  .alias('s')
  .description('launch exseed app')
  .action((options) => {
    const cmd = 'node ./build/debug/app.js';
    console.log(`execute ${cmd} under ${options.env} environment`);
    let nodeApp = exec(cmd, {
      env: {
        NODE_ENV: options.env,
      },
    });
    nodeApp.stdout.pipe(process.stdout);
    nodeApp.stderr.pipe(process.stdout);
  });

// to customize command name in help information
// ref: https://github.com/tj/commander.js/issues/466
process.argv[1] = 'sd';
program.parse(process.argv);

if (!program.args.length) {
  gulp.start('default');
}