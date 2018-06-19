/**
 * @author Justin Collier <jpcxme@gmail.com>
 * @license MIT
 * @see {@link http://github.com/jpcx/node-kraken-api|GitHub}
 */

'use strict'

const https = require('https')
const parseNested = require('../../tools/parseNested.js')
const genRequestData = require('./genRequestData.js')
const limiter = require('../rateLimits/limiter.js')

/**
 * Handles request responses.
 *
 * @function API~Calls~handleResponse
 * @param    {Settings~Config} settings - Instance settings.
 * @param    {Object}          res      - Provides an 'on' function which emits 'data' and 'end' events while receiving data chunks from request.
 * @param    {Function}        resolve  - Operational promise resolve function.
 * @param    {Function}        onError  - Callback function for makeRequest that handles errors.
 */
const handleResponse = (settings, res, resolve, onError) => {
  let body = ''
  res.setEncoding('utf8')
  res.on('data', chunk => {
    try {
      body += chunk
      const testBody = JSON.parse(body)
      if (testBody.error && testBody.error.length > 0) {
        onError(Error(testBody.error))
      }
    } catch (e) {
      if (e.message !== 'Unexpected end of JSON input') onError(e)
    }
  })
  res.on('end', () => {
    if (res.statusCode >= 200 && res.statusCode < 300) {
      try {
        body = JSON.parse(body)
        if (settings.parse.numbers || settings.parse.dates) {
          body.result = parseNested(settings, body.result)
        }
        if (body.error && body.error.length > 0) {
          onError(Error(body.error))
        } else {
          resolve(body.result)
        }
      } catch (e) {
        onError(e)
      }
    } else {
      onError(Error(res.statusCode + ' ' + res.statusMessage))
    }
  })
}

/**
 * Makes a request to the Kraken servers.
 *
 * @function API~Calls~makeRequest
 * @param    {Settings~Config} settings - Instance settings.
 * @param    {Kraken~Method}   method   - Method being called.
 * @param    {Kraken~Options}  options  - Method-specific options.
 * @param    {Function}        resolve  - Operational promise resolve function.
 * @param    {Function}        reject   - Operational promise reject function.
 * @param    {boolean}         [triggered=false] - Whether or not makeRequest was called recursively during a call in response to a rate limit violation.
 * @param    {number}          [retryCt=0]       - Number of times makeRequest has been called recursively during a call in response to an error.
 * @returns  {Promise}         Resolves after successful operation and rejects upon general errors.
 */
const makeRequest = async (
  settings, method, options, resolve, reject, triggered = false, retryCt = 0
) => {
  let erroredOut = false
  /**
   * Error handler for call errors. Recursively calls makeRequest again if settings and conditions permit; otherwise rejects the main operational promise.
   *
   * @function API~Calls~onError
   * @param    {Error} err - Any error encountered during call.
   */
  const onError = err => {
    if (!erroredOut) {
      erroredOut = true
      if (err.message.match(/Rate limit exceeded/g) !== null) {
        if (settings.rateLimiter.minViolationRetry >= 0) {
          makeRequest(
            settings, method, options,
            resolve, reject, true, retryCt + 1
          )
        } else {
          reject()
        }
      } else if (settings.retryCt > 0 && retryCt < settings.retryCt) {
        makeRequest(
          settings, method, options, resolve, reject, false, retryCt + 1
        )
      } else {
        reject(err)
      }
    }
  }
  await limiter(settings, method, triggered)
  const reqData = genRequestData(settings, method, options)
  const req = https.request(
    reqData.options,
    res => handleResponse(settings, res, resolve, onError)
  )
  req.on('error', e => {
    req.abort()
    onError(e)
  })
  req.setTimeout(settings.timeout, () => {
    req.abort()
    onError(Error('ETIMEDOUT'))
  })
  req.write(reqData.post)
  req.end()
}

/**
 * Loads settings and returns a function which can be used to make calls to the Kraken servers.
 *
 * @module   API/Calls/loadCall
 * @param    {Settings~Config}  settings - Instance settings.
 * @returns  {API~Calls~Call}   Calling function.
 */
module.exports = settings => {
  /**
   * Executes a call to the kraken servers using closure-loaded settings.
   *
   * @function API~Calls~Call
   * @param    {Kraken~Method}  method    - Method being called.
   * @param    {Kraken~Options} [options] - Method-specific options.
   * @param    {API~Callback}   [cb]      - Callback for errors and data.
   * @returns  {(Promise|boolean)}        Promise which resolves with response data and rejects with errors (if callback is not supplied); true if callback registered successfully.
   */
  return (method, options = {}, cb) => {
    if (options instanceof Function) {
      cb = options
      options = {}
    }
    if (!(options.constructor === Object)) options = {}
    const op = new Promise(
      (resolve, reject) => {
        makeRequest(settings, method, options, resolve, reject).catch(reject)
      }
    )
    if (!(cb instanceof Function)) return op
    else {
      op.then(data => cb(null, data)).catch(e => cb(e, null))
      return true
    }
  }
}
