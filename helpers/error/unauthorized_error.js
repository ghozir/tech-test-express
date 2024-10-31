class Unauthorized {
  constructor(param = 'Unauthorized') {
    this.message = param.message || param;
    this.data = param.data;
    this.code = param.code || 401;
  }
}

module.exports = Unauthorized;
