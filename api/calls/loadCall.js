/**
 * @author Justin Collier <jpcxme@gmail.com>
 * @license MIT
 * @see {@link http://github.com/jpcx/node-kraken-api|GitHub}
 */

'use strict'

const https = require('https')
const parseNested = require('../../tools/parseNested.js')
const normalize = require('../../tools/normalize.js')
const ms = require('../../tools/ms.js')
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
const handleResponse = (settings, res) => new Promise(
  (resolve, reject) => {
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
        if (e.message !== 'Unexpected end of JSON input') reject(e)
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
  }
)

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
const makeRequest = (
  settings, params, violated = false, retryCt = 0
) => (
  new Promise((resolve, reject) => {
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
        if (typeof err === 'string') err = Error(err)
        if (err.message.match(/Rate limit exceeded/g) !== null) {
          if (settings.rateLimiter.minViolationRetry >= 0) {
            resolve(makeRequest(settings, params, true, retryCt + 1))
          } else {
            reject(err)
          }
        } else if (
          settings.retryCt > 0 &&
          retryCt < settings.retryCt
        ) {
          resolve(makeRequest(settings, params, false, retryCt + 1))
        } else {
          reject(err)
        }
      }
    }
    limiter(settings, params.method, violated).then(
      () => {
        const reqData = genRequestData(settings, params)
        const req = https.request(
          reqData.options,
          res => handleResponse(settings, res).then(resolve).catch(onError)
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
    ).catch(onError)
  })
)

const execute = async (state) => {
  while (state.listeners.size > 0) {
    for (let entry of state.listeners) {
      const serialParams = entry[0]
      const params = state.params.get(serialParams).params
      const callbacks = new Set([...entry[1]])
      makeRequest(state.settings, params)
        .then(data => { callbacks.forEach(cb => cb(null, data)) })
        .catch(err => { callbacks.forEach(cb => cb(err, null)) })
      callbacks.forEach(cb => {
        state.listeners.get(serialParams).delete(cb)
        if (state.listeners.get(serialParams).size === 0) {
          state.listeners.delete(serialParams)
        }
        if (--state.params.get(serialParams).count === 0) {
          state.params.delete(serialParams)
        }
      })
    }
  }
}

/**
 * Loads settings and returns a function which can be used to make calls to the Kraken servers.
 *
 * @module   API/Calls/loadCall
 * @param    {Settings~Config}  settings - Instance settings.
 * @returns  {API~Calls~Call}   Calling function.
 */
module.exports = settings => {
  const state = {
    settings,
    params: new Map(),
    listeners: new Map(),
    gates: new Set()
  }
  /**
   * Executes a call to the kraken servers using closure-loaded settings.
   *
   * @function API~Calls~Call
   * @param    {Kraken~Method}  method    - Method being called.
   * @param    {Kraken~Options} [options] - Method-specific options.
   * @param    {API~Callback}   [cb]      - Callback for errors and data.
   * @returns  {(Promise|boolean)}        Promise which resolves with response data and rejects with errors (if callback is not supplied); true if callback registered successfully.
   * @throws   Throws 'Invalid method' if method is not found within the valid method arrays.
   */
  return (method, options = {}, cb) => {
    if (
      !settings.pubMethods.includes(method) &&
      !settings.privMethods.includes(method)
    ) {
      throw Error('Invalid method')
    }

    if (options instanceof Function) {
      cb = options
      options = {}
    }

    if (options.constructor !== Object) options = {}

    const params = { method, options: { ...options } }
    const serialParams = JSON.stringify(normalize(params))

    if (!state.params.has(serialParams)) {
      state.params.set(serialParams, { params, count: 1 })
    } else {
      state.params.get(serialParams).count++
    }

    const op = new Promise(
      (resolve, reject) => {
        const listener = (err, data) => {
          if (err) reject(err)
          else resolve(data)
        }

        if (!state.listeners.has(serialParams)) {
          state.listeners.set(serialParams, new Set([listener]))
        } else {
          state.listeners.get(serialParams).add(listener)
        }

        if (!state.gates.has('executing')) {
          state.gates.add('executing')
          execute(state)
            .then(() => state.gates.delete('executing'))
            .catch(listener)
        }
      }
    )

    if (!(cb instanceof Function)) return op
    else {
      op.then(data => cb(null, data)).catch(err => cb(err, null))
      return true
    }
  }
}
