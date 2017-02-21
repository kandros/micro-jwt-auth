'use strict'

const jwtAuth = require('../index')

test('error throwed if secret undefined', () => {
  expect(
    () => jwtAuth()()
  ).toThrow('micro-jwt-auth must me initialized passing a secret to decode incoming JWT token')
});

test('case of request has not authorization header', () => {

  const request = {
    headers: {}
  }

  const response = {
    writeHead: jest.fn().mockImplementation(),
    end: jest.fn().mockImplementation()
  };

  const result = jwtAuth('mySecret')()(request, response)

  expect(result).toBeUndefined()
  expect(response.writeHead).toHaveBeenCalledWith(401)
  expect(response.end).toHaveBeenCalledWith('missing Authorization header')
});

test('that all works fine: no errors', () => {

  const request = {
    headers: {
      authorization: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IldhbHRlciBXaGl0ZSIsImFkbWluIjp0cnVlfQ.YyF_yOQsTSQghvM08WBp7VhsHRv-4Ir4eMQvsEycY1A'
    }
  }

  const response = {
    writeHead: jest.fn().mockImplementation(),
    end: jest.fn().mockImplementation()
  };

  const result = jwtAuth('mySecret')(() => 'Good job!')(request, response)

  expect(result).toEqual('Good job!')
  expect(response.writeHead).toHaveBeenCalledTimes(0)
  expect(response.end).toHaveBeenCalledTimes(0)

})

test('wrong bearer case', () => {

  const request = {
    headers: {
      authorization: 'Bearer wrong.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IldhbHRlciBXaGl0ZSIsImFkbWluIjp0cnVlfQ.YyF_yOQsTSQghvM08WBp7VhsHRv-4Ir4eMQvsEycY1A'
    }
  }

  const response = {
    writeHead: jest.fn().mockImplementation(),
    end: jest.fn().mockImplementation()
  };

  const result = jwtAuth('mySecret')(() => {})(request, response)

  expect(result).toBeUndefined()
  expect(response.writeHead).toHaveBeenCalledWith(401)
  expect(response.end).toHaveBeenCalledWith('invalid token in Authorization header')

})