const Joi = require('joi');

const validate = {
  title: Joi.string()
    .max(256)
    .required()
};

async function handle({ movies, request, response }) {
  const newMovie = {
    id: new Date().getTime(),
    title: request.body.title
  };

  movies.push(newMovie);

  response.status = 201;
  response.body = newMovie;
}

module.exports = {
  validate,
  handle
};
