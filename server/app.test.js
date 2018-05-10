/* eslint-env jest */

const app = require('./app');
const request = require('supertest');

test('sanity check', async () => {
  const response = await request(app.callback()).get('/');
  expect(response.status).toEqual(200);
});
