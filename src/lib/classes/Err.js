/** Application error class */
class Err {
  /** Generates a custom error */
  constructor(message='Unnamed error', status=500) {
    this.name = this.constructor.name;
    this.message = message;
    this.status = status;
    Error.captureStackTrace(this, this.constructor);
  }
}

export default Err;