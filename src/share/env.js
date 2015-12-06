import path from 'path';

/**
 * Return environment related variables,
 * for example:
 *
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

    if (errors) {
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