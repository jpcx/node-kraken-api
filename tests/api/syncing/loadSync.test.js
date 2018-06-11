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
    sync('Time', (err, data) => {
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
    timeSync = sync('Time', (err, data) => {
      expect(err).toBe(null)
      expect(data === null).toBe(false)
      expect(timeSync.data).toEqual(data)
      numCompleted++
      if (numCompleted >= 10) resolve()
    })
  })
})

test('Stops when closed', async () => {
  jest.setTimeout(120000)
  const sync = loadSync(
    defaults.tier, defaults.rateLimiter, loadCall(defaults)
  )
  await new Promise(resolve => {
    let numCompleted = 0
    let numCompletedAfterClose = 0
    let closed = false
    let timeSync
    timeSync = sync('Time', (err, data) => {
      expect(err).toBe(null)
      expect(data === null).toBe(false)
      numCompleted++
      if (numCompleted >= 3) {
        timeSync.close()
        closed = true
        setTimeout(resolve, 20000)
      }
      if (closed === true) numCompletedAfterClose++
      expect(numCompletedAfterClose).toBeLessThanOrEqual(1)              
    })
  })
})

test('Resumes operation after close', async () => {
  jest.setTimeout(120000)
  const sync = loadSync(
    defaults.tier, defaults.rateLimiter, loadCall(defaults)
  )
  await new Promise(resolve => {
    let numCompleted = 0
    let closed = false
    let opened = false
    let timeSync
    timeSync = sync('Time', (err, data) => {
      expect(err).toBe(null)
      expect(data === null).toBe(false)
      if (++numCompleted > 3 && !closed) {
        timeSync.close()
        closed = true
        setTimeout(() => { 
          timeSync.open()
          opened = true
        }, 5000)
      }
      if (closed && opened) {
        resolve()
      }
    })
  })
})

test('Creates promises', async () => {
  jest.setTimeout(240000)
  const sync = loadSync(
    defaults.tier, defaults.rateLimiter, loadCall(defaults)
  )
  let timeSync
  timeSync = sync('Time')
  expect(timeSync.next.constructor).toBe(Function)
  expect(timeSync.next().constructor).toBe(Promise)
  for (let i = 0; i < 10; i++) {
    expect(await timeSync.next()).toEqual(timeSync.data)
  }
})