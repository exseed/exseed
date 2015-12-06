/**
 * Packages and modules
 */

// native packages
import path from 'path';
import fs from 'fs';

// vendor packages
import gutil from 'gulp-util';

/**
 * Check whether there are errors
 * when deriving `env` varibles
 */
export function validateEnv(env) {
  if (env.errors) {
    if (env.errors.ERR_NO_ENV) {
      gutil.log('using `development` environment');
    } else if (env.errors.ERR_MULTIPLE_ENV) {
      gutil.log(gutil.colors.red(
        '-d, -t and -p switches cannot be used in parallel'));
      process.exit(1);
    }
  }
};

/**
 * Check whether CLI runs under the right path
 */
export function validatePath(env) {
  const appFilePath = path.join(
    env.dir.projectSrc, 'app.js');
  const serverFilePath = path.join(
    env.dir.projectSrc, 'server.js');
  if (!fs.existsSync(appFilePath) ||
      !fs.existsSync(serverFilePath)) {
    gutil.log(gutil.colors.red(
      'This is not an exseed app directory'));
    process.exit(1);
  }
};