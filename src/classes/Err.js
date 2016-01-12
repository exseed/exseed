/** Application error class */
export default class Err {
  /** Generates a custom error */
  constructor(customProps, defaultProps) {
    const customErrProps = Object.assign(defaultProps || {}, customProps);
    const errProps = Object.assign({
      title: 'Unknown error',
      message: 'Something unexpected happened',
      status: 500,
    }, customErrProps);

    this.name = this.constructor.name;
    this.title = errProps.title;
    this.message = errProps.message;
    this.status = errProps.status;
    Error.captureStackTrace(this, this.constructor);
  }

  toJSON() {
    return {
      title: this.title,
      message: this.message,
    };
  }

  toApiResponse() {
    return {
      errors: [this.toJSON()],
    };
  }
}