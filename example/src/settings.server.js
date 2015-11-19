import path from 'path';
import sailsMemory from 'sails-memory';
import sailsDisk from 'sails-disk';

export default {
  server: {
    port: {
      development: 3000,
      test: 4000,
      production: 5000,
    },
  },
  db: {
    development: {
      adapters: {
        disk: sailsDisk,
      },
      connections: {
        default: {
          adapter: 'disk',
          filePath: path.join(__dirname, '../../.db/development.'),
        },
      },
    },
    test: {
      adapters: {
        disk: sailsDisk,
      },
      connections: {
        default: {
          adapter: 'disk',
          filePath: path.join(__dirname, '../../.db/test.'),
        },
      },
    },
    production: {
      adapters: {
        disk: sailsDisk,
      },
      connections: {
        default: {
          adapter: 'disk',
          filePath: path.join(__dirname, '../../.db/production.'),
        },
      },
    },
  },
};