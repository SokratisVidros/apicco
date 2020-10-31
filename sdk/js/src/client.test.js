/* eslint-env jest */
require('isomorphic-fetch');
const nock = require('nock');

const fetchSpy = jest.spyOn(window, 'fetch');
const apiccoClient = require('./client');

nock.disableNetConnect();

const makeApicco = ({ withCredentials = false } = {}) => {
  nock('http://apicco.test')
    .get('/api/v1/discovery')
    .reply(
      200,
      {
        'fruits.list': [],
        'fruits.info': ['*fruit_id'],
        'fruits.eat': ['*name', '*vitamins', 'ripe'],
      },
      withCredentials
        ? {
            'Access-Control-Allow-Credentials': true,
            'Access-Control-Expose-Headers': 'Access-Control-Allow-Credentials',
          }
        : {}
    );

  return apiccoClient({
    origin: 'http://apicco.test',
    relPath: 'api/v1',
  });
};

describe('Apicco Client', () => {
  let apicco;

  beforeEach(async () => {
    apicco = await makeApicco();
  });

  afterEach(() => {
    nock.cleanAll();
    jest.clearAllMocks();
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

    it('exposes a try catch api', async () => {
      const fruits = await apicco.fruits.list();
      expect(fruits).toEqual(['🍉', '🍊', '🍋']);
    });

    it('exposes a promisified api', async () => {
      await expect(apicco.fruits.list()).resolves.toEqual(['🍉', '🍊', '🍋']);
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
        .post('/api/v1/fruits.list', '{"bar":"foo"}')
        .reply(400, {
          error: 'Bad Request',
          message: 'Invalid Request Body',
          statusCode: 400,
        });
    });

    it('exposes an async await promisified api', async () => {
      try {
        await apicco.fruits.list({ bar: 'foo' });
      } catch (err) {
        expect(err).toEqual({
          error: 'Bad Request',
          message: 'Invalid Request Body',
          statusCode: 400,
        });
      }
    });

    it('exposes a thenable promisified api', async () => {
      await expect(apicco.fruits.list({ bar: 'foo' })).rejects.toEqual({
        error: 'Bad Request',
        message: 'Invalid Request Body',
        statusCode: 400,
      });
    });

    it('exposes a callback api', (done) => {
      apicco.fruits.list({ bar: 'foo' }, (err, fruits) => {
        expect(err).toEqual({
          error: 'Bad Request',
          message: 'Invalid Request Body',
          statusCode: 400,
        });
        expect(fruits).toBeUndefined();
        done();
      });
    });
  });

  describe('request method when response is empty', () => {
    beforeEach(() => {
      nock('http://apicco.test').post('/api/v1/fruits.list').reply(null);
    });

    it('exposes a promisified api', async () => {
      const fruits = await apicco.fruits.list();
      expect(fruits).toEqual('');
    });
  });

  describe('validations', () => {
    beforeEach(() => {
      nock('http://apicco.test').post('/api/v1/fruits.eat').reply(204);
    });

    it('validate required parameters for the action request', async () => {
      try {
        await apicco.fruits.eat();
      } catch (err) {
        expect(err.message).toBe('fruits.eat missing params: name, vitamins');
      }
    });
  });

  describe('request method with credential headers', () => {
    const filterFruitsListCalls = (calls) =>
      calls.filter(
        ([fetchUrl, fetchParams]) => fetchUrl.indexOf('fruits.list') > -1
      );

    beforeEach(() => {
      nock('http://apicco.test')
        .post('/api/v1/fruits.list')
        .reply(200, ['🍉', '🍊', '🍋']);
    });

    it('sends requests using credential:include when Access-Control-Allow-Credentials is set on server', async () => {
      apicco = await makeApicco({ withCredentials: true });
      await apicco.fruits.list();
      expect(filterFruitsListCalls(fetchSpy.mock.calls)[0]).toMatchObject([
        'http://apicco.test/api/v1/fruits.list',
        {
          credentials: 'include',
        },
      ]);
    });

    it('send requests using credential:same-origin (default) when no Access-Control headers are set on server', async () => {
      apicco = await makeApicco({ withCredentials: false });
      await apicco.fruits.list();
      expect(filterFruitsListCalls(fetchSpy.mock.calls)[0]).toMatchObject([
        'http://apicco.test/api/v1/fruits.list',
        {
          credentials: 'same-origin',
        },
      ]);
    });
  });
});
