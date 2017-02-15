# micro-jwt-auth
jwt authencication wrapper for zeit/micro

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