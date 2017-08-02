'use strict'

const jwtAuth = require('../index')
const VALID_HEADER = 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IldhbHRlciBXaGl0ZSIsImFkbWluIjp0cnVlfQ.YyF_yOQsTSQghvM08WBp7VhsHRv-4Ir4eMQvsEycY1A'
const INVALID_HEADER = 'Bearer wrong.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IldhbHRlciBXaGl0ZSIsImFkbWluIjp0cnVlfQ.YyF_yOQsTSQghvM08WBp7VhsHRv-4Ir4eMQvsEycY1A'
const JWT_CONTENT = { sub: '1234567890', name: 'Walter White', admin: true }

test('error throwed if secret undefined', () => {
  expect(
    () => jwtAuth()()
  ).toThrow('micro-jwt-auth must be initialized passing a secret to decode incoming JWT token')
});

test('case of request has not authorization header', () => {

  const request = {
    headers: {},
    url: 'https://api.cabq.gov/domain/resources/1'
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
      authorization: VALID_HEADER
    },
    url: 'https://api.cabq.gov/domain/resources/1'
  }

  const response = {
    writeHead: jest.fn().mockImplementation(),
    end: jest.fn().mockImplementation()
  };

  const result = jwtAuth('mySecret')(() => 'Good job!')(request, response)

  expect(result).toEqual('Good job!')
  expect(response.writeHead).toHaveBeenCalledTimes(0)
  expect(response.end).toHaveBeenCalledTimes(0)
  expect(request.jwt).toEqual(JWT_CONTENT)
})

test('wrong bearer case', () => {

  const request = {
    headers: {
      authorization: INVALID_HEADER
    },
    url: 'https://api.cabq.gov/domain/resources/1'
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

test('no need authorization bearer if whitelisted path', () => {

  const request = {
    headers: {},
    url: 'https://api.cabq.gov/domain/resources/1'
  }

  const response = {
    writeHead: jest.fn().mockImplementation(),
    end: jest.fn().mockImplementation()
  };

  const result = jwtAuth('mySecret', [ '/domain/resources/1' ])(() => 'Good job!')(request, response)

  expect(result).toEqual('Good job!')
  expect(response.writeHead).toHaveBeenCalledTimes(0)
  expect(response.end).toHaveBeenCalledTimes(0)

})

test('decode jwt even for whitelisted path', () => {

  const request = {
    headers: {
      authorization: VALID_HEADER
    },
    url: 'https://api.cabq.gov/domain/resources/1'
  }

  const response = {
    writeHead: jest.fn().mockImplementation(),
    end: jest.fn().mockImplementation()
  };

  const result = jwtAuth('mySecret', [ '/domain/resources/1' ])(() => 'Good job!')(request, response)

  expect(result).toEqual('Good job!')
  expect(response.writeHead).toHaveBeenCalledTimes(0)
  expect(response.end).toHaveBeenCalledTimes(0)
  expect(request.jwt).toEqual(JWT_CONTENT)
})

test('do not throw error if jwt is invalid for whitelisted path', () => {

  const request = {
    headers: {
      authorization: INVALID_HEADER
    },
    url: 'https://api.cabq.gov/domain/resources/1'
  }

  const response = {
    writeHead: jest.fn().mockImplementation(),
    end: jest.fn().mockImplementation()
  };

  const result = jwtAuth('mySecret', [ '/domain/resources/1' ])(() => 'Good job!')(request, response)

  expect(result).toEqual('Good job!')
  expect(response.writeHead).toHaveBeenCalledTimes(0)
  expect(response.end).toHaveBeenCalledTimes(0)
  expect(request.jwt).toBeUndefined()
})
