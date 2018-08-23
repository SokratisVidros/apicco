const Koa = require('koa');
const bodyParser = require('koa-bodyparser');
const apicco = require('../lib/index');

const app = new Koa();

app.use(bodyParser());

// Add a dummy resource storage
app.context.movies = [];

app.use(
  apicco({
    verbose: true,
    apiPath: './api'
  })
);

app.listen(3000);
