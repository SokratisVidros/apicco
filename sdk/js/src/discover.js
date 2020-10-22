require('isomorphic-fetch');

const url = require('url');

async function discover(api, origin, relPath, intercept) {
  if (Object.keys(api).length === 0) {
    const req = await intercept({
      url: url.resolve(origin, `${relPath}/discovery`),
      headers: {
        'Content-Type': 'application/json'
      }
    });

    api = await fetch(req.url, { ...req })
      .then(res => Promise.all([res.json(), res.headers]))
      .then(([response, headers]) => ({
        ...response,
        __meta: {
          withCredentials: headers.get('Access-Control-Allow-Credentials')
        }
      }));
  }

  return api;
}

module.exports = discover;
