# micro-jwt-auth
jwt authencication wrapper for zeit/micro

> An `Authorization` header with value `Bearer MY_TOKEN_HERE` is expected

## example
```javascript
'use strict'

const jwtAuth = require('micro-jwt-auth')

/*
    if Authorization Bearer is not present or not valid, return 401
*/

module.exports = jwtAuth('my_jwt_secret')(async(req, res) => {
  return "Ciaone!"
})
```