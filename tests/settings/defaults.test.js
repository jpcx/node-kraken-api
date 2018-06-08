/**
 * @author Justin Collier <jpcxme@gmail.com>
 * @license MIT
 * @see {@link http://github.com/jpcx/node-kraken-api|GitHub}
 */

'use strict'

const defaults = require('../../settings/defaults.js')

test('Is object', () => {
  expect(defaults.constructor).toBe(Object)
})

test('Has correct properties', () => {
  expect(
    new Set(Object.keys(defaults))
  ).toEqual(
    new Set(
      [
        'key', 'secret', 'tier', 'timeout', 'hostname', 'version',
        'pubMethods', 'privMethods', 'parse', 'rateLimiter'
      ]
    )
  )
  expect(
    typeof defaults.rateLimiter.use
  ).toBe('boolean')
  expect(
    defaults.rateLimiter.getCounterLimit.constructor
  ).toBe(Function)
  expect(
    defaults.rateLimiter.getCounterIntvl.constructor
  ).toBe(Function)
  expect(
    defaults.rateLimiter.getIncrementAmt.constructor
  ).toBe(Function)
  expect(
    typeof defaults.rateLimiter.limitOrderOps
  ).toBe('boolean')
  expect(
    defaults.rateLimiter.isOrderOp.constructor
  ).toBe(Function)
})