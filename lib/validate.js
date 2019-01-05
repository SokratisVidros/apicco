const Boom = require('boom');
const merge = require('lodash/merge');
const isEmpty = require('lodash/isEmpty');

function buildErrorDetails(errors) {
  return errors.reduce((memo, error) => {
    const errorKey = error.path.join('_');

    // https://eslint.org/docs/rules/no-prototype-builtins
    if (!Object.prototype.hasOwnProperty.call(memo, errorKey)) {
      memo[errorKey] = {
        message: error.message,
        shortcode: error.type,
        fullcode: `error.${error.path.join('_')}.${error.type}`
      };
    }

    return memo;
  }, {});
}

function validate({ schema = {}, options = {}, joi } = {}) {
  return (ctx, next) => {
    const opts = merge({}, { abortEarly: false }, options);

    if (ctx.request.body) {
      const { error } = joi.validate(ctx.request.body, schema, opts);

      if (!isEmpty(error)) {
        throw Boom.badData('', {
          details: buildErrorDetails(error.details)
        });
      }
    }

    return next();
  };
}

module.exports = validate;
