import { Err } from './';

export default class PageNotFound extends Err {
  constructor(props) {
    super(props, {
      title: 'Page not found',
      message: 'The url you are requesting does not exist',
      status: 404,
    });
  }
};