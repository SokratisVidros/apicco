# Apicco

[![Build Status](https://travis-ci.org/SokratisVidros/apicco.svg?branch=master)](https://travis-ci.org/SokratisVidros/apicco)

The fastest way to build JSON APIs in [Koa.js](https://koajs.com/)

Map your API server folder structure to language‑level like method calls on the client.

```
app/
└── api/
    └── user/
        └── sayHello.js => POST /api/user.sayHello => api.user.sayHello()
```

## Apicco middleware

Apicco middleware is a dynamic Koa router middleware that maps folder & file structure to JSON HTTP endpoints.

- [NPM package](https://www.npmjs.com/package/apicco-lib)
- [Documentation](lib/README.md)

## Apicco SDK

Apicco SDK creates dynamically an Apicco API client.

- [NPM package](https://www.npmjs.com/package/apicco-sdk)
- [Documentation](sdk/README.md)
