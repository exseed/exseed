import { App } from 'exseed';

class BasicApp extends App {
  /**
   * Setup environments like logging requests, create server, etc.
   * @param {object} app - the express app instance
   */
  constructor(app) {
    super(app);
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