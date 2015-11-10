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
    app.get('/', (req, res) => {
      res.send('home');
    });

    app.get('/about', (req, res) => {
      res.send('about');
    });

    app.get('/react', (req, res) => {
      res.send(`
        <!doctype html>
        <html>
          <head>
            <title>React Transform Boilerplate</title>
          </head>
          <body>
            <div id='root'>
            </div>
            <script src="/static/bundle.js"></script>
          </body>
        </html>
      `);
    });
  }

  onError(err, req, res) {
    switch (err.name) {
      case 'PageNotFound': {
        res.send('404');
        break;
      }
    }
  }
};

export default BasicApp;