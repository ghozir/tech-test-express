const {
  NotFoundError,
  InternalServerError,
  BadRequestError,
  ConflictError,
  ExpectationFailedError,
  ForbiddenError,
  GatewayTimeoutError,
  ServiceUnavailableError,
  UnauthorizedError,
  UnprocessableEntityError,
  PayloadTooLargeError,
  UnsupportedMediaTypeError,
  TooManyRequestsError,
} = require('../error');
const { ERROR:httpError } = require('../http-status/status_code');

const data = (data) => ({ err: null, data});

const paginationData = (data, meta) => ({ err: null, data, meta});

const error = (err) => ({ err, data: null });

const response = (res, type, result, message = '', responseCode = 200) => {
  let status = true;
  let data = result.data;
  let code = responseCode;

  if (type === 'fail'){
    status = false;
    data = result.err.data || null;
    message = result.err.message || message;

    const errCode = checkErrorCode(result.err);
    code = result.err.code || errCode;
    responseCode = errCode;

    if (result.err.responseError) {
      data = result.err.data.data || null;
      message = result.err.data.message || message;
      code = result.err.status;
      responseCode = code;
    }
  }

  res.send(responseCode, {
    success: status,
    data,
    message,
    code
  });
};

const paginationResponse = (res, type, result, message = '', code = 200) => {
  let status = true;
  let data = result.data;
  if (type === 'fail'){
    status = false;
    data = null;
    message = result.err;
  }
  res.send(code, {
    success: status,
    data,
    meta: result.meta,
    code,
    message
  });
};

const checkErrorCode = (error) => {

  switch (error.constructor) {
  case BadRequestError:
    return httpError.BAD_REQUEST;
  case ConflictError:
    return httpError.CONFLICT;
  case ExpectationFailedError:
    return httpError.EXPECTATION_FAILED;
  case ForbiddenError:
    return httpError.FORBIDDEN;
  case GatewayTimeoutError:
    return httpError.GATEWAY_TIMEOUT;
  case InternalServerError:
    return httpError.INTERNAL_ERROR;
  case NotFoundError:
    return httpError.NOT_FOUND;
  case ServiceUnavailableError:
    return httpError.SERVICE_UNAVAILABLE;
  case UnauthorizedError:
    return httpError.UNAUTHORIZED;
  case UnprocessableEntityError:
    return httpError.UNPROCESSABLE_ENTITY;
  case PayloadTooLargeError:
    return httpError.PAYLOAD_TOO_LARGE_FAILED;
  case UnsupportedMediaTypeError:
    return httpError.UNSUPPORTED_MEDIA_TYPE_FAILED;
  case TooManyRequestsError:
    return httpError.TOO_MANY_REQUESTS;
  default:
    return httpError.INTERNAL_ERROR;
  }

};

module.exports = {
  data,
  paginationData,
  error,
  response,
  paginationResponse
};
