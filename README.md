# micro-jwt-auth [![Build Status](https://travis-ci.org/kandros/micro-jwt-auth.svg?branch=master)](https://travis-ci.org/kandros/micro-jwt-auth) [![npm](https://img.shields.io/npm/v/micro-jwt-auth.svg)](https://www.npmjs.com/package/micro-jwt-auth)

[json web token(jwt)](https://jwt.io/introduction/) authorization wrapper for [Micro](https://github.com/zeit/micro)

> An `Authorization` header with value `Bearer MY_TOKEN_HERE` is expected

## Install

If you are using `yarn`:

```bash
yarn add micro-jwt-auth
```

If you are using `npm`:

```bash
npm install micro-jwt-auth
```

## Usage

### `jwtAuth(secret, [[whitelist,] config])`

`jwtAuth` returns a function that takes `handler` as the only param and returns the new asynchronous handler you can use in `micro`. Verified token can be read from `req.jwt`.

`secret` corresponds to `jsonwebtoken`'s `secretOrPrivateKey`. After [jsonwebtoken's readme](https://github.com/auth0/node-jsonwebtoken#usage):

> `secretOrPublicKey` is a string or buffer containing either the secret for HMAC algorithms, or the PEM encoded public key for RSA and ECDSA.
> If `jwt.verify` is called asynchronous, `secretOrPublicKey` can be a function that should fetch the secret or public key. See below for a detailed example
>
> As mentioned in [this comment](https://github.com/auth0/node-jsonwebtoken/issues/208#issuecomment-231861138), there are other libraries that expect base64 encoded secrets (random bytes encoded using base64), if that is your case you can pass `Buffer.from(secret, 'base64')`, by doing this the secret will be decoded using base64 and the token verification will use the original random bytes.

`whitelist` is an optional array of whitelisted routes to endpoints where token can be absent or can be invalid. For instance, `['/api/login', '/static']`

`config`:

- `whitelist` is an alternative place where whitelists can be set, when `whitelist` param is not given.

- `resAuthMissing` is a message returned when there is no `authentication` header. Defaults to `'missing Authorization header'`.

- `resAuthInvalid` is a message returned when the token is invalid. Defaults to  `'invalid token in Authorization header'`

- `verifyOptions` corresponds to `jsonwebtoken`'s `options` in `verify`. After [jsonwebtoken's readme](https://github.com/auth0/node-jsonwebtoken#usage):

    > - `algorithms`: List of strings with the names of the allowed algorithms. For instance, `["HS256", "HS384"]`.
    > - `audience`: if you want to check audience (`aud`), provide a value here. The audience can be checked against a string, a regular expression or a list of strings and/or regular expressions.
    >    > Eg: `"urn:foo"`, `/urn:f[o]{2}/`, `[/urn:f[o]{2}/, "urn:bar"]`
    > - `complete`: return an object with the decoded `{ payload, header, signature }` instead of only the usual content of the payload.
    > - `issuer` (optional): string or array of strings of valid values for the `iss` field.
    > - `ignoreExpiration`: if `true` do not validate the expiration of the token.
    > - `ignoreNotBefore`...
    > - `subject`: if you want to check subject (`sub`), provide a value here
    > - `clockTolerance`: number of seconds to tolerate when checking the `nbf` and `exp` claims, to deal with small clock differences among different servers
    > - `maxAge`: the maximum allowed age for tokens to still be valid. It is expressed in seconds or a string describing a time span [zeit/ms](https://github.com/zeit/ms).
    >    > Eg: `1000`, `"2 days"`, `"10h"`, `"7d"`. A numeric value is interpreted as a seconds count. If you use a string be sure you provide the time units (days, hours, etc), otherwise milliseconds unit is used by default (`"120"` is equal to `"120ms"`).
    > - `clockTimestamp`: the time in seconds that should be used as the current time for all necessary comparisons.
    > - `nonce`: if you want to check `nonce` claim, provide a string value here. It is used on Open ID for the ID Tokens. ([Open ID implementation notes](https://openid.net/specs/openid-connect-core-1_0.html#NonceNotes))

## Examples

### with no other wrappers

```javascript
'use strict'

const jwtAuth = require('micro-jwt-auth')

/*
    if Authorization Bearer is not present or not valid, return 401
*/

module.exports = jwtAuth('my_jwt_secret')(async (req, res) => `Hi ${req.jwt.username}!`)
```

### with multiple wrappers

```javascript
'use strict'

const jwtAuth = require('micro-jwt-auth')

const compose = (...fns) => fns.reduce((f, g) => (...args) => f(g(...args)))

const handle = async (req, res) => `Hi ${req.jwt.username}!`

module.exports = compose(
    jwtAuth(process.env.jwt_secret),
    anotherWrapper,
    analyticsWrapper,
    redirectWrapper,
    yetAnotherWrapper
)(handle)
```

### with whitelist of paths

Whitelisted paths make JWT token _optional_. However if valid token is provided it will be decoded.

```javascript
'use strict'

const jwtAuth = require('micro-jwt-auth')

/*
    Bypass authentication for login route
*/

module.exports = jwtAuth('my_jwt_secret', ['api/login'])(async (req, res) => `Hi ${req.jwt.username}!`)
```

### with custom responses

```javascript
'use strict'

const jwtAuth = require('micro-jwt-auth')

/*
    You can overwrite the default response with the optional config object
*/

module.exports = jwtAuth('my_jwt_secret', ['api/login'], {
    resAuthInvalid: 'Error: Invalid authentication token',
    resAuthMissing: 'Error: Missing authentication token',
})(async (req, res) => `Hi ${req.jwt.username}!`)

/*
  You may skip the whitelist if unnecessary
*/

module.exports = jwtAuth('my_jwt_secret', {
    resAuthInvalid: 'Error: Invalid authentication token',
    resAuthMissing: 'Error: Missing authentication token',
})(async (req, res) => `Hi ${req.jwt.username}!`)
```

### with custom verify options

```javascript
'use strict'

const jwtAuth = require('micro-jwt-auth')

/*
  You can give custom options to `jsonwebtoken.verify`
*/

module.exports = jwtAuth('my_jwt_secret', ['api/login'], {
    verifyOptions: {
        algorithms: ['RS256'],
    },
})(async (req, res) => `Hi ${req.jwt.username}!`)

/*
  You may skip the whitelist if unnecessary
*/

module.exports = jwtAuth('my_jwt_secret', {
    verifyOptions: {
        algorithms: ['RS256'],
    },
})(async (req, res) => `Hi ${req.jwt.username}!`)
```
