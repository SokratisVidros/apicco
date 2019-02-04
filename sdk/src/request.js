require('isomorphic-fetch');

const { promisify } = require('./helpers');

function buildRequest(url, validate, intercept) {
  function doRequest(action, data, callback) {
    const err = validate(action, data);

    if (err) {
      callback(err);
      return;
    }

    const req = {
      url: `${url}/${action}`,
      headers: {
        'Content-Type': 'application/json'
      },
      data
    };

    return intercept(req)
      .then(req =>
        fetch(req.url, {
          method: 'POST',
          headers: req.headers,
          body: data
        })
          .then(response => {
            const ok = response.ok;

            response.text().then(text => {
              const res = text.length ? JSON.parse(text) : text;

              callback(
                ok ? null : res,
                ok ? res : undefined
              )
            });
          })
          .catch(e => callback(e))
      )
  }

  return function request(action, data, callback) {
    if (typeof data === 'function' && !callback) {
      callback = data;
      data = {};
    }

    if (!callback) {
      return promisify(doRequest)(action, data);
    }
    doRequest(action, data, callback);
  };
}

module.exports = buildRequest;
