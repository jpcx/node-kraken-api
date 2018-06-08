/**
 * @author Justin Collier <jpcxme@gmail.com>
 * @license MIT
 * @see {@link http://github.com/jpcx/node-kraken-api|GitHub}
 */

'use strict'

const https = require('https')
const parseNested = require('../../tools/parseNested.js')
const genRequestData = require('./genRequestData.js')
const rateLimiter = require('../rateLimits/limiter.js')

/**
 * Handles request responses.
 *
 * @memberof API~Calls
 * @param    {Settings~Config} settings - Instance settings.
 * @param    {Object}          res      - Provides an 'on' function which emits 'data' and 'end' events while receiving data chunks from request.
 * @param    {Function}        resolve  - Operational promise resolve function.
 * @param    {Function}        reject   - Operational promise reject function.
 */
const handleResponse = (settings, res, resolve, reject) => {
  try {
    let body = ''
    res.setEncoding('utf8')
    res.on('data', chunk => {
      try {
        body += chunk
        const testBody = JSON.parse(body)
        if (testBody.error && testBody.error.length > 0) {
          reject(Error(testBody.error))
        }
      } catch (e) {
        if (e.message !== 'Unexpected end of JSON input') {
          reject(e)
        }
      }
    })
    res.on('end', () => {
      if (res.statusCode >= 200 && res.statusCode < 300) {
        try {
          body = JSON.parse(body)
          if (
            settings.parse.numbers ||
            settings.parse.dates
          ) {
            body.result = parseNested(settings.parse, body.result)
          }
          if (body.error && body.error.length > 0) {
            reject(Error(body.error))
          } else {
            resolve(body.result)
          }
        } catch (e) {
          reject(e)
        }
      } else {
        reject(Error(res.statusCode + ' ' + res.statusMessage))
      }
    })
  } catch (e) {
    reject(e)
  }
}

/**
 * Makes a request to the Kraken servers.
 *
 * @memberof API~Calls
 * @param    {Settings~Config} settings - Instance settings.
 * @param    {Kraken~Method}   method   - Method being called.
 * @param    {Kraken~Options}  options  - Method-specific options.
 * @param    {Function}        resolve  - Operational promise resolve function.
 * @param    {Function}        reject   - Operational promise reject function.
 */
const makeRequest = async (settings, method, options, resolve, reject) => {
  try {
    if (settings.rateLimiter.use) {
      await rateLimiter(settings.tier, settings.rateLimiter, method)
    }
    options.nonce = Date.now() * 1000
    settings.nonce = options.nonce
    const reqData = genRequestData(settings, method, options)
    const req = https.request(
      reqData.options,
      res => handleResponse(settings, res, resolve, reject)
    )
    req.on('error', e => {
      req.abort()
      reject(e)
    })
    req.setTimeout(settings.timeout, () => {
      req.abort()
      reject(Error('ETIMEDOUT'))
    })
    req.write(reqData.post)
    req.end()
  } catch (e) {
    reject(e)
  }
}

/**
 * Loads settings and returns a function which can be used to make calls to the Kraken servers.
 *
 * @module   API/Calls/loadCall
 * @param    {Settings~Config}  settings - Instance settings.
 * @returns  {API~Calls~Call} Calling function.
 */
module.exports = settings => {
  /**
   * Executes a call to the kraken servers using closure-loaded settings.
   *
   * @function API~Calls~Call
   * @param    {Kraken~Method}  method    - Method being called.
   * @param    {Kraken~Options} [options] - Method-specific options.
   * @param    {API~Callback}   [cb]      - Callback for errors and data.
   * @returns  {(Promise|undefined)}      Promise which resolves with response data and rejects with errors (if callback is not supplied).
   */
  return (method, options = {}, cb) => {
    if (options instanceof Function) {
      cb = options
      options = {}
    }
    const op = new Promise(
      (resolve, reject) => makeRequest(
        settings, method, options, resolve, reject
      )
    )
    if (!(cb instanceof Function)) return op
    else op.then(data => cb(null, data)).catch(e => cb(e, null))
  }
}
