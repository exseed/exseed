import { models } from 'exseed';

export function login(req, res) {
  models.user
    .authenticate(req.body)
    .then((user) => {
      res.send(user);
    })
    .catch((e) => {
      res.send(e.message);
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
