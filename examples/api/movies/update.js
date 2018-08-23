const Boom = require('boom');
const Joi = require('joi');

const validate = {
  movie_id: Joi.number()
    .integer()
    .required(),
  title: Joi.string()
    .max(256)
    .required()
};

async function handle({ movies, request, response }) {
  const index = movies.findIndex(m => m.id === request.body.movie_id);
  const movie = movies[index];

  if (!movie) {
    throw Boom.notFound();
  }

  movie.title = request.body.title;

  response.status = 200;
  response.body = movie;
}

module.exports = {
  validate,
  handle
};
