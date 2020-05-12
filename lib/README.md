# Apicco-lib

The fastest way to build JSON APIs in [Koa.js](https://koajs.com/)

Apicco is a dynamic Koa router middleware that maps folder & file structure to JSON HTTP endpoints.

```
app/
├── api/
│   ├── movies/
│   |   ├── create.js        POST /api/movies.create
│   |   ├── info.js          POST /api/movies.info
│   |   ├── list.js    =>    POST /api/movies.list
│   |   ├── update.js        POST /api/movies.update
|   |   └── delete.js        POST /api/movies.delete
```

Apicco leverages [convention over configuration](https://en.wikipedia.org/wiki/Convention_over_configuration) and enables Node developers to deliver JSON APIs rapidly.

## Features

- [Folder structure to JSON HTTP endpoints mapping](#architecture)
- [Parameter validation](#parameter-validation)
- [Middleware interception](#options)
- [Discovery endpoint](#discovery)
- [Request body formatting](#formatting)
- [Minimal SDK](https://github.com/SokratisVidros/apicco/blob/master/sdk/js/README.md)
- [Versionless clients](https://github.com/SokratisVidros/apicco/blob/master/sdk/README.md)

<a name="architecture"></a>

## Architecture

### Folder structure

Apicco folder structure is very simple. The top API folder, contains one folder per resource.

```
app/
├── api/
│   ├── resource1/
│   |   ├── action1.js
|   |   └── action2.js
│   ├── resource2/
│   |   ├── action1.js
|   |   └── action2.js
```

Each folder contains JS **action files** that respond to API calls. Action files, are named after the methods (actions) that a controller object holds in [MVC pattern](https://en.wikipedia.org/wiki/Model%E2%80%93view%E2%80%93controller).

#### Nested resources

Apicco does not support nested resources. All resources should be located under a common parent folder. That way, your API endpoints will be kept short and simple.

### HTTP endpoints

Apicco mounts each action file to a `/{prefix}/{resource}.{action}` **POST** route. All the parameters are passed to the HTTP request body. For example:

```
POST /api/v1/movies/create

{
  "title": "Foo movie",
  "description": "This is a Foo movie",
  "year": 2018
}
```

<a name="parameter-validation"></a>

#### Parameter validation

Parameter validation is handled with [Joi](https://github.com/hapijs/joi).

If the validation fails, an HTTP 400 response will be returned to the client, along with a short human-readable error message explaining why the request was rejected.

<a name="discovery"></a>

#### Discovery

Apicco exposes a discovery endpoint that contains a JSON representation of all the API resources and action files and is used by SDKs (clients) upon initialization.

The discover **GET** endpoint is mounted at `/{prefix}/discovery`.

<a name="formatting"></a>

#### Formatting

Apicco can be also used for request body conversions and formatting. Apicco uses [Joi](https://github.com/hapijs/joi). That is, if the validation convert option is on (enabled by default), a string will be converted using the specified modifiers for string.lowercase(), string.uppercase(), string.trim(), and each replacement specified with string.replace().

The converted request body can be accessed at `ctx.request.validatedBody`;

### Action files

Action files should export the following:

- **validate**

  A [Joi](https://github.com/hapijs/joi) object schema describing the endpoint parameters.

- **handle**

  An async function that handles the corresponding HTTP request.


```js
//action1.js
const Joi = require('joi');

const validate = {
  id: Joi.number().integer().required(),
  name: Joi.string().max(256)
};

async function handle({ request, response }) {
  response.status = 200;
  response.body = {
    id: request.body.id,
    name: request.body.name
  };
}

module.exports = {
  validate,
  handle
}
```

## Usage

1. Add Apicco middleware to your Koa app

```js
const Koa = require('koa');
const apicco = require('apicco-lib');

const app = new Koa();

app.use(apicco());

app.listen(3000);
```

2. Create your API action files under the main API folder.

<a name="options"></a>

### Options

Apicco can be configured via `options` parameter. The supported options are:

**apiPath**

Path to folder containing API resources and action files.

_Defaults to `./`_

**prefix**

URL prefix for all API endpoints.

_Defaults to `/api/v1`_

**beforeMiddlewares**

An array of Koa middlewares to be executed __before__ Apicco middleware.

_Defaults to `[]`._)

This option can be used for adding authentication or authorization logic to your API. For example, you can add bearer token authentication using passport:

```js
const Koa = require('koa');
const apicco = require('apicco-lib');
const passport = require('koa-passport')

const app = new Koa();

app.use(passport.initialize());

app.use(apicco({
  beforeMiddlewares: [passport.authenticate('bearer', { session: false })]
}));
```

**afterMiddlewares**

An array of Koa middlewares to be executed __after__ Apicco middleware.

_Defaults to `[]`_

**verbose**

Controls route logging during Apicco initialization.

_Defaults to `false`_

## JSON API Design examples

### CRUD API

```
app/
├── api/
│   ├── movies/
│   |   ├── create.js        POST /api/movies.create
│   |   ├── info.js          POST /api/movies.info
│   |   ├── list.js    =>    POST /api/movies.list
│   |   ├── update.js        POST /api/movies.update
|   |   └── delete.js        POST /api/movies.delete
```

### API with relationships

```
app/
├── api/
│   ├── movies/
│   |   ├── create.js           POST /api/movies.create
|   |   ├── listActors.js       POST /api/movies.listActors
|   |   └── addReview.js        POST /api/movies.addReview
│   ├── actors/
│   |   └── addToMovie.js   =>  POST /api/actors.addToMovie
│   ├── reviews/
│   |   └── list.js             POST /api/reviews.list
```

For a complex, production API example please refer to [Slack Web API](https://api.slack.com/web) documentation
