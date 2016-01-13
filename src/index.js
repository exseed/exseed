// ====================
// Packages and modules
// ====================

// native packages
import path from 'path';
import fs from 'fs';
import http from 'http';

// vendor packages
import express from 'express';
import Waterline from 'waterline';
import React from 'react';
import ReactDOMServer from 'react-dom/server';
import async from 'async';

// local modules
import { requireFrom } from './utils';
import { App, PageNotFound } from './classes';
import opts from './options';
import pOpts from './processOptions';

// ===============================
// Private constants and variables
// ===============================

const _waterline = new Waterline();
const _expressApp = express();
const _settings = requireFrom.target('settings');
let _appInstMap = {};
let _appInstArr = [];
let _models = {};

// =================
// Private functions
// =================

const { match, RouterContext } = require(path.join(
  opts.dir.root, 'node_modules/react-router'));

function _getAppInstMap() {
  let appInstMap = {};
  _settings.installedApps
    .forEach((appPath) => {
      const appInst = new App(appPath);
      appInstMap[appInst.name] = appInst;
      appInstMap[appInst.alias] = appInst;
      _appInstArr.push(appInst);
    });
  return appInstMap;
}

function _forEachApp(func, done) {
  _appInstArr.forEach((element, index, arr) => {
    func(element, index, arr);
    if (index === arr.length - 1 && done !== undefined) {
      done();
    }
  });
}

function _addModel(schema) {
  // add default value for the schema
  Object.assign(schema, {
    connection: 'default',

    /*
     * migrate: 'alter'
     *   adds and/or removes columns on changes to the schema
     * migrate: 'drop'
     *   drops all your tables and then re-creates them. All data is deleted.
     * migrate: 'safe'
     *   doesn't do anything on sails lift- for use in production.
     */
    // Sets the schema to automatically `alter` the schema, `drop` the schema or make no changes (`safe`). Default: `alter`
    // ref: https://github.com/balderdashy/waterline-docs/blob/master/models/configuration.md#migrate
    migrate: schema.migrate || (
      opts.env.development? 'alter':
      opts.env.test? 'safe':
      'safe'),
  });
  let collections = Waterline.Collection.extend(schema);
  _waterline.loadCollection(collections);
}

function _setupWaterline(cb) {
  _forEachApp((appInst) => {
    const schemas = appInst._modelSchemas;
    if (schemas) {
      for (let key in schemas) {
        _addModel(schemas[key]);
      }
    }
  });

  _waterline.initialize(_settings.db[opts.env.NODE_ENV], (err, ontology) => {
    if (err) {
      return cb(err);
    }
    _models = ontology.collections;
    cb(null);
  });
}

function _initApp() {
  let appInstArr = [];
  if (pOpts.name) {
    // init specified app
    const appInst = _appInstMap[pOpts.name];
    if (appInst) {
      appInstArr.push(appInst);
    } else {
      console.error(`"${pOpts.name}" is not an installed app`);
    }
  } else {
    // init all apps
    appInstArr = _appInstArr;
  }

  async.eachSeries(appInstArr, (appInst, callback) => {
    console.log(`Initialize ${appInst.name}\n---\n`);
    appInst._func.init({ done: callback });
  }, () => {
    process.exit();
  });
}

function _injectLivereload() {
  console.log('using livereload');

  // dependencies for livereloading react
  const webpack = require('webpack');
  const config = requireFrom.cliRoot('dist/configs/webpack.livereload');
  const webpackDevMiddleware = require('webpack-dev-middleware');
  const webpackHotMiddleware = require('webpack-hot-middleware');

  // webpack compilation
  let appAliasArray = [];
  _forEachApp((appInst) => {
    if (appInst._bootSrcPath) {
      config.entry[appInst.alias] = [
        appInst._bootSrcPath,
        'webpack-hot-middleware/client',
      ];
      return appInst.alias;
    }
    return false;
  });
  config.output.path = opts.dir.target;
  config.plugins.push(
    new webpack.optimize.CommonsChunkPlugin('js/common.js', appAliasArray)
  );

  let compiler = webpack(config);
  _expressApp.use(webpackDevMiddleware(compiler, {
    noInfo: true,
    publicPath: config.output.publicPath,
  }));
  _expressApp.use(webpackHotMiddleware(compiler));
}

function _handleStatics() {
  // global static files
  _expressApp.use(express.static(
    path.join(opts.dir.target, 'public')));
  // app's static files
  _forEachApp((appInst) => {
    _expressApp.use('/' + appInst.alias, express.static(
      path.join(opts.dir.target, appInst.name, 'public')));
  });
}

function _handleMiddlewares() {
  _forEachApp((appInst) => {
    appInst._func.middlewares({ app: _expressApp });
  });
}

function _handleRoutes() {
  _forEachApp((appInst) => {
    appInst._func.routes({ app: _expressApp });
  });
}

function _handlePageRender() {
  _forEachApp((appInst) => {
    const routes = appInst._pageRoutes;
    if (routes) {
      _expressApp.get('/*', (req, res, next) => {
        match({
          routes,
          location: req.url,
        }, (err, redirectLocation, renderProps) => {
          if (err) {
            res.status(500).send(err.message);
          } else if (redirectLocation) {
            res.redirect(
              302, redirectLocation.pathname + redirectLocation.search);
          } else if (renderProps) {
            // ref: https://github.com/rackt/react-router/issues/1414
            const notFound = renderProps.components
              .filter(component => component && component.isNotFound)
              .length > 0;
            if (notFound) {
              next();
            } else {
              const component = <RouterContext {...renderProps} />;
              res.status(200).send(renderComponent(component));
            }
          } else {
            next();
          }
        });
      });
    }
  });
}

function _handleRouteNotFound() {
  _expressApp.use((req, res, next) => {
    next(new PageNotFound());
  });
}

function _handleErrors() {
  _expressApp.use((err, req, res, next) => {
    if (err) {
      _forEachApp((appInst) => {
        appInst._func.errors({ err, req, res });
      });

      if (!res.headersSent) {
        _forEachApp((appInst) => {
          appInst._func.onAfterError({ err, req, res });
        });
      }
    }
  });
}

(function _main() {
  _appInstMap = _getAppInstMap();
  _setupWaterline(() => {
    // init
    if (pOpts.init) {
      _initApp();
    } else {
      // livereload
      if (opts.watch) {
        _injectLivereload();
      }
      // statics
      _handleStatics();
      // middlewares
      _handleMiddlewares();
      // routes
      _handleRoutes();
      // react full page render
      _handlePageRender();
      // 404
      _handleRouteNotFound();
      // error handling
      _handleErrors();
    }
  });
})();

// ===========
// Public APIs
// ===========

export const env = opts.env;

export { _expressApp as app };

export function renderComponent(component) {
  // const Helmet = require(
  //   path.join(_env.dir.projectRoot, 'node_modules/react-helmet'));
  const Helmet = requireFrom.module('react-helmet');
  // the order of generating `html` and `head` cannot be exchanged
  // it's fucking weird...
  const html = ReactDOMServer.renderToString(component);
  const head = Helmet.rewind();
  const title = head? head.title.toString(): '';
  const meta = head? head.meta.toString(): '';
  const link = head? head.link.toString(): '';
  return (
    '<!DOCTYPE html>' +
    '<head>' +
      title +
      meta +
      link +
    '</head>' +
    '<body>' +
      '<div id="exseed_root">' +
        html +
      '</div>' +
    '</body>'
  );
};

export function renderPath(appName, url, cb) {
  const appInst = _appInstMap[appName];
  // const routesPath = path.join(
  //   opts.dir.target, appInst.name, 'routes.js');
  // const routes = require(routesPath).default;
  const routes = requireFrom.target(appInst.name, 'flux/routes.js');
  match({
    routes,
    location: url,
  }, (err, redirectLocation, renderProps) => {
    if (renderProps) {
      const component = <RouterContext {...renderProps} />;
      const html = renderComponent(component);
      cb(err, html);
    } else {
      cb(err, null);
    }
  });
}

import _Err from './classes/Err';
export { _Err as Err };

export { _models as models };