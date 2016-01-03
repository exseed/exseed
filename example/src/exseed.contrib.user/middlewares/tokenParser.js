import jwt from 'jwt-simple';
import moment from 'moment';
import * as errors from '../errors/';
import settings from '../settings';

/**
 * Mount `req.token` and `req.user`
 */
export default (opts) => {
  if (!opts) {
    opts = {};
  }
  const cookieKey = opts.cookieKey || 'access_token';
  const queryKey  = opts.queryKey  || 'access_token';
  const bodyKey   = opts.bodyKey   || 'access_token';
  const headerKey = opts.headerKey || 'Bearer';

  return (req, res, next) => {
    let bearerToken;

    // extract token from cookie
    if (req.cookies && req.cookies[cookieKey]) {
      bearerToken = req.cookies[cookieKey];

    // extract token from header
    } else if (req.headers && req.headers.authorization) {
      const parts = req.headers.authorization.split(' ');
      if (parts.length === 2 && parts[0] === headerKey) {
        bearerToken = parts[1];
      } else {
        throw new errors.TokenInvalid();
      }

    // extract token from query parameter
    } else if (req.query && req.query[queryKey]) {
      bearerToken = req.query[queryKey];

    // extract token from form value
    } else if (req.body && req.body[bodyKey]) {
      bearerToken = req.body[bodyKey];
    }

    // token exist, parse it
    if (bearerToken) {
      let decoded = {};

      // well-formed token
      try {
        decoded = jwt.decode(
          bearerToken,
          settings.bearerToken.secret
        );
      // malformed token
      } catch (err) {
        throw new errors.TokenInvalid();
      }

      // token expired
      if (decoded.expiration <= Date.now()) {
        throw new errors.TokenExpiration();

      // token does not expire
      } else {
        req.token = bearerToken;
        req.user = decoded.user;
        next();
      }

    // token does not exist, pass through it
    } else {
      next();
    }
  };
};