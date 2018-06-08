/**
 * @author Justin Collier <jpcxme@gmail.com>
 * @license MIT
 * @see {@link http://github.com/jpcx/node-kraken-api|GitHub}
 */

'use strict'

const loadCall = require('../../../api/calls/loadCall.js')
const defaults = require('../../../settings/defaults.js')

test('Is function', () => {
  expect(loadCall.constructor).toBe(Function)
})

test('Returns function', () => {
  expect(loadCall(defaults).constructor).toBe(Function)
})

test('Returns promise from method', () => {
  expect(loadCall(defaults)('Time').constructor).toBe(Promise)
})

test('Returns parsed time data from Kraken', async () => {
  jest.setTimeout(60000)
  const time = await loadCall(defaults)('Time')
  expect(typeof time.unixtime).toBe('number')
  expect(typeof time.rfc1123).toBe('number')
  expect(time.unixtime).toBeLessThanOrEqual(Date.now() + 60000)
  expect(time.unixtime).toBeGreaterThanOrEqual(Date.now() - 60000)
  expect(time.rfc1123).toBeLessThanOrEqual(Date.now() + 60000)
  expect(time.rfc1123).toBeGreaterThanOrEqual(Date.now() - 60000)
})