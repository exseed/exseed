import path from 'path';
import fs from 'fs';
import opts from '../options';
import { requireFrom } from '../utils';

const defaultInit = ({ done }) => { done(); };
const dummyFunc = () => {};

function getBootSrcPath(appPath) {
  const bootSrcPath = path.join(opts.dir.src, appPath, 'flux/boot.js');
  return fs.existsSync(bootSrcPath)? bootSrcPath: undefined;
}

export default class App {
  constructor(appPath) {
    // public member
    this.name = path.parse(appPath).base;
    this.settings = requireFrom.target(this.name, 'settings');
    this.alias = this.settings.name;

    // private member
    this._pageRoutes = requireFrom.target(appPath, 'flux/routes');
    this._bootSrcPath = getBootSrcPath(appPath);
    this._modelSchemas = requireFrom.target(appPath, 'models'),
    this._func = {
      init: requireFrom.target(appPath, 'init') || defaultInit,
      middlewares: requireFrom.target(appPath, 'middlewares') || dummyFunc,
      routes: requireFrom.target(appPath, 'routes') || dummyFunc,
      views: requireFrom.target(appPath, 'views') || dummyFunc,
      errors: requireFrom.target(appPath, 'errors') || dummyFunc,
    };
  }
}