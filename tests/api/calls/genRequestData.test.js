/**
 * @author Justin Collier <jpcxme@gmail.com>
 * @license MIT
 * @see {@link http://github.com/jpcx/node-kraken-api|GitHub}
 */

'use strict'

const genRequestData = require('../../../api/calls/genRequestData.js')
const defaults = require('../../../settings/defaults.json')

test('Is function', () => {
  expect(genRequestData.constructor).toBe(Function)
})

test('Is correct postdata', () => {
  const timePostDataOptions = {
    hostname: 'api.kraken.com',
    path: '/0/public/Time',
    method: 'POST',
    headers: { 'User-Agent': 'Kraken Node.JS API Client' }
  }
  const reqData = genRequestData(defaults, { method: 'Time', options: {} })
  expect(reqData.options).toEqual(timePostDataOptions)
  const post = reqData.post
  const time = post.split(/nonce=/g)[1]
  expect(+time).toBeGreaterThan((Date.now() * 1000) - 100000)
  expect(+time).toBeLessThan((Date.now() * 1000) + 100000)
})