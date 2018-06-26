/**
 * @author Justin Collier <jpcxme@gmail.com>
 * @license MIT
 * @see {@link http://github.com/jpcx/node-kraken-api|GitHub}
 */

'use strict'

const loadCall = require('../../../api/calls/loadCall.js')
const defaults = require('../../../settings/defaults.json')
const loadLimiter = require('../../../api/rateLimits/loadLimiter.js')

test('Is function', () => {
  expect(loadCall.constructor).toBe(Function)
})

test('Returns function', () => {
  expect(loadCall(defaults, loadLimiter(defaults)).constructor).toBe(Function)
})

test('Returns promise from method', () => {
  expect(
    loadCall(defaults, loadLimiter(defaults))('Time').constructor
  ).toBe(Promise)
})

test('Returns parsed time data from Kraken', async () => {
  jest.setTimeout(60000)
  const time = await loadCall(defaults, loadLimiter(defaults))('Time')
  expect(typeof time.unixtime).toBe('number')
  expect(typeof time.rfc1123).toBe('number')
  expect(time.unixtime).toBeLessThanOrEqual(Date.now() + 60000)
  expect(time.unixtime).toBeGreaterThanOrEqual(Date.now() - 60000)
  expect(time.rfc1123).toBeLessThanOrEqual(Date.now() + 60000)
  expect(time.rfc1123).toBeGreaterThanOrEqual(Date.now() - 60000)
})

test('Retrieves unparsed time when settings.parse.dates is false', async() => {
  jest.setTimeout(60000)
  const settings = {
    ...defaults, ...{ parse: { numbers: true, dates: false } }
  }
  const time = await loadCall(settings, loadLimiter(settings))('Time')
  expect(typeof time.unixtime).toBe('number')
  expect(typeof time.rfc1123).toBe('string')
  expect(time.unixtime * 1000).toBeLessThanOrEqual(Date.now() + 60000)
  expect(time.unixtime * 1000).toBeGreaterThanOrEqual(Date.now() - 60000)
  expect(Date.parse(time.rfc1123)).toBeLessThanOrEqual(Date.now() + 60000)
  expect(Date.parse(time.rfc1123)).toBeGreaterThanOrEqual(
    Date.now() - 60000
  )
})

test('Retrieves parsed time when settings.parse.numbers is false', async () => {
  jest.setTimeout(60000)
  const settings = {
    ...defaults, ...{ parse: { numbers: false, dates: true } }
  }
  const time = await loadCall(settings, loadLimiter(settings))('Time')
  expect(typeof time.unixtime).toBe('number')
  expect(typeof time.rfc1123).toBe('number')
  expect(time.unixtime).toBeLessThanOrEqual(Date.now() + 60000)
  expect(time.unixtime).toBeGreaterThanOrEqual(Date.now() - 60000)
  expect(time.rfc1123).toBeLessThanOrEqual(Date.now() + 60000)
  expect(time.rfc1123).toBeGreaterThanOrEqual(Date.now() - 60000)
})

test('Retrieves custom-parsed data', async () => {
  jest.setTimeout(30000)
  const dataFormatter = (method, options, data) => {
    if (method === 'Time') {
      return data.unixtime
    } else {
      return data
    }
  }
  const settings = {
    ...defaults, ...{ dataFormatter }
  }
  const time = await loadCall(settings, loadLimiter(settings))('Time')
  expect(typeof time).toBe('number')
  expect(time).toBeLessThanOrEqual(Date.now() + 60000)
  expect(time).toBeGreaterThanOrEqual(Date.now() - 60000)
})