import path from 'path';
import { requireFrom } from '../utils';

const dummyFunc = () => {};

export default class App {
  constructor(appPath) {
    // public member
    this.name = path.parse(appPath).base;
    this.settings = requireFrom.target(this.name, 'settings');
    this.alias = this.settings.name;

    // private member
    this._func = {
      init: requireFrom.target(appPath, 'init') || dummyFunc,
      models: requireFrom.target(appPath, 'models') || dummyFunc,
      middlewares: requireFrom.target(appPath, 'middlewares') || dummyFunc,
      routes: requireFrom.target(appPath, 'routes') || dummyFunc,
      views: requireFrom.target(appPath, 'views') || dummyFunc,
      errors: requireFrom.target(appPath, 'errors') || dummyFunc,
    };
  }
}