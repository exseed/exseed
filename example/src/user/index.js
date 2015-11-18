import {
  App,
  registerModel,
  env
} from 'exseed';

class UserApp extends App {
  constructor(app, name) {
    super(app, name);
    registerModel(require('./models/permission').default);
    registerModel(require('./models/role').default);
    registerModel(require('./models/user').default);
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
    app.post('/api/user/login', (req, res) => {
      models.user
        .authenticate(req.body)
        .then((user) => {
          res.send(user);
        })
        .catch((e) => {
          res.send(e.message);
        });
    });
    app.get('/api/user/:id', (req, res) => {
      // deep populate user to get
      // `user.role` and `user.role.permissions`
      models.user
        .findOne(req.params.id)
        .populate('role')
        .then((user) => {
          let role = models.role
            .findOne({
              name: user.role.name,
            })
            .populate('permissions')
            .then((role) => {
              return role;
            });

          return [ user, role ];
        })
        .spread((user, role) => {
          let userObj = user.toJSON();
          let roleObj = role.toJSON();
          userObj.permissions = roleObj.permissions;
          res.json(userObj);
        });
    });

    app.get('/api/role/:name', (req, res) => {
      models.role
        .findOne({
          name: req.params.name,
        })
        .populate('users')
        .populate('permissions')
        .then((role) => {
          res.json(role);
        });
    });

    app.get('/api/permission', (req, res) => {
      models.permission
        .find()
        .then((permissions) => {
          res.json(permissions);
        });
    });
  }

  onError(err, req, res) {
  }
};

export default UserApp;