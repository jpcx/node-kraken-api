/**
 * @author Justin Collier <jpcxme@gmail.com>
 * @license MIT
 * @see {@link http://github.com/jpcx/node-kraken-api|GitHub}
 */

'use strict'

const parseSettings = require('./settings/parseSettings.js')
const loadCall = require('./api/calls/loadCall.js')
const loadSync = require('./api/syncing/loadSync.js')
const loadLimiter = require('./api/rateLimits/loadLimiter.js')

/**
 * Provides an interface to the Kraken cryptocurrency exchange.
 *
 * @module  node-kraken-api
 * @param   {Settings~Config} settings - User-defined settings.
 * @returns {API~Functions}   Object with methods for interacting with the API.
 * @throws  {(TypeError|RangeError)} Throws an error if a setting is not of an acceptable type or range.
 */
module.exports = (settings = {}) => {
  settings = parseSettings(settings)
  Object.freeze(settings)
  const limiter = loadLimiter(settings)
  const call = loadCall(settings, limiter)
  const sync = loadSync(settings, limiter, call)
  return { call, sync }
}
