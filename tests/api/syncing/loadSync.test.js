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
  const sync = loadSync(defaults, loadCall(defaults))
  expect(sync.constructor).toBe(Function)
})

test('Returns time continuously', () => new Promise(
  (resolve, reject) => {
    jest.setTimeout(120000)
    const sync = loadSync(defaults, loadCall(defaults))
    let numCompleted = 0
    sync('Time', (err, data, instance) => {
      if (err) reject(err)
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
    })
  }
))

test('Callback agrees with object', () => new Promise(
  (resolve, reject) => {
    jest.setTimeout(120000)
    const sync = loadSync(defaults, loadCall(defaults))
    let timeSync
    let pastData
    timeSync = sync('Time', (err, data) => {
      if (err) reject(err)
      if (pastData === undefined) {
        pastData = data
      } else {
        expect(timeSync.data).toEqual(pastData)
        timeSync.close()
        resolve()
      }
    })
  }
))

test('Returns instance', () => new Promise(
  (resolve, reject) => {
    jest.setTimeout(120000)
    const sync = loadSync(defaults, loadCall(defaults))
    let numCompleted = 0
    let timeSync
    timeSync = sync('Time', (err, data, instance) => {
      if (err) reject(err)
      expect(instance).toBe(timeSync)
      timeSync.close()
      resolve()
    })
  }
))

test('Stops when closed', () => new Promise(
  (resolve, reject) => {
    jest.setTimeout(120000)
    const sync = loadSync(defaults, loadCall(defaults))
    let numCompleted = 0
    let numCompletedAfterClose = 0
    let closed = false
    sync('Time', (err, data, instance) => {
      if (err) reject(err)
      numCompleted++
      if (numCompleted >= 3) {
        instance.close()
        closed = true
        setTimeout(resolve, 20000)
      }
      if (closed === true) numCompletedAfterClose++
      expect(numCompletedAfterClose).toBeLessThanOrEqual(1)
    })
  }
))

test('Resumes operation after close', () => new Promise(
  (resolve, reject) => {
    jest.setTimeout(120000)
    const sync = loadSync(defaults, loadCall(defaults))
    let numCompleted = 0
    let closed = false
    let opened = false
    let timeSync
    timeSync = sync('Time', (err, data) => {
      if (err) reject(err)
      if (++numCompleted > 3 && !closed) {
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

test('Once method works', async () => {
  jest.setTimeout(240000)
  const sync = loadSync(defaults, loadCall(defaults))
  let timeSync
  timeSync = sync('Time')
  expect(timeSync.once.constructor).toBe(Function)
  expect(timeSync.once().constructor).toBe(Promise)
  expect(timeSync.once(() => { }).constructor).toBe(Boolean)
  for (let i = 0; i < 10; i++) {
    expect(await timeSync.once()).toEqual(timeSync.data)
  }
})

test('Disabling auto data via callback return works', () => new Promise(
  (resolve, reject) => {
    jest.setTimeout(60000)
    const sync = loadSync(defaults, loadCall(defaults))
    let count
    sync('Time',
      (err, data, instance) => {
        if (err) reject(err)
        if (count++ === 0) {
          return true
        } else {
          expect(instance.data).toEqual({})
          instance.close()
          resolve()
        }
      }
    )
  }
))

test('Custom data compilation works', () => new Promise(
  (resolve, reject) => {
    jest.setTimeout(60000)
    const sync = loadSync(defaults, loadCall(defaults))
    sync('Time',
      (err, data, instance) => {
        if (err) reject(err)
        if (!(instance.data instanceof Array)) {
          instance.data = []
          instance.data.push(new Date(data))
        } else {
          expect(instance.data.constructor).toBe(Array)
          expect(instance.data[0].constructor).toBe(Date)
          instance.close()
          resolve()
        }
        return true
      }
    )
  }
))