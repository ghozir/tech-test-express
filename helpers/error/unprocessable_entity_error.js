class UnprocessableEntityError {
  constructor(param = 'Unprocessable Entity') {
    this.message = param.message || param;
    this.data = param.data;
    this.code = param.code || 422;
  }
}

module.exports = UnprocessableEntityError;
