/**
 * @author Justin Collier <jpcxme@gmail.com>
 * @license MIT
 * @see {@link http://github.com/jpcx/node-kraken-api|GitHub}
 */

'use strict'

const defaults = require('./settings/defaults.js')
const loadCall = require('./api/calls/loadCall.js')
const loadSchedule = require('./api/schedules/loadSchedule.js')

/**
 * Provides an interface to the Kraken cryptocurrency exchange.
 *
 * @module  node-kraken-api
 * @param   {Settings~Config} settings - User-defined settings.
 * @returns {API~Functions}   Object with methods for interacting with the API.
 */
module.exports = (settings = {}) => {
  settings = { ...defaults, ...settings }
  const call = loadCall(settings)
  const schedule = loadSchedule(settings.tier, settings.rateLimiter, call)
  return { call, schedule }
}
