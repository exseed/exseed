import React from 'react';
import {
  App,
  renderPath
} from 'exseed';

class CoreApp extends App {
  constructor(props) {
    super(props);
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
    }
  }

  onErrorEnd(err, req, res) {
    console.log('==== Uncaught Exception ====');
    console.log(err.stack);
    console.log('============================');
    res.status(err.status || 500);
    res.send('server error');
  }
};

export default CoreApp;