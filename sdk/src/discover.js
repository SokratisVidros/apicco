const url = require('url');
const http = require('tiny-json-http');

async function discover(api, origin, relPath, intercept) {
  if (Object.keys(api).length === 0) {
    const req = await intercept({
      url: url.resolve(origin, `${relPath}/discovery`),
      headers: {
        'Content-Type': 'application/json'
      }
    });
    api = (await http.get(req)).body;
  }

  return api;
}

module.exports = discover;
