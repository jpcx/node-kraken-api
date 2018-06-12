/**
 * @author Justin Collier <jpcxme@gmail.com>
 * @license MIT
 * @see {@link http://github.com/jpcx/node-kraken-api|GitHub}
 */

'use strict'

const kraken = require('../')

test('Is function', () => expect(kraken.constructor).toBe(Function))

test('Returns correct object', () => {
  const api = kraken()
  expect(api.constructor).toBe(Object)
  expect(Object.keys(api)).toEqual([ 'call', 'sync' ])
})

test('Retrieves parsed time from Kraken servers', () => new Promise(
  (resolve, reject) => {
    jest.setTimeout(60000)
    const api = kraken()
    api.call('Time').then(
      data => {
        expect(typeof data.unixtime).toBe('number')
        expect(typeof data.rfc1123).toBe('number')
        expect(data.unixtime).toBeLessThanOrEqual(Date.now() + 60000)
        expect(data.unixtime).toBeGreaterThanOrEqual(Date.now() - 60000)
        expect(data.rfc1123).toBeLessThanOrEqual(Date.now() + 60000)
        expect(data.rfc1123).toBeGreaterThanOrEqual(Date.now() - 60000)
        resolve()
      }
    ).catch(reject)
  }
))

test('Syncs calls', () => new Promise(
  (resolve, reject) => {
    jest.setTimeout(240000)
    const api = kraken()
    let numCompleted = 0
    api.sync('Time', (err, data) => {
      if (err) reject(err)
      expect(data.constructor).toBe(Object)
      expect(data.unixtime).toBeGreaterThanOrEqual(Date.now() - 60000)
      expect(data.unixtime).toBeLessThanOrEqual(Date.now() + 60000)
      expect(data.rfc1123).toBeGreaterThanOrEqual(Date.now() - 60000)
      expect(data.rfc1123).toBeLessThanOrEqual(Date.now() + 60000)
      numCompleted++
      if (numCompleted >= 10) resolve()
    })
  }
))

test('Unsyncs calls', () => new Promise(
  (resolve, reject) => {
    jest.setTimeout(240000)
    const api = kraken()
    let numCompleted = 0
    let numCompletedAfterClose = 0
    let closed = false
    let timeSync
    timeSync = api.sync('Time', (err, data) => {
      if (err) reject(err)
      expect(data === null).toBe(false)
      numCompleted++
      if (numCompleted >= 3) {
        timeSync.close()
        closed = true
        setTimeout(resolve, 10000)
      }
      if (closed === true) numCompletedAfterClose++
      expect(numCompletedAfterClose).toBeLessThanOrEqual(1)
    })
  }
))

test('Creates sync promises', () => new Promise(
  (resolve, reject) => {
    jest.setTimeout(240000)
    const api = kraken()
    let timeSync
    timeSync = api.sync('Time')
    expect(timeSync.next.constructor).toBe(Function)
    expect(timeSync.next().constructor).toBe(Promise)
    let lastTime
    timeSync.next().then(
      data => {
        expect(data).toEqual(timeSync.data)
        expect(lastTime === timeSync.time).toBe(false)
        lastTime = timeSync.time
        timeSync.next().then(
          data => {
            expect(data).toEqual(timeSync.data)
            expect(lastTime === timeSync.time).toBe(false)
            resolve()
          }
        ).catch(reject)
      }
    ).catch(reject)
  }
))

test('Observes rate limits', async () => {
  jest.setTimeout(640000)
  const api = kraken()
  for (let i = 0; i < 30; i++) {
    try {
      await api.call('Time')
    } catch (e) {
      expect(e.message.match(/rate limit/gi)).toBe(null)
    }
  }
})

test(
  'Makes authenticated calls (if credentials are provided in ./auth.json)',
  () => new Promise(
    (resolve, reject) => {
      jest.setTimeout(60000)
      let userSettings
      try {
        userSettings = require('../auth.json')
      } catch (e) {
        console.log('No user settings configuration provided.')
      }
      if (
        userSettings !== undefined &&
        userSettings.hasOwnProperty('key') &&
        userSettings.hasOwnProperty('secret') &&
        userSettings.hasOwnProperty('tier') &&
        userSettings.key !== '' &&
        userSettings.secret !== '' &&
        userSettings.tier !== 0
      ) {
        const api = kraken(userSettings)
        api.call('Ledgers').then(
          data => {
            expect(data.constructor).toBe(Object)
            resolve()
          }
        ).catch(reject)
      } else {
        resolve()
      }
    }
  )
)
