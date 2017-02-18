'use strict'

const jwtAuth = require('../index')

test('error throwed if secret undefined', () => {
  expect(
    () => jwtAuth()()
  ).toThrow('micro-jwt-auth must me initialized passing a secret to decode incoming JWT token')
});

test('case of request has not authorization header', () => {

  const request = {
    headers: {

    }
  }

  const response = {
    writeHead: jest.fn().mockImplementation(),
    end: jest.fn().mockImplementation()
  };

  const result = jwtAuth('mySecret')()(request, response);

  expect(result).toBeUndefined()
  expect(response.writeHead).toHaveBeenCalledWith(401);
  expect(response.end).toHaveBeenCalledWith('missing Authorization header');
});