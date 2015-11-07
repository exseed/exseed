#! /usr/bin/env node

import {exec} from 'child_process';
import program from 'commander';
import pkg from '../package.json';

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
  program.help();
}