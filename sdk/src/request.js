const http = require('tiny-json-http');
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
      .then(req => http.post(req, (err, res) => {
        if (err) {
          callback(err);
          return;
        }
        callback(null, res.body);
      }))
      .catch(e => callback(e));
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
