# Apicco-SDK

Apicco SDK creates dynamically an [Apicco API](https://github.com/SokratisVidros/apicco/blob/master/lib/README.md) client, that works both in Node and browser environments.

```
POST /api/movies.create      api.movies.create({ title: 'Foo' })
POST /api/movies.info        api.movies.info({ movie_id: 42 })
POST /api/movies.list    =>  api.movies.list()
POST /api/movies.update      api.movies.update({ movie_id: 42, title: 'Bar' }
POST /api/movies.delete      api.movies.delete({ movie_id: 42 }
```

## Usage

```JS
const apicco = require('apicco-sdk');

apicco({
  origin: 'http://apicco.test/',
}).then(api => {
  return api.users.sayHello();
});
```

## RPC style method invocation

Apicco SDK enables developers to invoke remote endpoints in an RPC fashion. For example:

```
POST /api/users.sayHello  =>  api.users.sayHello({ name: 'John Doe' })
```

## Minimal versionless clients

Apicco SDK leverages discovery endpoint and fetches latest API description upon initialization. That way, client updates are not required when the API is modified and changes are backwards compatible.

Moreover, client size is minimal since there is no static code for any of endpoint.

## Human friendly error messages

Apicco API returns JSON error objects that contain human friendly error messages. For example when `foo_id` request parameter validation fails, the following error will be returned to the client:

```json
{
  "error": "Bad Request",
  "message": "Invalid Request Body - child \"foo_id\" fails because [\"foo_id\" must be a number]",
  "statusCode": 400
```

### Options

**origin**

Specify the origin of the Apicco API server

_Defaults to `''`_

**relPath**

Specify the relative of the Apicco API

_Defaults to `api/v1`_

**intercept**

Specify an interceptor function that will be executed before each request

_Defaults to `async (req) => req`_
