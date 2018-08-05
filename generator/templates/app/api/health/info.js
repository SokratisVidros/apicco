async function handle({ response }) {
  response.status = 200;
  response.body = { status: 'OK' };
}

module.exports = {
  handle
}
