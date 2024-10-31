
class PayloadTooLargeError {
  constructor(param = 'Payload Too Large') {
    this.message = param.message || param;
    this.data = param.data;
    this.code = param.code || 413;
  }
}

module.exports = PayloadTooLargeError;
