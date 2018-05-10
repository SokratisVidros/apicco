/* eslint-env jest */

const app = require('../app');
const request = require('supertest');

test('sanity check', async () => {
  const response = await request(app.callback()).get('/health');
  expect(response.status).toEqual(200);
  expect(response.body).toEqual({ status: 'OK' });
});
