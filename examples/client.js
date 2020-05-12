const apicco = require('../sdk/js/index');

apicco({
  origin: 'http://localhost:3000'
}).then(async (api) => {
  console.log('Create a new movie...');
  console.log('POST api/v1/movies/create...');
  const newMovie = await api.movies.create({
    title: 'Pulp fiction'
  });
  console.log(newMovie);

  console.log('\nList all movies...');
  console.log('POST api/v1/movies.list...');
  console.log(await api.movies.list());

  console.log('\nUpdate existing movie...');
  console.log('POST api/v1/movies/update...');
  const updatedMovie = await api.movies.update({
    movie_id: newMovie.id,
    title: 'The Godfather'
  });
  console.log(updatedMovie);

  console.log('\nList all movies...');
  console.log('POST api/v1/movies.list...');
  console.log(await api.movies.list());

  console.log('\nDelete existing movie...');
  console.log('POST api/v1/movies.delete...');
  await api.movies.delete({
    movie_id: updatedMovie.id
  });

  console.log('\nList all movies...');
  console.log('POST api/v1/movies.list...');
  console.log(await api.movies.list());
});
