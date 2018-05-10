require('dotenv').config();

const packageJSON = require('./package.json');
const http = require('http');
const figlet = require('figlet');
const { format: formatUrl } = require('url');
const app = require('./app');

const PORT = process.env.PORT || 5000;
const server = http.createServer(app.callback());

server.start = async () => {
  if (server.listening) {
    throw new Error('Server already listening');
  }

  await new Promise((resolve, reject) => {
    server.listen(PORT, err => {
      if (err) {
        reject(err);
      } else {
        resolve();
      }
    });
  });

  const address = server.address();

  return {
    url: formatUrl({
      protocol: process.env.NODE_ENV === 'development' ? 'http:' : 'https://',
      hostname: address.address,
      port: address.port
    })
  };
};

server.stop = async () => {
  if (!server.listening) {
    return;
  }

  await new Promise((resolve, reject) => {
    server.close(err => {
      if (err) {
        reject(err);
      } else {
        resolve();
      }
    });
  });
};

if (require.main === module) {
  server
    .start()
    .then(info => {
      figlet(`${packageJSON.name} ${app.env}`, (err, data) => {
        if (err) {
          console.dir(err); // eslint-disable-line no-console
          return;
        }
        console.log(data); // eslint-disable-line no-console
        console.log(`Listening at ${info.url}...`); // eslint-disable-line no-console
      });
    })
    .catch(err => {
      console.error(err); // eslint-disable-line no-console
    });
}

module.exports = server;
