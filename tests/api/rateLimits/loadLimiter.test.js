/**
 * @author Justin Collier <jpcxme@gmail.com>
 * @license MIT
 * @see {@link http://github.com/jpcx/node-kraken-api|GitHub}
 */

'use strict'

const loadLimiter = require('../../../api/rateLimits/loadLimiter.js')
const defaults = require('../../../settings/defaults.json')

test('Is function', () => {
  expect(loadLimiter.constructor).toBe(Function)
})

test('Returns correct object', () => {
  const limiter = loadLimiter(defaults)
  expect(limiter.constructor).toBe(Object)
  expect(new Set(Object.keys(limiter))).toEqual(
    new Set(
      ['attempt', 'addPass', 'addFail', 'getCategory', 'getAuthRegenIntvl']
    )
  )
})

test('\'Attempt\' function returns promise', () => {
  const limiter = loadLimiter(defaults)
  expect(limiter.attempt('other').constructor).toBe(Promise)
})

test('\'AddPass\' function returns true', () => {
  const limiter = loadLimiter(defaults)
  expect(limiter.addPass('other')).toBe(true)
})

test('\'AddFail\' function returns true', () => {
  const limiter = loadLimiter(defaults)
  expect(limiter.addFail('other')).toBe(true)
})

test('Returns correct categories', () => {
  const limiter = loadLimiter(defaults)
  expect(limiter.getCategory('OHLC')).toBe('ohlc')
  expect(limiter.getCategory('Trades')).toBe('trades')
  expect(limiter.getCategory('Time')).toBe('other')
  expect(limiter.getCategory('Balance')).toBe('auth')
})

test('Returns correct auth regen interval', () => {
  const limiter = loadLimiter(defaults)
  expect(limiter.getAuthRegenIntvl('Balance')).toBe(3000)
  expect(limiter.getAuthRegenIntvl('Ledgers')).toBe(6000)
})

test('Limits pile-up calls correctly', async () => {
  jest.setTimeout(60000)
  const limiter = loadLimiter(defaults)
  let starttm = Date.now()
  await limiter.attempt('other')
  expect(Date.now() - starttm).toBeGreaterThan(defaults.limiter.baseIntvl - 100)
  expect(Date.now() - starttm).toBeLessThan(defaults.limiter.baseIntvl + 100)
  limiter.addPass('other')
  let expectedIntvl = defaults.limiter.baseIntvl * 0.95
  for (let i = 0; i < 10; i++) {
    limiter.attempt('other')
    if (i > 4) {
      if (expectedIntvl < 1000) {
        expectedIntvl = 1000
      }
      expectedIntvl *= 1.05
    }
  }
  expectedIntvl *= 1.05
  starttm = Date.now()
  await limiter.attempt('other')
  expect(Date.now() - starttm).toBeGreaterThan(expectedIntvl - 100)
  expect(Date.now() - starttm).toBeLessThan(expectedIntvl + 100)
})

test('Limits categories correctly', async () => {
  jest.setTimeout(60000)
  const limiter = loadLimiter(defaults)
  let expectedIntvl = defaults.limiter.baseIntvl
  for (let i = 0; i < 10; i++) {
    limiter.attempt('other')
    limiter.addFail('other')
    if (expectedIntvl < 4500) {
      expectedIntvl = 4500
    }
    expectedIntvl *= 1.1
  }
  let starttm = Date.now()
  await limiter.attempt('other')
  expect(Date.now() - starttm).toBeGreaterThan(expectedIntvl - 100)
  expect(Date.now() - starttm).toBeLessThan(expectedIntvl + 100)
})