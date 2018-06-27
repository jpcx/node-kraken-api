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
  expect(Object.keys(api)).toEqual([
    'call', 'sync', 'setOTP', 'setTimeout', 'setRetryCt', 'setLimiter'
  ])
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
      else {
        expect(data.constructor).toBe(Object)
        expect(data.unixtime).toBeGreaterThanOrEqual(Date.now() - 60000)
        expect(data.unixtime).toBeLessThanOrEqual(Date.now() + 60000)
        expect(data.rfc1123).toBeGreaterThanOrEqual(Date.now() - 60000)
        expect(data.rfc1123).toBeLessThanOrEqual(Date.now() + 60000)
        numCompleted++
        if (numCompleted >= 10) resolve()
      }
    })
  }
))

test('Observes rate limits', () => new Promise(
  resolve => {
    jest.setTimeout(640000)
    const api = kraken({ retryCt: 5 })
    let numCompleted = 0
    for (let i = 0; i < 20; i++) {
      api.call('OHLC', { pair: 'XXBTZUSD', i })
        .then(() => { ++numCompleted >= 20 && resolve() })
        .catch(err => expect(err.message.match(/rate limit/gi)).toBe(null))
    }
  }
))

test('Realtime settings work', () => new Promise(
  resolve => {
    jest.setTimeout(60000)
    const api = kraken()
    expect(api.setOTP('foobar')).toBe(true)
    api.setOTP(null)
    expect(api.setTimeout(1)).toBe(true)
    expect(api.setRetryCt(0)).toBe(true)
    expect(api.setLimiter({ baseIntvl: 1000, minIntvl: 1000 })).toBe(true)
    api.call('Time')
      .then(x => expect(x).toBeUndefined())
      .catch(err => {
        expect(err.message).toMatch(/ETIMEDOUT/gi)
        resolve()
      })
  }
))

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
