import Err from '../classes/Err';

class PageNotFound extends Err {
  constructor(
    msg='The url you are requesting does not exist',
    status=404) {
    super(msg, status);
  }
}

export default PageNotFound;