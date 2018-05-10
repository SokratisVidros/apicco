/* eslint-disable require-await */

const validate = {
  user_id: Joi.number().integer().required(),
  org_id: Joi.number().integer()
};

async function handle({ response }) {
  response.status = 200;
  response.body = { status: 'OK' };
}

module.exports = {
  validate,
  handle
}
