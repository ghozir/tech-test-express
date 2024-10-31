
class UnsupportedMediaTypeError {
  constructor(param = 'Unsupported Media Type') {
    this.message = param.message || param;
    this.data = param.data;
    this.code = param.code || 415;
  }
}

module.exports = UnsupportedMediaTypeError;
