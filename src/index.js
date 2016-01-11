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

(function _main() {
  _appInstMap = _getAppInstMap();
  _forEachApp((appInst) => {
    appInst._func.middlewares({ app: _expressApp });
  });
  _forEachApp((appInst) => {
    appInst._func.routes({ app: _expressApp });
  });
})();

// ===========
// Public APIs
// ===========

export const env = opts.env;

export const app = _expressApp;