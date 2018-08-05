/* eslint-env jest */

const Joi = require('joi');
const { DBError } = require('db-errors');
const { NotFoundError, ValidationError } = require('objection');
const handleHttpError = require('./handleHttpError');

describe('handleHttpError(ctx, error)', () => {
  function buildContext() {
    return {
      request: {},
      response: {},
      app: {
        emit: jest.fn()
      }
    };
  }

  test('emits error on app', () => {
    const ctx = buildContext();
    const error = new Error('test');
    handleHttpError(ctx, error);
    expect(ctx.app.emit.mock.calls.length).toBe(1);
  });

  describe('on generic error', () => {
    test('returns 500 with a generic server error message', () => {
      const ctx = buildContext();
      const error = new Error('test');

      handleHttpError(ctx, error);

      expect(ctx.response.status).toBe(500);
      expect(ctx.response.body).toEqual({
        error: 'Internal Server Error',
        message: 'An internal server error occurred',
        statusCode: 500
      });
    });
  });

  describe('on joi validation error', () => {
    test('returns 400 and shows a friendly error message', () => {
      const ctx = buildContext();
      const { error } = Joi.validate('bar', Joi.valid('foo'));
      error.status = 400;

      handleHttpError(ctx, error);

      expect(ctx.response.status).toBe(400);
      expect(ctx.response.body).toEqual({
        error: 'Bad Request',
        message: '"value" must be one of [foo]',
        statusCode: 400
      });
    });
  });

  describe('on DB error', () => {
    test('returns 422 and shows a friendly error message', () => {
      const ctx = buildContext();
      const error = new DBError({ nativeError: new Error('foo') });

      handleHttpError(ctx, error);

      expect(ctx.response.status).toBe(422);
      expect(ctx.response.body).toEqual({
        error: 'Unprocessable Entity',
        message: 'Unknown DB error',
        statusCode: 422
      });
    });
  });

  describe('on objection validation error', () => {
    test('returns 422 and shows a friendly error message', () => {
      const ctx = buildContext();
      const error = new ValidationError({ message: 'This is a validation message' });

      handleHttpError(ctx, error);

      expect(ctx.response.status).toBe(422);
      expect(ctx.response.body).toEqual({
        error: 'Unprocessable Entity',
        message: 'This is a validation message',
        statusCode: 422
      });
    });
  });

  describe('on objection not found error', () => {
    test('returns 422 and shows a friendly error message', () => {
      const ctx = buildContext();
      const error = new NotFoundError();

      handleHttpError(ctx, error);

      expect(ctx.response.status).toBe(404);
      expect(ctx.response.body).toEqual({
        error: 'Not Found',
        message: 'NotFoundError',
        statusCode: 404
      });
    });
  });
});
