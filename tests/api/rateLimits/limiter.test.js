/**
 * @author Justin Collier <jpcxme@gmail.com>
 * @license MIT
 * @see {@link http://github.com/jpcx/node-kraken-api|GitHub}
 */

'use strict'

const limiter = require('../../../api/rateLimits/limiter.js')
const defaults = require('../../../settings/defaults.js')
const readFileJSON = require('../../../tools/readFileJSON.js')
const writeFileJSON = require('../../../tools/writeFileJSON.js')
const counterLocation = '/cache/counter.json'

test('Is function', () => {
  expect(limiter.constructor).toBe((async () => { }).constructor)
})

test('Returns promise', async () => {
  jest.setTimeout(15000)
  const counterCache = await readFileJSON(counterLocation)
  const limitOp = limiter(defaults.tier, defaults.rateLimiter, 'Time')
  expect(limitOp.constructor).toBe(Promise)
  await limitOp
  await writeFileJSON(counterLocation, counterCache)
})

test('Modifies counter', async () => {
  jest.setTimeout(15000)  
  const counterCache = await readFileJSON(counterLocation)
  expect(counterCache === undefined).toBe(false)
  await limiter(defaults.tier, defaults.rateLimiter, 'Time')
  expect(counterCache === await readFileJSON(counterLocation)).toBe(false)
  await writeFileJSON(counterLocation, counterCache)
})

test('Adds counts successfully', async () => {
  jest.setTimeout(60000)
  const counterCache = await readFileJSON(counterLocation)
  await writeFileJSON(counterLocation, { count: 0, time: Date.now() })
  for (let i = 0; i < 10; i++) {
    try {
      await limiter(defaults.tier, defaults.rateLimiter, 'Time')
    } catch (e) {
      i--
    }
  }
  const newCounterValue = await readFileJSON(counterLocation)
  expect(newCounterValue.count).toBeGreaterThan(9.9)
  expect(newCounterValue.count).toBeLessThanOrEqual(10)
  await writeFileJSON(counterLocation, counterCache)
})

test('Observes rate limits', async () => {
  jest.setTimeout(60000)
  const counterCache = await readFileJSON(counterLocation)
  await writeFileJSON(counterLocation, { count: 0, time: Date.now() })
  for (let i = 0; i < 20; i++) {
    await new Promise(resolve => {
      /**
       * Executes operation.
       * 
       * @private
       */
      const execute = async () => {
        try {
          await limiter(defaults.tier, defaults.rateLimiter, 'Time')
          expect((await readFileJSON(counterLocation)).count).toBeGreaterThan(0)
          expect(
            (await readFileJSON(counterLocation)).count
          ).toBeLessThanOrEqual(15)
          resolve()
        } catch (e) {
          execute()
        }
      }
      execute()
    })
  }
  await writeFileJSON(counterLocation, counterCache)
})