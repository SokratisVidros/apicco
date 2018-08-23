const url = require('url');
const discover = require('./discover');
const buildRequest = require('./request');
const buildValidate = require('./validate');
const { buildNsFromApi } = require('./helpers');

async function createClient({
  api = {},
  origin = '',
  relPath = 'api/v1',
  intercept = async (req) => req
} = {}) {
  api = await discover(api, origin, relPath, intercept);

  const fullUrl = url.resolve(origin, relPath);
  const validate = buildValidate(api);
  const req = buildRequest(fullUrl, validate, intercept);

  return buildNsFromApi(api, {}, req);
}

module.exports = createClient;
