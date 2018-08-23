function promisify(orig) {
  return function (...args) {
    return new Promise((resolve, reject) => {
      function errback(err, result) {
        if (err) {
          reject(err);
        } else {
          resolve(result);
        }
      }
      args.push(errback);
      orig.apply({}, args);
    });
  };
}

function buildNsFromApi(api, ns, request) {
  Object.keys(api).forEach((key) => {
    // split key namespacing, example users.info --> ['users', 'info']
    const parts = key.split('.');

    // get the root part of the namespace
    const root = parts.shift();

    // upsert the root namespace object
    if (typeof ns[root] === 'undefined') {
      ns[root] = {};
    }

    // walks the remaining namespace parts assigning the  function at the end
    (function _iterator(obj) {
      // get next part
      const nextPart = parts.shift();

      // when is the last part, set request function
      if (parts.length === 0) {
        obj[nextPart] = request.bind({}, key);
      } else {
        // otherwise, initialize the namespace
        if (typeof obj[nextPart] === 'undefined') {
          obj[nextPart] = {};
        }
        _iterator(obj[nextPart]);
      }
    }(ns[root]));
  });

  return ns;
}

module.exports = {
  promisify,
  buildNsFromApi
};
