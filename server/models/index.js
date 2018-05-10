const { classify } = require('inflection');

module.exports = require('require-directory')(module, {
  recurse: false,
  rename: classify,
  exclude: /\.test\./
});
