import { models } from 'exseed';

export function login(req, res) {
  models.user
    .authenticate(req.body)
    .then((user) => {
      // pass
      const bearerToken = user.getBearerToken();
      res.cookie('access_token', bearerToken);
      res.json({
        data: {
          bearerToken: bearerToken,
          user: user,
        },
        errors: [],
      });
    })
    .catch((e) => {
      // reject
      res.json({
        errors: [
          {
            title: 'cannot login',
            detail: 'either the username or the password is wrong',
          },
        ],
      });
    });
};

export function logout(req, res) {
  res.clearCookie('access_token');
  res.json({
    errors: [],
  });
};

export function listUser(req, res) {
  models.user
    .find()
    .then((users) => {
      res.json({
        users: users,
        errors: [],
      });
    });
};

export function createUser(req, res) {
  models.user
    .create(req.body)
    .then((newUser) => {
      res.json({
        user: newUser,
        errors: [],
      });
    })
    .catch((err) => {
      if (err.code === 'E_VALIDATION') {
        res
          .status(err.status)
          .json({
            errors: [{
              title: 'fail to register',
              detail: 'the username is already used',
            },],
          });
      } else {
        throw new Error('Unknown error');
      }
    });
};

export function getUser(req, res) {
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
};

export function getRole(req, res) {
  models.role
    .findOne({
      name: req.params.name,
    })
    .populate('users')
    .populate('permissions')
    .then((role) => {
      res.json(role);
    });
};

export function listPermissions(req, res) {
  models.permission
    .find()
    .then((permissions) => {
      res.json(permissions);
    });
};
