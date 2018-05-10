function setup() {
  require('dotenv').config();

  process.env.PORT = 5001;
  process.env.NODE_ENV = 'test';
}

module.exports = setup;
