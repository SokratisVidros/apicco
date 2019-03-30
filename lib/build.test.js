/* eslint-env jest */

const koaRouter = require('koa-router');
const buildAPI = require('./build');

describe('buildAPI(opts)', () => {
  function mockCtx(obj) {
    return {
      method: 'POST',
      request: {
        body: {}
      },
      response: {},
      accepts: () => true,
      ...obj
    };
  }

  beforeAll(() => {
    jest.mock('require-directory', () => jest.fn(() => {
      const Joi = require('joi');

      return {
        movies: {
          list: {
            validate: {},
            handle: () => {}
          },
          play: {
            validate: {
              title: Joi.string().required()
            },
            handle: () => {}
          }
        },
        books: {
          read: {
            validate: {
              title: Joi.string().required(),
              author: Joi.string()
            },
            handle: () => {}
          }
        }
      };
    }));
  });

  test('sanity check', async () => {
    const ctx = mockCtx();
    const next = jest.fn();

    await buildAPI()(ctx, next);

    expect(ctx.router).toMatchSnapshot();
  });

  test('maps api folder structure to resources.action routes', async () => {
    const ctx = mockCtx();
    const next = jest.fn();

    await buildAPI()(ctx, next);

    expect(ctx.router.stack.map(i => i.path)).toEqual(
      expect.arrayContaining([
        '/api/v1/movies.list',
        '/api/v1/movies.play',
        '/api/v1/books.read'
      ])
    );
  });

  test('adds GET discovery endpoint to broadcast API auto-discovery data', async () => {
    const ctx = mockCtx({
      method: 'GET',
      path: '/api/v1/discovery'
    });
    const next = jest.fn();

    await buildAPI()(ctx, next);

    expect(ctx._matchedRoute).toBe('/api/v1/discovery');
    expect(ctx.body).toEqual({
      'books.read': expect.arrayContaining(['*title', 'author']),
      'movies.list': [],
      'movies.play': expect.arrayContaining(['*title'])
    });
  });

  test('assigns koa-router to returned apicco middleware', async () => {
    const middleware = buildAPI();
    expect(middleware.router).toBeInstanceOf(koaRouter);
  });
});
