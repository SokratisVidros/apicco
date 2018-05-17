const Joi = require('joi');

const validate = {
  id: Joi.number().integer().required(),
  name: Joi.string().max(256)
};

async function handle({ request, response }) {
  response.status = 200;
  response.body = {
    id: request.body.id,
    name: request.body.name
  };
}

module.exports = {
  validate,
  handle
}
