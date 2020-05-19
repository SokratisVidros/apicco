# Apicco-SDK

Apicco SDK creates dynamically an [Apicco API](https://github.com/SokratisVidros/apicco/blob/master/lib/README.md) client, that works both in Node and browser environments.

Port of [JS Apicco-SDK](../js/README.md) in Ruby.

```
POST /api/movies.create      api.movies_create(title: 'Foo')
POST /api/movies.info        api.movies_info(movie_id: 42)
POST /api/movies.list        api.movies_list
POST /api/movies.update      api.movies_update(movie_id: 42, title: 'Bar')
POST /api/movies.delete      api.movies_delete(movie_id: 42)
```

## Prerequisites

- Ruby version >= 2.6 (use rvm https://rvm.io/rvm/basics)

## Usage

```ruby
> require 'apicco-sdk'
> token = 'deadbeef'
> intercept = ->(req) { req[:headers]["Authorization"]="Bearer #{token}" }
> api = ::ApiccoSDK::Client.new('http://example.com', rel_path:'api/v2', intercept:intercept)
> api.movies_list
```

## RPC style method invocation

Apicco SDK enables developers to invoke remote endpoints in an RPC fashion. For example:

```
POST /api/users.sayHello  =>  api.users_sayHello(name: 'John Doe')
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

## Options

**origin** (Required positional argument)

Specify the origin of the Apicco API server

**rel_path**

Specify the relative of the Apicco API

_Defaults to `api/v1`_

**intercept**

Specify an interceptor lamdbda that will be executed before each request

_Defaults to `->(req) { req }`_

**api**

Specify the discovery endpoint response as hash to avoid the request

_Defaults to `{}`_
