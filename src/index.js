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

// local modules
import { requireFrom } from './utils';
import { App } from './classes';
import opts from './options';

// ===============================
// Private constants and variables
// ===============================

const _waterline = new Waterline();
const _expressApp = express();
const _settings = requireFrom.target('settings');
let _appInstMap = {};
let _appInstArr = [];

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

function _forEachApp(func) {
  _appInstArr.forEach(func);
}

function _setupWaterline() {
  // TO-DO
}

function _initApp() {
  // TO-DO
}

function _injectLivereload() {
  // TO-DO
}

function _serveStatics() {
  // global static files
  _expressApp.use(express.static(
      path.join(opts.dir.target, 'public')));
  // app's static files
  _forEachApp((appInst) => {
    _expressApp.use('/' + appInst.alias, express.static(
      path.join(opts.dir.target, appInst.name, 'public')));
  });
}

function _injectReactSSR() {
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

(function _main() {
  _appInstMap = _getAppInstMap();
  _setupWaterline();
  if (opts.watch) {
    _initApp();
  }
  if (opts.watch) {
    _injectLivereload();
  }
  _serveStatics();

  _forEachApp((appInst) => {
    appInst._func.middlewares({ app: _expressApp });
  });
  _forEachApp((appInst) => {
    appInst._func.routes({ app: _expressApp });
  });
  _injectReactSSR();
})();

// ===========
// Public APIs
// ===========

export const env = opts.env;

export const app = _expressApp;

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