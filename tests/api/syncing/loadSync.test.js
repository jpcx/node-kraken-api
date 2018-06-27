/**
 * @author Justin Collier <jpcxme@gmail.com>
 * @license MIT
 * @see {@link http://github.com/jpcx/node-kraken-api|GitHub}
 */

'use strict'

const loadSync = require('../../../api/syncing/loadSync.js')
const defaults = require('../../../settings/defaults.json')
const loadCall = require('../../../api/calls/loadCall.js')
const loadLimiter = require('../../../api/rateLimits/loadLimiter.js')

test('Is function', () => {
  expect(loadSync.constructor).toBe(Function)
})

test('Returns function', () => {
  const limiter = loadLimiter(defaults)
  const call = loadCall(defaults, limiter)
  const sync = loadSync(defaults, limiter, call)
  expect(sync.constructor).toBe(Function)
})

test('Returns time continuously', () => new Promise(
  (resolve, reject) => {
    jest.setTimeout(120000)
    const limiter = loadLimiter(defaults)
    const call = loadCall(defaults, limiter)
    const sync = loadSync(defaults, limiter, call)
    let numCompleted = 0
    sync('Time', (err, data, instance) => {
      if (err) reject(err)
      else {
        expect(data.constructor).toBe(Object)
        expect(data.unixtime).toBeGreaterThanOrEqual(Date.now() - 60000)
        expect(data.unixtime).toBeLessThanOrEqual(Date.now() + 60000)
        expect(data.rfc1123).toBeGreaterThanOrEqual(Date.now() - 60000)
        expect(data.rfc1123).toBeLessThanOrEqual(Date.now() + 60000)
        numCompleted++
        if (numCompleted >= 10) {
          instance.close()
          resolve()
        }
      }
    })
  }
))

test('Callback agrees with object', () => new Promise(
  (resolve, reject) => {
    jest.setTimeout(120000)
    const limiter = loadLimiter(defaults)
    const call = loadCall(defaults, limiter)
    const sync = loadSync(defaults, limiter, call)
    let timeSync
    timeSync = sync('Time', (err, data) => {
      if (err) reject(err)
      else {
        expect(timeSync.data).toEqual(data)
        timeSync.close()
        resolve()
      }
    })
  }
))

test('Returns instance', () => new Promise(
  (resolve, reject) => {
    jest.setTimeout(120000)
    const limiter = loadLimiter(defaults)
    const call = loadCall(defaults, limiter)
    const sync = loadSync(defaults, limiter, call)
    let numCompleted = 0
    let timeSync
    timeSync = sync('Time', (err, data, instance) => {
      if (err) reject(err)
      else {
        expect(instance).toBe(timeSync)
        timeSync.close()
        resolve()
      }
    })
  }
))

test('Stops when closed', () => new Promise(
  (resolve, reject) => {
    jest.setTimeout(120000)
    const limiter = loadLimiter(defaults)
    const call = loadCall(defaults, limiter)
    const sync = loadSync(defaults, limiter, call)
    let numCompleted = 0
    let numCompletedAfterClose = 0
    let closed = false
    sync('Time', (err, data, instance) => {
      if (err) reject(err)
      else {
        numCompleted++
        if (numCompleted >= 3) {
          instance.close()
          closed = true
          setTimeout(resolve, 20000)
        }
        if (closed === true) numCompletedAfterClose++
        expect(numCompletedAfterClose).toBeLessThanOrEqual(1)
      }
    })
  }
))

test('Resumes operation after close', () => new Promise(
  (resolve, reject) => {
    jest.setTimeout(120000)
    const limiter = loadLimiter(defaults)
    const call = loadCall(defaults, limiter)
    const sync = loadSync(defaults, limiter, call)
    let numCompleted = 0
    let closed = false
    let opened = false
    let timeSync
    timeSync = sync('Time', (err, data) => {
      if (err) reject(err)
      else if (++numCompleted > 3 && !closed) {
        timeSync.close()
        closed = true
        setTimeout(() => {
          timeSync.open()
          opened = true
        }, 5000)
      }
      if (closed && opened) {
        timeSync.close()
        resolve()
      }
    })
  })
)

test('Custom intervals work', () => new Promise(
  (resolve, reject) => {
    jest.setTimeout(120000)
    const limiter = loadLimiter(defaults)
    const call = loadCall(defaults, limiter)
    const sync = loadSync(defaults, limiter, call)
    let numCompleted = 0
    let lastTime
    sync('Time', 20000, (err, data, instance) => {
      if (err) reject(err)
      else {
        if (lastTime) {
          expect(data.unixtime - lastTime).toBeGreaterThanOrEqual(15000)
          expect(data.unixtime - lastTime).toBeLessThanOrEqual(25000)
        }
        lastTime = data.unixtime
        if (++numCompleted >= 4) {
          instance.close()
          resolve()
        }
      }
    })
  }
))

test('Once method works', async () => {
  jest.setTimeout(240000)
  const limiter = loadLimiter(defaults)
  const call = loadCall(defaults, limiter)
  const sync = loadSync(defaults, limiter, call)
  let timeSync
  timeSync = sync('Time')
  expect(timeSync.once.constructor).toBe(Function)
  expect(timeSync.once().constructor).toBe(Promise)
  expect(timeSync.once(() => { }).constructor).toBe(Boolean)
  for (let i = 0; i < 10; i++) {
    expect(await timeSync.once()).toEqual(timeSync.data)
  }
})

test('Custom interaction with instance works', () => new Promise(
  (resolve, reject) => {
    jest.setTimeout(60000)
    const limiter = loadLimiter(defaults)
    const call = loadCall(defaults, limiter)
    const sync = loadSync(defaults, limiter, call)
    sync('Time',
      (err, data, instance) => {
        if (err) reject(err)
        else if (!(instance.dateHist instanceof Array)) {
          instance.dateHist = []
          instance.dateHist.push(new Date(data))
        } else {
          expect(instance.dateHist.constructor).toBe(Array)
          expect(instance.dateHist[0].constructor).toBe(Date)
          instance.close()
          resolve()
        }
      }
    )
  }
))

test('Custom data formatting works', () => new Promise(
  (resolve, reject) => {
    jest.setTimeout(60000)
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
    const limiter = loadLimiter(settings)
    const call = loadCall(settings, limiter)
    const sync = loadSync(settings, limiter, call)
    sync('Time',
      (err, data, instance) => {
        if (err) reject(err)
        else {
          expect(typeof data).toBe('number')
          expect(data).toBeLessThanOrEqual(Date.now() + 60000)
          expect(data).toBeGreaterThanOrEqual(Date.now() - 60000)
          instance.once().then(t => {
            expect(typeof t).toBe('number')
            expect(t).toBeLessThanOrEqual(Date.now() + 60000)
            expect(t).toBeGreaterThanOrEqual(Date.now() - 60000)
            instance.once((err, data, instance) => {
              if (err) reject(err)
              else {
                expect(typeof data).toBe('number')
                expect(data).toBeLessThanOrEqual(Date.now() + 60000)
                expect(data).toBeGreaterThanOrEqual(Date.now() - 60000)
                resolve()
              }
            })
          })
        }
      }
    )
  }
))