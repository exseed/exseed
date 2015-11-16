import { App } from 'exseed';
import path from 'path';
import favicon from 'serve-favicon';
import morgan from 'morgan';

class BasicApp extends App {
  /**
   * Setup environments like logging requests, create server, etc.
   * @param {object} app - the express app instance
   */
  constructor(app) {
    super(app);
    app.use(favicon(path.join(__dirname, 'public/favicon.ico')));
    morgan.token('colorStatus', (req, res) => {
      const status = res.statusCode;
      let color = '';

      if (status < 200) {
        // 1xx
        color = '\x1b[0m';
      } else if (status < 300) {
        // 2xx
        color = '\x1b[0;32m';
      } else if (status < 400) {
        // 3xx
        color = '\x1b[1;33m';
      } else if (status < 500) {
        // 4xx
        color = '\x1b[0;31m';
      } else {
        // 5xx
        color = '\x1b[0;35m';
      }

      return color + status + '\x1b[0m';
    });

    app.use(morgan(
      '\x1b[1;30m' + '[:date[iso]] ' +
      '\x1b[0m'    + ':remote-addr\t' +
                     ':colorStatus ' +
                     ':method ' +
                     ':url\t' +
      '\x1b[0m'    + ':res[content-length] - ' +
      '\x1b[0;36m' + ':response-time ms' +
      '\x1b[0m'
    ));
  }

  /**
   * Setup routing rules
   * @param {object} app - the express app instance
   * @param {object} router - the express router
   * @param {object} models - all models of the project
   */
  routing(app, router, models) {
    app.get('/error', (req, res) => {
      throw new Error('make error in purpose');
    });
  }

  onError(err, req, res) {
    switch (err.name) {
      case 'PageNotFound': {
        res.status(err.status);
        res.send('404');
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

export default BasicApp;