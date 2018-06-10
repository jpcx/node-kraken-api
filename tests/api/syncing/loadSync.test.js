/**
 * @author Justin Collier <jpcxme@gmail.com>
 * @license MIT
 * @see {@link http://github.com/jpcx/node-kraken-api|GitHub}
 */

'use strict'

const loadSync = require('../../../api/syncing/loadSync.js')
const defaults = require('../../../settings/defaults.js')
const loadCall = require('../../../api/calls/loadCall.js')

test('Is function', () => {
  expect(loadSync.constructor).toBe(Function)
})

test('Returns function', () => {
  const sync = loadSync(
    defaults.tier, defaults.rateLimiter, loadCall(defaults)
  )
  expect(sync.constructor).toBe(Function)
})

test('Returns time continuously', async () => {
  jest.setTimeout(120000)
  const sync = loadSync(
    defaults.tier, defaults.rateLimiter, loadCall(defaults)
  )
  await new Promise(resolve => {
    let numCompleted = 0
    sync('Time', (err, data, event) => {
      expect(event).toBe('data')
      expect(err).toBe(null)
      expect(data.constructor).toBe(Object)
      expect(data.unixtime).toBeGreaterThanOrEqual(Date.now() - 60000)
      expect(data.unixtime).toBeLessThanOrEqual(Date.now() + 60000)
      expect(data.rfc1123).toBeGreaterThanOrEqual(Date.now() - 60000)
      expect(data.rfc1123).toBeLessThanOrEqual(Date.now() + 60000)
      numCompleted++
      if (numCompleted >= 10) resolve()
    })
  })
})

test('Callback agrees with object', async () => {
  jest.setTimeout(120000)
  const sync = loadSync(
    defaults.tier, defaults.rateLimiter, loadCall(defaults)
  )
  await new Promise(resolve => {
    let numCompleted = 0
    let timeSync
    timeSync = sync('Time', (err, data, event) => {
      expect(event).toBe('data')
      expect(err).toBe(null)
      expect(timeSync.data).toEqual(data)
      numCompleted++
      if (numCompleted >= 10) resolve()
    })
  })
})

test('Stops when closed and emits state', async () => {
  jest.setTimeout(120000)
  const sync = loadSync(
    defaults.tier, defaults.rateLimiter, loadCall(defaults)
  )
  await new Promise(resolve => {
    let numCompleted = 0
    let numCompletedAfterClose = 0
    let closed = false
    let timeSync
    timeSync = sync('Time', (err, data, event) => {
      expect(err).toBe(null)
      if (event === 'data') {
        numCompleted++
        if (numCompleted >= 3) {
          closed = true
          timeSync.close()
          setTimeout(resolve, 20000)
        }
        if (closed === true) numCompletedAfterClose++
      } else if (event === 'close') {
        expect(closed).toBe(true)
      }
      expect(numCompletedAfterClose).toBeLessThanOrEqual(1)              
    })
  })
})

test('Resumes operation after close and emits states', async () => {
  jest.setTimeout(120000)
  const sync = loadSync(
    defaults.tier, defaults.rateLimiter, loadCall(defaults)
  )
  await new Promise(resolve => {
    let numCompleted = 0
    let closed = false
    let opened = false
    let timeSync
    timeSync = sync('Time', (err, data, event) => {
      expect(err).toBe(null)
      if (event === 'data') {
        expect(data === null).toBe(false)
        if (++numCompleted > 3 && !closed) {
          closed = true
          timeSync.close()
        }
        if (closed && opened) {
          resolve()
        }
      } else if (event === 'open') {
        expect(data).toBe(null)
        expect(opened).toBe(true)
      } else if (event === 'close') {
        expect(data).toBe(null)
        expect(numCompleted).toBeGreaterThan(3)
        expect(closed).toBe(true)
        opened = true
        timeSync.open()
      }
    })
  })
})