import {
  App,
  registerModel,
  env
} from 'exseed';

import * as views from './views';
import tokenParser from './middlewares/tokenParser';

class UserApp extends App {
  constructor(props) {
    super(props);
    const { app } = props;

    registerModel(require('./models/permission').default);
    registerModel(require('./models/role').default);
    registerModel(require('./models/user').default);

    app.use(tokenParser());
  }

  init(models) {
    models.permission
      .create([
        { id: 1, name: 'CREATE_USER' },
        { id: 2, name: 'DELETE_USER' },
        { id: 3, name: 'LOGIN' },
        { id: 4, name: 'POST_ARTICLE' },
      ])
      .then((permissions) => {
        console.log(permissions);
      })
      .catch((err) => {
        console.error(err);
      });

    models.role
      .findOrCreate({
        name: 'root',
        permissions: [1, 2, 3, 4],
      })
      .then((role) => {
        return models.user
          .create({
            email: 'root@exseed.org',
            name: 'root',
            username: 'root',
            password: 'root',
            role: role.id,
          });
      })
      .then((user) => {
        return models.role
          .findOrCreate({
            name: 'admin',
            permissions: [1, 3, 4],
          });
      })
      .then((role) => {
        return models.user
          .create({
            email: 'admin@exseed.org',
            name: 'admin',
            username: 'admin',
            password: 'admin',
            role: role.id,
          });
      })
      .then((user) => {
        return models.role
          .findOrCreate({
            name: 'user',
            permissions: [3, 4],
          });
      })
      .then((role) => {
        return models.user
          .create({
            email: 'user@exseed.org',
            name: 'user',
            username: 'user',
            password: 'user',
            role: role.id,
          });
      })
      .then((user) => {
        return models.user
          .find()
          .populate('role');
      })
      .then((users) => {
        console.log(users);
      })
      .catch((err) => {
        console.error(err);
      });
  }

  getModules() {
    return {
      example: 'this is an export example, ' +
               'you can export something from here',
    };
  }

  routing(app, models) {
    app.post('/api/user/login', views.login);
    app.get('/api/user/logout', views.logout);
    app.get('/api/user', views.listUser);
    app.post('/api/user', views.createUser);
    app.get('/api/user/:id', views.getUser);
    app.get('/api/role/:name', views.getRole);
    app.get('/api/permission', views.listPermissions);
  }

  onError(err, req, res) {
    switch (err.name) {
      case 'TokenExpiration': {
        // clear the broken token
        res.clearCookie('access_token');
        res
          .status(err.status)
          .json(err.toApiResponse());
        break;
      }
      case 'TokenInvalid': {
        // clear the broken token
        res.clearCookie('access_token');
        res
          .status(err.status)
          .json(err.toApiResponse());
        break;
      }
    }
  }
};

export default UserApp;