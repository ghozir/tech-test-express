const validate = require('validate.js');
const { UnprocessableEntityError } = require('../error');
const logger = require('./logger');
const wrapper = require('./wrapper');

const isValidPayload = (payload, schema) => {
  const { value, error } = schema.validate(payload);
  if (!validate.isEmpty(error)) {
    logger.error('utils::validator', error.message, 'Joi::schama.validate', error);
    return wrapper.error(new UnprocessableEntityError(error.message));
  }
  return wrapper.data(value);
};

module.exports = {
  isValidPayload
};
