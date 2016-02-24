import path from 'path';

export const FORMAT_OPTION_FILE_NAME = '.exseed.opts.json';

export const DEFAULT_OPTION = {
  env: {
    NODE_ENV:    'production',
    development: false,
    test:        false,
    production:  true,
  },
  watch: false,
  dir: {
    cliRoot: '',
    root: process.cwd(),
    src: path.join(process.cwd(), 'build'),
    target: path.join(process.cwd(), 'build'),
  },
};

export const DEFAULT_SETTINGS = {
  installedApps: [],
  db: {
    development: {
      adapters: {
        memory: require('sails-memory'),
      },
      connections: {
        default: {
          adapter: 'memory',
        },
      },
    },
  },
};