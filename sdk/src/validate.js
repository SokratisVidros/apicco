function buildValidate(api = {}) {
  return function validate(action, params = {}) {
    const required = api[action].reduce((memo, p) => {
      if (p.startsWith('*')) {
        memo.push(p.substring(1));
      }
      return memo;
    }, []);

    const missing = required.filter(
      param => typeof params[param] === 'undefined'
    );

    return missing.length
      ? new Error(`${action} missing params: ${missing.join(', ')}`)
      : null;
  };
}

module.exports = buildValidate;
