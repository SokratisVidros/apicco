const Koa = require('koa');
const Boom = require('boom');
const path = require('path');
const bodyParser = require('koa-bodyparser');
const enforceHttps = require('koa-sslify');
const helmet = require('koa-helmet');
const cors = require('@koa/cors');
const riviere = require('riviere');
const Router = require('koa-router');
const apicco = require('apicco-lib');
const handleHttpError = require('./support/handleHttpError');

// TODO: Enable Cors

const appKeys = process.env.SECRET_KEYS.split(',');
const silent = process.env.NODE_ENV === 'test';
const proxy = /production|staging/.test(process.env.NODE_ENV);

const app = new Koa();

app.keys = appKeys;
app.silent = silent;
app.proxy = proxy;

// enable security headers
if (process.env.ENABLE_SECURITY_HEADERS === 'yes') {
  app.use(helmet());
}

// enforce HTTPS
if (process.env.ENABLE_HTTPS === 'yes') {
  app.use(
    enforceHttps({
      trustProtoHeader: true // trust x-forwarded-proto header from Heroku
    })
  );
}

// enable CORS
app.use(cors());

// parse application/json
app.use(
  bodyParser({
    onerror: err => {
      throw Boom.badRequest(err);
    }
  })
);

// log HTTP traffic and handle errors
app.use(
  riviere.middleware({
    inbound: {
      enabled: !silent
    },
    outbound: {
      enabled: !silent
    },
    health: [
      {
        method: 'GET',
        path: '/health'
      }
    ],
    errors: {
      enabled: !silent,
      callback: handleHttpError
    }
  })
);

// build apicco API
app.use(apicco({
  apiPath: './api'
}));

// redirect to apicco discovery route
const router = new Router();

router.get('/', (ctx, next) => {
  ctx.redirect('/api/v1/discovery')
});

app.use(router.routes());

module.exports = app;
