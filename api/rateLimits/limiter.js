/**
 * @author Justin Collier <jpcxme@gmail.com>
 * @license MIT
 * @see {@link http://github.com/jpcx/node-kraken-api|GitHub}
 */

'use strict'

const readFileJSON = require('../../tools/readFileJSON.js')
const writeFileJSON = require('../../tools/writeFileJSON.js')
const ms = require('../../tools/ms.js')

/**
 * Prepares a rate-limiting promise according to the {@link Kraken~Tier}, {@link Kraken~Method}, and {@link Settings~RateLimiter}.
 *
 * @module API/RateLimits/limiter
 * @param  {Kraken~Tier}          tier        - Verification tier.
 * @param  {Settings~RateLimiter} rateLimiter - Rate limiter logic specified in settings configuration.
 * @param  {Kraken~Method}        method      - Method being called.
 */
module.exports = async (tier, rateLimiter, method) => {
  const counter = await readFileJSON('/cache/counter.json', {})
  const counterLimit = rateLimiter.getCounterLimit(tier)
  const counterIntvl = rateLimiter.getCounterIntvl(tier)
  const incrementAmt = rateLimiter.getIncrementAmt(method)
  const currentTime = Date.now()
  if (counter.count && counter.time) {
    counter.count -= (currentTime - counter.time) / counterIntvl
    if (counter.count < 0) counter.count = 0
  } else {
    counter.count = 0
  }
  counter.count += incrementAmt
  counter.time = currentTime
  let wait = 0
  if (counter.count > counterLimit) {
    wait += (counter.count - counterLimit) * counterIntvl
  }
  if (rateLimiter.limitOrderOps && rateLimiter.isOrderOp(method)) {
    if (counter.lastOTime) {
      if ((currentTime - counter.lastOTime) < 1000) {
        wait += 1000 - (currentTime - counter.lastOTime)
      }
    }
  }
  counter.count -= (wait / counterIntvl)
  counter.time += wait
  if (counter.count < 0) counter.count = 0
  await writeFileJSON('/cache/counter.json', counter)
  wait -= Date.now() - currentTime
  if (wait < 0) wait = 0
  await ms(wait)
}
