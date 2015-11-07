#! /usr/bin/env node

import {exec} from 'child_process';
import program from 'commander';
import pkg from '../package.json';

program
  .version(pkg.version);

program
  .command('serve')
  .alias('s')
  .description('launch exseed app')
  .option(
    '-e, --env <env>',
    'specify environment (development|test|production)',
    'development')
  .option(
    '-w, --watch <watch>',
    'watching the changes of files',
    false)
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

program.parse(process.argv);

if (!program.args.length) {
  program.help();
}