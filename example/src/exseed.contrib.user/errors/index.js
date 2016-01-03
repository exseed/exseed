import { Err } from 'exseed';

export class TokenExpiration extends Err {
  constructor(
    msg='The bearer token has expired',
    status=401) {
    super(msg, status);
  }
};

export class TokenInvalid extends Err {
  constructor(
    msg='This token is malformed',
    status=400) {
    super(msg, status);
  }
};