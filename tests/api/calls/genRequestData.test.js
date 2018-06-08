/**
 * @author Justin Collier <jpcxme@gmail.com>
 * @license MIT
 * @see {@link http://github.com/jpcx/node-kraken-api|GitHub}
 */

'use strict'

const genRequestData = require('../../../api/calls/genRequestData.js')
const defaults = require('../../../settings/defaults.js')

test('Is function', () => {
  expect(genRequestData.constructor).toBe(Function)
})

test('Is correct postdata', () => {
  const timePostData = {
    options:
      {
        hostname: 'api.kraken.com',
        path: '/0/public/Time',
        method: 'POST',
        headers: { 'User-Agent': 'Kraken Node.JS API Client [node-kraken-api]' }
      },
    post: ''
  }
  expect(genRequestData(defaults, 'Time')).toEqual(timePostData)
})