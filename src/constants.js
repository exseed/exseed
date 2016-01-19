export const FORMAT_OPTION_FILE_NAME = '.exseed.opts.json';

export const DEFAULT_OPTION = {
  env: {
    NODE_ENV:    'development',
    development: true,
    test:        false,
    production:  false,
  },
  watch: false,
  dir: {
    cliRoot: '',
    root: '',
    src: '',
    target: '',
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