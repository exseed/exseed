import path from 'path';

/**
 * @typedef {object} EnvInfo
 * @property {string} NODE_ENV - current NODE_ENV
 * @property {object} env
 * @property {boolean} env.development - whether current running mode is `development`
 * @property {boolean} env.test - whether current running mode is `test`
 * @property {boolean} env.production - whether current running mode is `production`
 * @property {string} dest - the target build folder relative to `<project root>/build/`
 * @property {boolean} watch - whether monitoring files changing
 * @property {boolean} init - whether current running mode is to initialize apps
 * @property {string} dir.projectRoot - the root directory of current project
 * @property {string} dir.projectSrc - the source code directory of current project
 * @property {string} dir.projectTarget - the build code directory of current project
 * @property {object} errors - whether there are errors raised when parsing the environment
 * @property {boolean} errors.ERR_NO_ENV - indicates that no running mode is specified
 * @property {boolean} errors.ERR_MULTIPLE_ENV - indicates that multiple running modes are specified, which is forbidden
 * @example
 * {
 *   NODE_ENV: 'development',
 *   env: {
 *     development: true,
 *     test: false,
 *     production: false
 *   },
 *   dest: 'debug',
 *   watch: true,
 *   init: false,
 *   dir: {
 *     projectRoot: '/Users/gocreating/projects/exseed/example',
 *     projectSrc: '/Users/gocreating/projects/exseed/example/src',
 *     projectTarget: '/Users/gocreating/projects/exseed/example/build/debug',
 *   },
 *   errors: {},
 * }
 */

/**
 * @ignore
 * Return environment related variables,
 * @return {EnvInfo}
 */
export function getEnv(cliOptions) {
  let NODE_ENV = 'development';
  let env = {};
  let dest = 'debug';
  let watch = false;
  let init = false;
  let dir = {};
  let errors = {};

  if (cliOptions !== undefined) {
    // use in cli
    env = {
      development: cliOptions.development,
      test:        cliOptions.test,
      production:  cliOptions.production,
    };

    if (!env.development &&
        !env.test &&
        !env.production) {
      // no option is specified
      errors['ERR_NO_ENV'] = true;
    } else if (!((env.development && !env.test && !env.production) ||
                 (!env.development && env.test && !env.production) ||
                 (!env.development && !env.test && env.production))) {
      // multiple options are used
      errors['ERR_MULTIPLE_ENV'] = true;
    }

    if (errors.ERR_NO_ENV ||
        errors.ERR_MULTIPLE_ENV) {
      env = {
        development: true,
        test: false,
        production: false,
      };
    }

    NODE_ENV = (env.development? 'development':
                env.test?        'test':
                                 'production');
    watch = cliOptions.watch || watch;
    init = cliOptions.init || init;

  } else {
    // use in lib
    NODE_ENV = process.env.NODE_ENV || NODE_ENV;
    env = {
      development: NODE_ENV === 'development',
      test:        NODE_ENV === 'test',
      production:  NODE_ENV === 'production',
    };
    watch = (process.env.EXSEED_WATCH === 'true');
    init = (process.env.EXSEED_INIT === 'true');
  }

  dest = (env.development? 'debug':
          env.test?        'test':
                           'release');

  dir = {
    projectRoot: process.cwd(),
    projectSrc: path.join(process.cwd(), 'src'),
    projectTarget: path.join(process.cwd(), 'build', dest),
  };

  return {
    NODE_ENV: NODE_ENV,
    env: env,
    dest: dest,
    watch: watch,
    init: init,
    dir: dir,
    errors: errors,
  };
}