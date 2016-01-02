import {
  App,
  load
} from 'exseed';
import path from 'path';
import favicon from 'serve-favicon';
import morgan from 'morgan';
import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';

class BasicApp extends App {
  /**
   * Setup environments like logging requests, create server, etc.
   * @param {object} app - the express app instance
   */
  constructor(props) {
    super(props);
    const { app, name, dir } = props;

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

    // parse application/x-www-form-urlencoded
    app.use(bodyParser.urlencoded({ extended: false }));

    // parse application/json
    app.use(bodyParser.json());

    // cookie parser
    app.use(cookieParser());
  }

  /**
   * Setup routing rules
   * @param {object} app - the express app instance
   * @param {object} router - the express router
   * @param {object} models - all models of the project
   */
  routing(app, router, models) {
    app.post('/bodyparser', (req, res) => {
      res.json(req.body);
    });

    app.get('/cookie_example/set', (req, res) => {
      res.cookie('cookie_example', 'this is some cookie');
      res.send(
        '`cookie_example` was set, and here is your cookie:<br>' +
        JSON.stringify(req.cookies));
    });

    app.get('/cookie_example/unset', (req, res) => {
      res.clearCookie('cookie_example');
      res.send(
        '`cookie_example` was unset, and here is your cookie:<br>' +
        JSON.stringify(req.cookies));
    });

    app.get('/error', (req, res) => {
      throw new Error('make error in purpose');
    });

    app.get('/module/user', (req, res) => {
      let userModules = load('user');
      res.json(userModules);
    });
  }
};

export default BasicApp;