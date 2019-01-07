/* eslint-env jest */

const Joi = require('joi');
const validate = require('./validate');

describe('validate({ schema, joi, joiOptions }) middleware', () => {
  function mockCtx() {
    return {
      request: {
        body: {}
      }
    };
  }

  describe('when validation error exists', () => {
    test('throws a 422 boom error including detailed error data', async () => {
      const ctx = mockCtx();
      const next = jest.fn();
      const schema = { foo: Joi.required() };

      try {
        await validate({
          schema,
          joi: Joi
        })(ctx, next);
      } catch (err) {
        expect(err.isBoom).toBeTruthy();
        expect(err.output.statusCode).toBe(422);
        expect(err.message).toBe(
          'child "foo" fails because ["foo" is required]'
        );
        expect(err.data).toEqual({
          details: {
            foo: {
              message: '"foo" is required',
              shortcode: 'any.required',
              fullcode: 'error.foo.any.required'
            }
          }
        });
      }
    });

    test('throws a 400 boom error when configured as such', async () => {
      const ctx = mockCtx();
      const next = jest.fn();
      const schema = { foo: Joi.required() };

      try {
        await validate({
          schema,
          errorCode: 400,
          joi: Joi
        })(ctx, next);
      } catch (err) {
        expect(err.isBoom).toBeTruthy();
        expect(err.output.statusCode).toBe(400);
      }
    });
  });

  describe('when validation error does not exist', () => {
    test('calls next middleware', async () => {
      const ctx = await mockCtx();
      const next = jest.fn();

      await validate({ joi: Joi })(ctx, next);
      expect(next).toHaveBeenCalledTimes(1);
    });
  });
});
