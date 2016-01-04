import { Err } from 'exseed';

export class TokenExpiration extends Err {
  constructor(props) {
    super(props, {
      title: 'Token expired',
      message: 'The bearer token has expired',
      status: 401,
    });
  }
};

export class TokenInvalid extends Err {
  constructor(props) {
    super(props, {
      title: 'Invalid token',
      message: 'This token is malformed',
      status: 400,
    });
  }
};