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
  }

  onError(err, req, res) {
    switch (err.name) {
      case 'PageNotFound': {
        res.status(err.status);
        res.send('404');
        break;
      }
    }
  }
};

export default BasicApp;