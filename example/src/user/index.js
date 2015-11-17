import {
  App,
  registerModel,
  env
} from 'exseed';

class UserApp extends App {
  constructor(app) {
    super(app);
    registerModel(require('./models/role').default);
    registerModel(require('./models/user').default);
  }

  init(models) {
    models.role
      .findOrCreate({
        name: 'root',
      })
      .then((role) => {
        return models.user
          .create({
            email: 'root@exseed.org',
            name: 'root',
            password: 'root',
            role: role.id,
          });
      })
      .then((user) => {
        return models.role
          .findOrCreate({
            name: 'admin',
          });
      })
      .then((role) => {
        return models.user
          .create({
            email: 'admin@exseed.org',
            name: 'admin',
            password: 'admin',
            role: role.id,
          });
      })
      .then((user) => {
        return models.role
          .findOrCreate({
            name: 'user',
          });
      })
      .then((role) => {
        return models.user
          .create({
            email: 'user@exseed.org',
            name: 'user',
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

  routing(app, router, models) {
    app.get('/app2_1', (req, res) => {
      res.send('app2_1');
    });

    this.expressApp.get('/app2_2', (req, res) => {
      res.send('app2_2');
    });
  }

  onError(err, req, res) {
  }
};

export default UserApp;