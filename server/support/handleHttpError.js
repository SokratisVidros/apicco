const Boom = require('boom');

function handleHttpError(ctx, error) {
  let parsedError;

  if (error.name === 'BadRequestError') {
    parsedError = Boom.badData(error.message);
  } else {
    parsedError = Boom.boomify(error);
  }

  const { statusCode, payload } = parsedError.output;

  ctx.response.status = statusCode;
  ctx.response.body = payload || {};

  ctx.app.emit('error', error, ctx);
}

module.exports = handleHttpError;
