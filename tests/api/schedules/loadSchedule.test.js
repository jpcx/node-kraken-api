/**
 * @author Justin Collier <jpcxme@gmail.com>
 * @license MIT
 * @see {@link http://github.com/jpcx/node-kraken-api|GitHub}
 */

'use strict'

const loadSchedule = require('../../../api/schedules/loadSchedule.js')
const defaults = require('../../../settings/defaults.js')
const loadCall = require('../../../api/calls/loadCall.js')

test('Is function', () => {
  expect(loadSchedule.constructor).toBe(Function)
})

test('Returns correct object', () => {
  const schedule = loadSchedule(
    defaults.tier, defaults.rateLimiter, loadCall(defaults)
  )
  expect(schedule.constructor).toBe(Object)
  expect(schedule.add.constructor).toBe(Function)
  expect(schedule.delete.constructor).toBe(Function)
})

test('Returns time continuously', async () => {
  jest.setTimeout(120000)
  const schedule = loadSchedule(
    defaults.tier, defaults.rateLimiter, loadCall(defaults)
  )
  await new Promise(resolve => {
    let numCompleted = 0
    schedule.add('Time', (err, data) => {
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

test('Stops when canceled', async () => {
  jest.setTimeout(120000)
  const schedule = loadSchedule(
    defaults.tier, defaults.rateLimiter, loadCall(defaults)
  )
  await new Promise(resolve => {
    let numCompleted = 0
    let numCompletedAfterCancel = 0
    let canceled = false
    const id = schedule.add('Time', (err, data) => {
      expect(err).toBe(null)
      expect(data !== null).toBe(true)
      if (canceled === true) numCompletedAfterCancel++
      expect(numCompletedAfterCancel).toBeLessThanOrEqual(1)
      numCompleted++
      if (numCompleted >= 3) {
        schedule.delete(id)
        canceled = true
        setTimeout(resolve, 20000)
      }
    })
  })
})