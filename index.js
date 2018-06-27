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
  const limiter = loadLimiter(settings)
  const call = loadCall(settings, limiter)
  const sync = loadSync(settings, limiter, call)

  /**
   * Sets a new two-factor password to the execution settings
   *
   * @function API~SetOTP
   * @param    {Kraken~OTP} otp - New two-factor password.
   * @returns  {boolean}    True if successful.
   * @throws   {TypeError}  Throws a TypeError if otp is a not string or a number.
   */
  const setOTP = otp => {
    if (!isNaN(otp) || typeof otp === 'string') {
      settings.otp = otp
      return true
    } else {
      throw TypeError('OTP must be either string or number.')
    }
  }

  /**
   * Sets a new timeout to the execution settings
   *
   * @function API~SetTimeout
   * @param    {API~Calls~Timeout}      timeout - New timeout.
   * @returns  {boolean}                True if successful.
   * @throws   {(TypeError|RangeError)} Throws a TypeError if timeout is a not equivalent to a number; throws a RangeError if timeout is not greater than 0.
   */
  const setTO = timeout => {
    if (!isNaN(timeout)) {
      if (timeout > 0) {
        settings.timeout = timeout
        return true
      } else {
        throw RangeError('Timeout must be greater than zero.')
      }
    } else {
      throw TypeError('Timeout must be a number.')
    }
  }

  /**
   * Sets a new RetryCount to the execution settings
   *
   * @function API~SetRetryCt
   * @param    {API~Calls~RetryCount}   retryCt - New retryCt.
   * @returns  {boolean}                True if successful.
   * @throws   {(TypeError|RangeError)} Throws a TypeError if retryCt is a not equivalent to a number; throws a RangeError if retryCt is not >= 0.
   */
  const setRetryCt = retryCt => {
    if (!isNaN(retryCt)) {
      if (retryCt >= 0) {
        settings.retryCt = retryCt
        return true
      } else {
        throw RangeError('RetryCt must be zero or above.')
      }
    } else {
      throw TypeError('RetryCt must be a number.')
    }
  }

  /**
   * Sets new limiter settings to the execution settings
   *
   * @function API~SetLimiter
   * @param    {Settings~RateLimiter}   limiter - New limiter settings.
   * @returns  {boolean}                True if successful.
   * @throws   {(TypeError|RangeError)} Throws a TypeError if limiter does not match specifications; throws a RangeError if settings are not >= 0.
   */
  const setLimiter = limiter => {
    if (
      limiter.constructor === Object &&
      (
        (
          limiter.hasOwnProperty('baseIntvl') &&
          !isNaN(limiter.baseIntvl)
        ) ||
        (
          limiter.hasOwnProperty('minIntvl') &&
          !isNaN(limiter.minIntvl)
        )
      )
    ) {
      let pass = false
      if (limiter.hasOwnProperty('baseIntvl') && limiter.baseIntvl >= 0) {
        settings.limiter.baseIntvl = limiter.baseIntvl
        pass = true
      }
      if (limiter.hasOwnProperty('minIntvl') && limiter.minIntvl >= 0) {
        settings.limiter.minIntvl = limiter.minIntvl
        pass = true
      }
      if (!pass) {
        throw RangeError('Limiter properties must be zero or above.')
      } else {
        return true
      }
    } else {
      throw TypeError(
        'Limiter must be an object with correct numerical properties. ' +
        'See documentation.'
      )
    }
  }

  /**
   * Provides functions which can be used to interact with the API.
   *
   * @typedef  {Object}           API~Functions
   * @property {API~Calls~Call}   call - Call a single method.
   * @property {API~Syncing~Sync} sync - Create a sync instance.
   * @property {API~SetOTP}       setOTP - Sets new two-factor password.
   * @property {API~SetTimeout}   setTimeout - Sets a new timeout.
   * @property {API~SetRetryCt}   setRetryCt - Sets a new retryCt.
   * @property {API~SetLimiter}   setLimiter - Sets new limiter settings.
   */
  const functions = {
    call,
    sync,
    setOTP,
    setTimeout: setTO,
    setRetryCt,
    setLimiter
  }
  Object.freeze(functions)

  return functions
}
