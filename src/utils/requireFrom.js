import opts from '../options';
import { requireModule } from '../utils';

export default {
  cliRoot: (...filePath) => requireModule(opts.dir.cliRoot, ...filePath),
  root: (...filePath) => requireModule(opts.dir.root, ...filePath),
  src: (...filePath) => requireModule(opts.dir.src, ...filePath),
  target: (...filePath) => requireModule(opts.dir.target, ...filePath),
  module: (...filePath) =>
    requireModule(opts.dir.root, 'node_modules', ...filePath),
};