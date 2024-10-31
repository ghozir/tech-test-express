
class TooManyRequestsError {
  constructor(param = 'Too Many Requests') {
    this.message = param.message || param;
    this.data = param.data;
    this.code = param.code || 429;
  }
}

module.exports = TooManyRequestsError;
