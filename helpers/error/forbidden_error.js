
class ForbiddenError {
  constructor(param = 'Forbidden') {
    this.message = param.message || param;
    this.data = param.data;
    this.code = param.code || 403;
  }
}

module.exports = ForbiddenError;
