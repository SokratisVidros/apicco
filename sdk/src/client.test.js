/* eslint-env jest */

const nock = require('nock');
const apiccoClient = require('./client');

nock.disableNetConnect();

describe('Apicco Client', () => {
  let apicco;

  beforeEach(async () => {
    nock('http://apicco.test')
      .get('/api/v1/discovery')
      .reply(200, {
        'fruits.list': [],
        'fruits.info': ['*fruit_id'],
        'fruits.eat': ['*name', '*vitamins', 'ripe']
      });

    apicco = await apiccoClient({
      origin: 'http://apicco.test',
      relPath: 'api/v1'
    });
  });

  afterEach(() => {
    nock.cleanAll();
  });

  it('discovers all API methods along with their parameters automatically', () => {
    expect(apicco).toMatchSnapshot();
  });

  describe('request method on success', () => {
    beforeEach(() => {
      nock('http://apicco.test')
        .post('/api/v1/fruits.list')
        .reply(200, ['🍉', '🍊', '🍋']);
    });

    it('exposes a promisified api', async () => {
      const fruits = await apicco.fruits.list();
      expect(fruits).toEqual(['🍉', '🍊', '🍋']);
    });

    it('request methods exposes a callback api', (done) => {
      apicco.fruits.list((err, fruits) => {
        expect(err).toBeNull();
        expect(fruits).toEqual(['🍉', '🍊', '🍋']);
        done();
      });
    });
  });

  describe('request method on error', () => {
    beforeEach(() => {
      nock('http://apicco.test')
        .post('/api/v1/fruits.list')
        .reply(400, {
          error: 'Bad Request',
          message: 'Invalid Request Body',
          statusCode: 400
        });
    });

    it('exposes a promisified api', async () => {
      try {
        await apicco.fruits.list();
      } catch (err) {
        expect(err).toEqual({
          error: 'Bad Request',
          message: 'Invalid Request Body',
          statusCode: 400
        });
      }
    });

    it('request methods exposes a callback api', (done) => {
      apicco.fruits.list((err, fruits) => {
        expect(err).toEqual({
          error: 'Bad Request',
          message: 'Invalid Request Body',
          statusCode: 400
        });
        expect(fruits).toBeUndefined();
        done();
      });
    });
  });

  describe('request method when response is empty', () => {
    beforeEach(() => {
      nock('http://apicco.test')
        .post('/api/v1/fruits.list')
        .reply(null);
    });

    it('exposes a promisified api', async () => {
      const fruits = await apicco.fruits.list();
      expect(fruits).toEqual('');
    });
  });

  describe('validations', () => {
    beforeEach(() => {
      nock('http://apicco.test')
        .post('/api/v1/fruits.eat')
        .reply(204);
    });

    it('validate required parameters for the action request', async () => {
      try {
        await apicco.fruits.eat();
      } catch (err) {
        expect(err.message).toBe('fruits.eat missing params: name, vitamins');
      }
    });
  });
});
