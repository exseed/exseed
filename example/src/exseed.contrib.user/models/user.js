import { models } from 'exseed';
import jwt from 'jwt-simple';
import moment from 'moment';
import settings from '../settings';

export default {
  identity: 'user',
  attributes: {
    email: {
      type: 'string',
    },

    username: {
      type: 'string',
      required: true,
      unique: true,
    },

    name: {
      type: 'string',
      required: true,
    },

    password: {
      type: 'string',
      required: true,
    },

    role: {
      model: 'role',
    },

    toJSON() {
      let obj = this.toObject();
      delete obj.password;
      return obj;
    },

    getBearerToken() {
      const token = jwt.encode({
        user: {
          id: this.id,
          name: this.name,
          username: this.username,
        },
        expiration: moment()
          .add(
            settings.bearerToken.expiration.split(' ')[0],
            settings.bearerToken.expiration.split(' ')[1]
          )
          .valueOf(),
      }, settings.bearerToken.secret);

      return token;
    },
  },

  authenticate(user) {
    return models.user
      .findOne({
        username: user.username,
        password: user.password,
      })
      .then((user) => {
        if (user === undefined) {
          throw new Error('Authenticate fails');
        } else {
          return user;
        }
      });
  },

  beforeCreate(values, next) {
    // if no role is specified, set `user` as default role
    if (!values.role) {
      models.role
        .findOne({
          name: 'user',
        })
        .then((role) => {
          values.role = role.id;
          next();
        });
    } else {
      next();
    }
  },
};