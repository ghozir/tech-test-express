
class ConflictError {
  constructor(param = 'Conflict') {
    this.message = param.message || param;
    this.data = param.data;
    this.code = param.code || 409;
  }
}

module.exports = ConflictError;
