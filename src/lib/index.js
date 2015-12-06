import path from 'path';
import fs from 'fs';
import http from 'http';
import express from 'express';
import Waterline from 'waterline';
import assign from 'object-assign';
import React from 'react';
import ReactDOMServer from 'react-dom/server';
import { getEnv } from '../share/env';

/**
 * Private global variables
 */

// environment related variables
const _env = getEnv();

// registered app instances
let _appInstances = {};

// setting object
let _appSettings = {};

// waterline orm instance
const _waterline = new Waterline();

// the top level express app
const _rootExpressApp = express();

/**
 * Private global functions
 */

/**
 * @callback iterateCallback
 * @param {string} appName - Current app name
 * @param {object} exseedApp - Current app instance
 */

/**
 * iterate through exseed apps
 * @param {iterateCallback} cb - The callback when iterating
 */
let iterateApps = (cb) => {
  for (let appName in _appInstances) {
    let exseedApp = _appInstances[appName];
    cb(appName, exseedApp);
  }
};

/**
 * Exported variables and functions
 */

export const env = _env;

// waterline orm models
export let models = null;

export let middlewares = {
  // expose express's `static` method
  static: express.static,
};

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
  constructor(app, name, dir) {
    /**
     * The express app
     * @member App#expressApp
     */
    this.expressApp = app;
    this.name = name;
    this.dir = dir;
    _rootExpressApp.use('/', this.expressApp);
  }

  init(models) {
  }

  routing(app, models) {
  }

  onError(err, req, res) {
  }

  getModules() {
    return {};
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

export function load(appName) {
  return _appInstances[appName].getModules();
}

/**
 * Register an exseed app
 * @param {string} appName - An identifier of exseed app
 * @param {App} AppClass
 *   - An exseed app class declaration extends from App
 */
export function registerApp(appName, appDir) {
  let AppClass = require(
    path.join(_env.dir.projectTarget, appDir, 'index.js')).default;
  let newExpressApp = express();
  const appInstance = new AppClass(newExpressApp, appName, appDir);
  _appInstances[appName] = appInstance;
  return appInstance;
}

export function getAppInstances(appName, appDir) {
  return _appInstances;
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
      _env.env.development? 'alter':
      _env.env.test? 'safe':
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

  if (_env.watch) {
    console.log('using livereload');

    // dependencies for livereloading react
    const webpack = require('webpack');
    const config = require('../webpack/webpack.config.livereload');
    const webpackDevMiddleware = require('webpack-dev-middleware');
    const webpackHotMiddleware = require('webpack-hot-middleware');

    // webpack compilation
    let appArray = [];
    iterateApps((appName, exseedApp) => {
      const srcPath = path.join(
        _env.dir.projectSrc, exseedApp.dir, 'flux/boot.js');
      if (fs.existsSync(srcPath)) {
        appArray.push(appName);
        config.entry[appName] = [
          srcPath,
          'webpack-hot-middleware/client',
        ];
      }
    });
    config.output.path = _env.dir.projectTarget;
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
  _waterline.initialize(_appSettings.db[_env.NODE_ENV], (err, ontology) => {
    if (err) {
      return cb(err);
    }

    // assign all models to exported variable
    models = ontology.collections;

    // initialize exseed app
    if (_env.init) {
      iterateApps((appName, exseedApp) => {
        exseedApp.init(ontology.collections);
      });
      return;
    }

    // serve global static files
    _rootExpressApp.use(express.static(
      path.join(_env.dir.projectTarget, 'public')));

    // serve app's static files
    iterateApps((appName, exseedApp) => {
      _rootExpressApp.use('/' + appName, express.static(
        path.join(_env.dir.projectTarget, exseedApp.dir, 'public')));
    });

    // setup exseed app's routing rules
    iterateApps((appName, exseedApp) => {
      exseedApp.routing(exseedApp.expressApp, ontology.collections);
    });

    // render full page view
    // for (let appName in _appInstances) {
    //   let exseedApp = _appInstances[appName];
    iterateApps((appName, exseedApp) => {
      let app = exseedApp.expressApp;
      const routesPath = path.join(
        _env.dir.projectTarget, exseedApp.dir, 'routes.js');
      if (fs.existsSync(routesPath)) {
        const App = require(routesPath).default;
        app.get('/*', (req, res, next) => {
          try {
            const Helmet = require(
              path.join(_env.dir.projectRoot, 'node_modules/react-helmet'));
            // the order of generating `html` and `head` cannot be exchanged
            // it's fucking weird...
            const html = ReactDOMServer.renderToString(
              <App path={req.path} />);
            const head = Helmet.rewind();

            res.send(
              '<!DOCTYPE html>' +
              '<head>' +
                head.title.toString() +
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
    });

    // 404
    _rootExpressApp.use((req, res, next) => {
      next(new PageNotFound());
    });

    // error handling
    _rootExpressApp.use((err, req, res, next) => {
      if (err) {
        iterateApps((appName, exseedApp) => {
          exseedApp.onError(err, req, res);
        });
      }
    });

    // launch server
    const port = process.env.PORT || _appSettings.server.port[_env.NODE_ENV];
    _rootExpressApp.httpServer = http
      .createServer(_rootExpressApp)
      .listen(port, () => {
        cb(null, ontology.collections, port);
      })
      .on('error', (err) => {
        cb(err, ontology.collections, port);
      });
  });
}

/**
 * To support both import ways:
 *   import exseed from 'exseed';
 *   import * as exseed from 'exseed';
 */
exports.default = module.exports;