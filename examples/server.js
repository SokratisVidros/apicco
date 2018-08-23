const Koa = require('koa');
const apicco = require('../lib/index');
const bodyParser = require('koa-bodyparser');

const app = new Koa();

app.use(bodyParser());

// Add a dummy resource storage
app.context.movies = [];

app.use(apicco({
  verbose: true,
  apiPath: './api'
}));

app.listen(3000);
