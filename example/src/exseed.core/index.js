import React from 'react';
import {
  App,
  renderPath
} from 'exseed';

import NotFoundPage from './flux/views/pages/NotFoundPage';

class CoreApp extends App {
  constructor(app, name, dir) {
    super(app, name, dir);
  }

  onError(err, req, res) {
    switch (err.name) {
      case 'PageNotFound': {
        renderPath('core', '/404', (error, html) => {
          res
            .status(err.status)
            .send(html);
        });
        break;
      }
      default: {
        console.log('==== Uncaught Exception ====');
        console.log(err.stack);
        console.log('============================');
        res.status(err.status || 500);
        res.send('server error');
        break;
      }
    }
  }
};

export default CoreApp;