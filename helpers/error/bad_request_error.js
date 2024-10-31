
class BadRequestError {
  constructor(param = 'Bad Request') {
    this.message = param.message || param;
    this.data = param.data;
    this.code = param.code || 400;
  }
}

module.exports = BadRequestError;
