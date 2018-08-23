async function handle({ movies, request, response }) {
  response.status = 200;
  response.body = movies;
}

module.exports = {
  handle
};
