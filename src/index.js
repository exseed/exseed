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
import opts from './options';
import { App } from './classes';

// ===============================
// Private constants and variables
// ===============================

const _settings = requireFrom.target('settings');
const _appInstMap = {};

_settings.installedApps
  .forEach((appPath) => {
    const appInst = new App(appPath);
    _appInstMap[appInst.name] = appInst;
    _appInstMap[appInst.alias] = appInst;
  });

// =================
// Private functions
// =================



// ==============================
// Exported constants, variables,
// functions and classes
// ==============================

export const env = opts.env;