const path = require('path');
const Boom = require('boom');
const Joi = require('joi');
const Router = require('koa-router');
const compose = require('koa-compose');
const enforceBodyValidations = require('./validate');

async function accepts(ctx, next) {
  if (!ctx.accepts('application/json')) {
    ctx.throw(406, 'json only');
  }
  await next();
}

function buildAPI({
  apiPath = '.',
  prefix = '/api/v1',
  beforeMiddlewares = [],
  afterMiddlewares = [],
  joi = Joi,
  joiOptions = {},
  verbose = false
} = {}) {
  function log(msg = '') {
    if (verbose) {
      console.log('[Apicco]', msg);
    }
  }

  const router = new Router();

  router.use(accepts);

  const api = {};

  const fullApiPath = path.resolve(apiPath);

  log(`API folder set to "${fullApiPath}"`);

  const resources = require('require-directory')(module, fullApiPath, {
    exclude: /(\.test\.)|(index\.js)/
  });

  for (const r in resources) {
    if (!resources.hasOwnProperty(r)) {
      continue;
    }
    const actions = resources[r];

    for (const a in actions) {
      if (!actions.hasOwnProperty(a)) {
        continue;
      }

      const action = `${r}.${a}`;
      const { validate = {}, handle } = actions[a];

      if (!handle) {
        throw new Error(`Missing action handle for ${action} action.`);
      }

      const middlewares = [
        ...beforeMiddlewares,
        enforceBodyValidations({
          joi,
          schema: validate,
          options: joiOptions
        }),
        handle,
        ...afterMiddlewares
      ];

      const params = [];

      for (const param in validate) {
        if (!validate.hasOwnProperty(param)) {
          continue;
        }

        const { isJoi = true, _flags = {} } = validate[param];

        if (!isJoi) {
          throw new Error(
            `Invalid Joi validation for ${actionName} action: ${param}.`
          );
        }

        const paramsName = _flags.presence === 'required' ? `*${param}` : param;

        params.push(paramsName);
      }

      api[action] = params;

      router.post(path.join(prefix, action), compose(middlewares));

      log(`Loaded "${r}.${a}" action`);
    }

    router.get(
      path.join(prefix, 'discovery'),
      compose([
        ...beforeMiddlewares,
        (ctx) => {
          ctx.status = 200;
          ctx.body = api;
        },
        ...afterMiddlewares
      ])
    );
  }

  return compose([
    router.routes(),
    router.allowedMethods({
      throw: true,
      notImplemented: () => {
        Boom.notImplemented();
      },
      methodNotAllowed: () => Boom.methodNotAllowed()
    })
  ]);
}

module.exports = buildAPI;
