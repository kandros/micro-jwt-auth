[![Build Status](https://travis-ci.org/kandros/micro-jwt-auth.svg?branch=master)](https://travis-ci.org/kandros/micro-jwt-auth)
[![npm](https://img.shields.io/npm/v/micro-jwt-auth.svg)](https://www.npmjs.com/package/micro-jwt-auth)
# micro-jwt-auth
[json web token(jwt)](https://jwt.io/introduction/) authorization wrapper for [Micro](https://github.com/zeit/micro)

> An `Authorization` header with value `Bearer MY_TOKEN_HERE` is expected

## examples

#### with no other wrappers
```javascript
'use strict'

const jwtAuth = require('micro-jwt-auth')

/*
    if Authorization Bearer is not present or not valid, return 401
*/

module.exports = jwtAuth('my_jwt_secret')(async(req, res) => {
  return `Ciaone ${req.jwt.username}!`
})
```

#### with multiple wrappers

```javascript
'use strict'

const jwtAuth = require('micro-jwt-auth')

const compose = (...fns) => fns.reduce((f, g) => (...args) => f(g(...args)))

const handle = async(req, res) => {
  return `Ciaone ${req.jwt.username}!`
}

module.exports = compose(
    jwtAuth(process.env.jwt_secret),
    anotherWrapper,
    analitycsWrapper,
    redirectWrapper,
    yetAnotherWrapper
)(handle)
```
