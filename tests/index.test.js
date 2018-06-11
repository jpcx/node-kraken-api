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

test('Retrieves parsed time from Kraken servers', async () => {
  jest.setTimeout(60000)
  const api = kraken()
  const time = await api.call('Time')
  expect(typeof time.unixtime).toBe('number')
  expect(typeof time.rfc1123).toBe('number')
  expect(time.unixtime).toBeLessThanOrEqual(Date.now() + 60000)
  expect(time.unixtime).toBeGreaterThanOrEqual(Date.now() - 60000)
  expect(time.rfc1123).toBeLessThanOrEqual(Date.now() + 60000)
  expect(time.rfc1123).toBeGreaterThanOrEqual(Date.now() - 60000)
})

test('Syncs calls', async () => {
  jest.setTimeout(240000)
  const api = kraken()
  await new Promise(resolve => {
    let numCompleted = 0
    api.sync('Time', (err, data) => {
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

test('Unsyncs calls', async () => {
  jest.setTimeout(240000)
  const api = kraken()
  await new Promise(resolve => {
    let numCompleted = 0
    let numCompletedAfterClose = 0
    let closed = false
    let timeSync
    timeSync = api.sync('Time', (err, data) => {
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

test('Creates sync promises', async () => {
  jest.setTimeout(240000)
  const api = kraken()
  let timeSync
  timeSync = api.sync('Time')
  expect(timeSync.next.constructor).toBe(Function)
  expect(timeSync.next().constructor).toBe(Promise)
  for (let i = 0; i < 10; i++) {
    expect(await timeSync.next()).toEqual(timeSync.data)
  }
})

test('Observes rate limits', async () => {
  jest.setTimeout(480000)
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
  async () => {
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
      try {
        const ledgers = await api.call('Ledgers')
        expect(ledgers.constructor).toBe(Object)
      } catch (e) {
        expect(e).toBe(null)
      }
    }
  }
)