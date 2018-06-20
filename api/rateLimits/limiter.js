/**
 * @author Justin Collier <jpcxme@gmail.com>
 * @license MIT
 * @see {@link http://github.com/jpcx/node-kraken-api|GitHub}
 */

'use strict'

const crypto = require('crypto')
const readFileJSON = require('../../tools/readFileJSON.js')
const writeFileJSON = require('../../tools/writeFileJSON.js')
const ms = require('../../tools/ms.js')

/**
 * Gets a reference to the key-specific counter object and creates it if not available.
 *
 * @function API~RateLimits~getPrivateRef
 * @param    {Settings~Config}        settings - Current settings configuration.
 * @param    {API~RateLimits~Counter} counter  - Counter object.
 * @returns  {Object} Reference to nested object within counter containing rate-limit information for the current configured key.
 */
const getPrivateLoc = (settings, counter) => {
  const key = settings.key
  const hash = crypto.createHash('sha256').update(key).digest('hex')
  if (!(counter.private instanceof Object)) counter.private = {}
  if (!(counter.private[hash] instanceof Object)) counter.private[hash] = {}
  return counter.private[hash]
}

/**
 * Calculates the wait required for a private method.
 *
 * @function API~RateLimits~calcPrivateWait
 * @param    {API~RateLimits~KeyHashCounter} loc   - Reference to key-specific counter object.
 * @param    {API~RateLimits~CounterInfo}    cInfo - Information pertaining to counter behavior.
 * @param    {number} currentTime - Time of limiter operation.
 * @returns  {number} Time to wait.
 */
const calcPrivateWait = (loc, cInfo, currentTime) => {
  if (loc.count && loc.time) {
    loc.count -= (currentTime - loc.time) / cInfo.intvl
    if (loc.count < 0) loc.count = 0
  } else {
    loc.count = 0
  }
  loc.count += cInfo.incAmt
  loc.time = currentTime
  if (loc.count > cInfo.limit) return (loc.count - cInfo.limit) * cInfo.intvl
  else return 0
}

/**
 * Calculates the wait required for an order method.
 *
 * @function API~RateLimits~calcOrderWait
 * @param    {Settings~Config} settings - Current settings configuration.
 * @param    {API~RateLimits~KeyHashCounter} loc - Reference to key-specific counter object.
 * @param    {number} currentTime - Time of limiter operation.
 * @returns  {number} Time to wait.
 */
const calcOrderWait = (settings, loc, currentTime) => {
  if (
    !isNaN(loc.lastOTime) &&
    (currentTime - loc.lastOTime) < settings.rateLimiter.minOrderFrequency
  ) {
    let oWait = currentTime - loc.lastOTime
    if (oWait < 0) oWait = 0
    return settings.rateLimiter.minOrderFrequency - oWait
  } else {
    loc.lastOTime = currentTime
    return 0
  }
}

/**
 * Adjusts the counter object in response to the current calculated wait time and counter interval.
 *
 * @function API~RateLimits~adjustPrivateCount
 * @param    {API~RateLimits~KeyHashCounter} loc   - Reference to key-specific counter object.
 * @param    {API~RateLimits~CounterInfo}    cInfo - Information pertaining to counter behavior.
 * @param    {number} wait - Current summed time to wait.
 */
const adjustPrivateCount = (loc, cInfo, wait) => {
  loc.count -= (wait / cInfo.intvl)
  if (loc.count < 0) loc.count = 0
  loc.time += wait
}

const calcPrivateViolationWait = (settings, violated, loc, currentTime) => {
  if (
    !loc.hasOwnProperty('violations') ||
    loc.violations.constructor !== Array
  ) {
    loc.violations = []
  }
  loc.violations = loc.violations.filter(t => t > currentTime - 60000)
  if (violated) {
    loc.violations.push(currentTime)
    return (
      settings.rateLimiter.minViolationRetry *
      (1 + (0.1 * loc.violations.length))
    )
  }
  return 0
}

/**
 * Creates a promise which resolves in response to call frequency and rate limits for private calls. Stores data to disk under './cache/counter.json'.
 *
 * @function API~RateLimits~waitPrivate
 * @param    {Settings~Config} settings  - Current settings configuration.
 * @param    {Kraken~Method}   method    - Current method being called.
 * @param    {boolean}         triggered - Whether or not limiter was called automatically after a rate limit violation.
 * @returns  {Promise} - Resolves after waiting has completed; rejects with any internal errors.
 */
const waitPrivate = async (settings, method, violated) => {
  const counter = await readFileJSON('/cache/counter.json', {})
  const loc = getPrivateLoc(settings, counter)
  const cInfo = {
    limit: settings.rateLimiter.getCounterLimit(settings.tier),
    intvl: settings.rateLimiter.getCounterIntvl(settings.tier),
    incAmt: settings.rateLimiter.getIncrementAmt(method)
  }
  const currentTime = Date.now()
  let wait = 0
  wait += calcPrivateWait(loc, cInfo, currentTime)
  if (
    settings.orderMethods.includes(method) &&
    settings.rateLimiter.minOrderFrequency > 0
  ) {
    wait += calcOrderWait(settings, loc, currentTime)
  }
  adjustPrivateCount(loc, cInfo, wait)
  wait += calcPrivateViolationWait(settings, violated, loc, currentTime)
  await writeFileJSON('/cache/counter.json', counter)
  wait -= Date.now() - currentTime
  if (wait < 0) wait = 0
  await ms(wait)
}

/**
 * Calculates the time to wait for a public call retry in response to rate limit violations. As the public call frequency is not well documented by Kraken, the amount to wait is calculated dynamically in response to violations. Minimum wait time in response to violations is determined by the information listed on this support page: {@link https://support.kraken.com/hc/en-us/articles/206548367-What-is-the-API-call-rate-limit-}
 *
 * @function API~RateLimits~calcPublicWait
 * @param    {Settings~Config} settings  - Current settings configuration.
 * @param    {boolean}         triggered - Whether or not the most recent response was a rate limit violation.
 * @param    {API~RateLimits~Counter}    counter - Counter object.
 * @param    {('trades'|'ohlc'|'other')} type    - Type of method; 'trades' for 'Trades', 'ohlc' for 'OHLC', and 'other' for anything else.
 * @returns  {number} Time to wait.
 */
const calcPublicWait = (settings, violated, counter, type) => {
  const currentTime = Date.now()
  if (
    !counter.public.hasOwnProperty(type) ||
    !(counter.public[type].constructor === Object)
  ) {
    counter.public[type] = {}
  }

  const loc = counter.public[type]

  if (
    !loc.hasOwnProperty('last') ||
    !loc.hasOwnProperty('freq') ||
    loc.last < currentTime - 60000
  ) {
    loc.last = currentTime
    loc.freq = 0
  }

  if (
    !loc.hasOwnProperty('violations') ||
    loc.violations.constructor !== Array
  ) {
    loc.violations = []
  }

  loc.violations = loc.violations.filter(t => t > currentTime - 60000)

  const elapsed = currentTime - loc.last

  if (violated) {
    loc.violations.push(currentTime)
    if (!loc.freq) loc.freq = elapsed
    else loc.freq *= 1 + (0.05 * (loc.violations.length))
  } else {
    loc.freq *= 0.99
  }

  loc.last = currentTime

  let wait = violated ? settings.rateLimiter.minViolationRetry : loc.freq

  wait -= elapsed
  if (wait < 0) wait = 0

  return wait
}
/**
 * Creates a promise which resolves in response to call frequency and rate limits for private calls. Stores data to disk under './cache/counter.json'.
 *
 * @function API~RateLimits~waitPublic
 * @param    {Settings~Config} settings  - Current settings configuration.
 * @param    {Kraken~Method}   method    - Current Kraken method.
 * @param    {boolean}         violated  - Whether or not the most recent response was a rate limit violation.
 * @returns  {Promise} Resolves when waiting has completed.
 */
const waitPublic = async (settings, method, violated) => {
  const counter = await readFileJSON('/cache/counter.json', {})
  if (!counter.public) counter.public = {}
  let wait = 0
  const currentTime = Date.now()
  if (method === 'Trades') {
    wait += calcPublicWait(settings, violated, counter, 'trades')
  } else if (method === 'OHLC') {
    wait += calcPublicWait(settings, violated, counter, 'ohlc')
  } else {
    wait += calcPublicWait(settings, violated, counter, 'other')
  }
  await writeFileJSON('/cache/counter.json', counter)
  wait -= Date.now() - currentTime
  if (wait < 0) wait = 0
  await ms(wait)
}

/**
 * Prepares a rate-limiting promise according to the {@link Kraken~Tier}, {@link Kraken~Method}, and {@link Settings~RateLimiter}.
 *
 * @module  API/RateLimits/limiter
 * @param   {Settings~Config} settings  - Current execution settings.
 * @param   {Kraken~Method}   method    - Method being called.
 * @param   {boolean}         violated  - Whether or not the immediately preceeding call response was a rate-limit violation.
 * @returns {Promise} Resolves after adequate wait time (or immediately).
 */
module.exports = (settings, method, violated = false) => new Promise(
  (resolve, reject) => {
    if (settings.pubMethods.includes(method)) {
      if (settings.rateLimiter.public) {
        waitPublic(settings, method, violated)
          .then(resolve)
          .catch(reject)
      } else { resolve() }
    } else {
      if (settings.rateLimiter.private) {
        waitPrivate(settings, method, violated)
          .then(resolve)
          .catch(reject)
      } else { resolve() }
    }
  }
)
