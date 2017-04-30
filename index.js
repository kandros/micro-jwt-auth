'use strict'

const jwt = require('jsonwebtoken')

module.exports = exports = (secret) => (fn) => {
       
    if (!secret) {
        throw Error('micro-jwt-auth must be initialized passing a secret to decode incoming JWT token')
    }
    
    return (req, res) => {
        const bearerToken = req.headers.authorization
        
        if (!bearerToken) {
            res.writeHead(401)
            res.end('missing Authorization header')
            return
        }
        
        try {
            const token = bearerToken.replace('Bearer ', '')
            req.jwt = jwt.verify(token, secret);
        } catch(err) {
            res.writeHead(401)
            res.end('invalid token in Authorization header')
            return
        }
        
        return fn(req, res)
    }
}
