import path from 'path';
import fs from 'fs';
import http from 'http';
import express from 'express';
import Waterline from 'waterline';
import assign from 'object-assign';
import React from 'react';
import ReactDOMServer from 'react-dom/server';

// dependencies for livereloading react
import webpack from 'webpack';
import config from './webpack.config.dev';
import webpackDevMiddleware from 'webpack-dev-middleware';
import webpackHotMiddleware from 'webpack-hot-middleware';

// registered app instances
let _appMap = {};

// setting object
let _appSettings = {};

// waterline orm instance
const _waterline = new Waterline();

// the top level express app
const _rootExpressApp = express();

// exseed project directory
const _projectDir = process.cwd();

// waterline orm models
export let models = null;

export let middlewares = {
  // expose express's `static` method
  static: express.static,
};

/**
 * Environment related variables
 */
export const ENV = process.env.NODE_ENV || 'development';
export const env = {
  development: ENV === 'development',
  test: ENV === 'test',
  production: ENV === 'production',
};

const _dest = (
  env.development? 'debug':
  env.test?        'test':
                   'release');

/**
 * App class
 * @class
 */
export class App {
  /**
   * Generates a new express app,
   * and mount it onto the top level express app
   * @constructs App
   */
  constructor(app) {
    /**
     * The express app
     * @member App#expressApp
     */
    this.expressApp = app;
    _rootExpressApp.use('/', this.expressApp);
  }

  init(models) {
  }

  routing(app, models) {
  }

  onError(err, req, res) {
  }
}

export class Err {
  constructor(message='Unnamed error', status=500) {
    this.name = this.constructor.name;
    this.message = message;
    this.status = status;
    Error.captureStackTrace(this, this.constructor);
  }
}

export class PageNotFound extends Err {
  constructor(
    msg='The url you are requesting does not exist',
    status=404) {
    super(msg, status);
  }
}

/**
 * Register an exseed app
 * @param {string} appName - An identifier of exseed app
 * @param {App} AppClass
 *   - An exseed app class declaration extends from App
 */
export function registerApp(appName, AppClass) {
  let newExpressApp = express();
  newExpressApp.use('/' + appName, express.static(
    path.join(_projectDir, 'build', _dest, appName, 'public')));
  const appInstance = new AppClass(newExpressApp);
  _appMap[appName] = appInstance;
  return appInstance;
}

/**
 * Register a waterline model
 * @param {object} schema - A waterline schema definition
 */
export function registerModel(schema) {
  // add default value for the schema
  assign(schema, {
    connection: 'default',

    /*
     * migrate: 'alter'
     *   adds and/or removes columns on changes to the schema
     * migrate: 'drop'
     *   drops all your tables and then re-creates them. All data is deleted.
     * migrate: 'safe'
     *   doesn't do anything on sails lift- for use in production.
     */
    migrate: schema.migrate || (
      env.development? 'alter':
      env.test? 'drop':
      'safe'),
  });
  let collections = Waterline.Collection.extend(schema);
  _waterline.loadCollection(collections);
}

/**
 * @callback runCallback
 * @param {object} err - An error object
 * @param {object} models - All orm models
 * @param {object} port - The listening port
 */

/**
 * 1. Initialize waterline orm
 * 2. Iterate through `init` member function of all registered exseed apps
 *    and then exit when `EXSEED_INIT` is set
 * 3. Iterate through `routing` member function of all registered exseed apps
 *    and then launch the server when `EXSEED_INIT` is not set
 * @param {object} customSettings - The global settings
 * @param {runCallback} cb - The callback after serving
 */
export function run(customSettings, cb) {
  assign(_appSettings, customSettings);

  if (process.env.EXSEED_WATCH === 'true') {
    console.log('using livereload');
    // webpack compilation
    let appArray = [];
    for (let appName in _appMap) {
      const srcPath = path.join(process.env.PWD, `src/${appName}/flux/boot.js`);
      if (fs.existsSync(srcPath)) {
        appArray.push(appName);
        config.entry[appName] = [
          srcPath,
          'webpack-hot-middleware/client',
        ];
      }
    }
    config.output.path = path.join(process.env.PWD, `build/${_dest}/public/`);
    config.plugins.push(
      new webpack.optimize.CommonsChunkPlugin('js/common.js', appArray),
    );

    let compiler = webpack(config);
    _rootExpressApp.use(webpackDevMiddleware(compiler, {
      noInfo: true,
      publicPath: config.output.publicPath,
    }));
    _rootExpressApp.use(webpackHotMiddleware(compiler));
  }

  // initialize ORM
  _waterline.initialize(_appSettings.db[ENV], (err, ontology) => {
    if (err) {
      return cb(err);
    }

    // assign all models to exported variable
    models = ontology.collections;

    // initialize exseed app
    if (process.env.EXSEED_INIT === 'true') {
      for (let appName in _appMap) {
        let exseedApp = _appMap[appName];
        exseedApp.init(ontology.collections);
      }
      return;
    }

    // setup exseed app's routing rules
    for (let appName in _appMap) {
      let exseedApp = _appMap[appName];
      exseedApp.routing(exseedApp.expressApp, ontology.collections);
    }

    // render full page view
    for (let appName in _appMap) {
      let app = _appMap[appName].expressApp;
      const routesPath = path.join(
        process.env.PWD, 'build', _dest, appName, 'routes.js');
      if (fs.existsSync(routesPath)) {
        const App = require(routesPath).default;
        app.get('/*', (req, res, next) => {
          try {
            const Helmet = require(
              path.join(process.env.PWD, 'node_modules/react-helmet'));
            // the order of generating `html` and `head` cannot be exchanged
            // it's fucking weird...
            const html = ReactDOMServer.renderToString(
              <App path={req.path} />);
            const head = Helmet.rewind();

            res.send(
              '<!DOCTYPE html>' +
              '<head>' +
                `<title>${head.title.toString()}</title>` +
                head.meta.toString() +
                head.link.toString() +
              '</head>' +
              '<body>' +
                '<div id="exseed_root">' +
                  html +
                '</div>' +
              '</body>'
            );
          } catch (err) {
            if (err.message !== 'React-router-component: ' +
                                'No route matched! ' +
                                'Did you define a NotFound route?') {
              next(err);
            } else {
              // no routes matched in currently iterated app
              next();
            }
          }
        });
      }
    }

    // 404
    _rootExpressApp.use((req, res, next) => {
      next(new PageNotFound());
    });

    // error handling
    _rootExpressApp.use((err, req, res, next) => {
      if (err) {
        for (let appName in _appMap) {
          let exseedApp = _appMap[appName];
          exseedApp.onError(err, req, res);
        }
      }
    });

    // launch server
    const port = _appSettings.server.port[ENV];
    _rootExpressApp.httpServer = http
      .createServer(_rootExpressApp)
      .listen(port, cb.bind(this, null, ontology.collections, port));
  });
}

/**
 * To support both import ways:
 *   import exseed from 'exseed';
 *   import * as exseed from 'exseed';
 */
exports.default = module.exports;