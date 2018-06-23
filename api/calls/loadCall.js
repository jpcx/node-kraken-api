/**
 * @author Justin Collier <jpcxme@gmail.com>
 * @license MIT
 * @see {@link http://github.com/jpcx/node-kraken-api|GitHub}
 */

'use strict'

const https = require('https')
const parseNested = require('../../tools/parseNested.js')
const alphabetizeNested = require('../../tools/alphabetizeNested.js')
const genRequestData = require('./genRequestData.js')

/**
 * Handles request responses.
 *
 * @function API~Calls~HandleResponse
 * @param    {Settings~Config} settings - Instance settings.
 * @param    {Object}          res      - Provides an 'on' function which emits 'data' and 'end' events while receiving data chunks from request.
 * @returns  {Promise}         Promise that resolves with call data or rejects with any errors.
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
  }
)

/**
 * Makes a request to the Kraken server-side API.
 *
 * @function API~Calls~MakeRequest
 * @param    {Settings~Config}  settings - Instance settings.
 * @param    {API~Calls~Params} params   - Call parameters.
 * @returns  {Promise}          Resolves after successful operation and rejects upon errors.
 */
const makeRequest = (settings, params) => new Promise(
  (resolve, reject) => {
    try {
      const reqData = genRequestData(settings, params)
      const req = https.request(
        reqData.options,
        res => handleResponse(settings, res).then(resolve).catch(reject)
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
    } catch (err) { reject(err) }
  }
)

/**
 * Processes a call queue for a given rate-limit category.
 *
 * @function API~Calls~ProcessCalls
 * @param    {Settings~Config}          settings     - Execution settings configuraiton.
 * @param    {API~RateLimits~Category}  cat          - Rate-limit category.
 * @param    {API~Calls~Thread}         thread       - Map of serialized parameters to listeners sets.
 * @param    {API~Calls~SerialRegistry} serialReg    - Map of serialized params to actual parameter data.
 * @param    {API~RateLimits~Functions} limiter      - Rate-limit handler.
 * @returns  {Promise}                  Returns a promise that resolves once all calls for a given category have completed. Rejects with operational errors.
 */
const processCalls = async (settings, cat, thread, serialReg, limiter) => {
  while (thread.size > 0) {
    for (let serial of thread.keys()) {
      const params = { ...serialReg.get(serial) }
      await limiter.attempt(cat)
      if (!thread.has(serial) || thread.get(serial).size === 0) {
        limiter.addPass(cat)
        continue
      }
      const listenersCopy = new Set([...thread.get(serial)])
      makeRequest(settings, params).then(
        data => {
          limiter.addPass(cat)
          listenersCopy.forEach(listener => listener(null, data))
        }
      ).catch(
        err => {
          if (err.message.match(/rate limit/gi)) {
            limiter.addFail(cat)
          } else limiter.addPass(cat)

          listenersCopy.forEach(listener => listener(err, null))
        }
      )
      listenersCopy.forEach(listener => thread.get(serial).delete(listener))
      if (thread.get(serial).size === 0) {
        thread.delete(serial)
        serialReg.delete(serial)
      }
    }
  }
}

/**
 * Attaches calls to state maps. Launches dequeue operation if necessary. Recursively calls itself in response to call errors, depending on {@link Settings~Config}.retryCt.
 *
 * @function API~Calls~QueueCall
 * @param    {Settings~Config}       settings    - Execution settings configuraiton.
 * @param    {API~Calls~State}       state       - Current state variables.
 * @param    {API~Calls~Arguments}   args        - Call-specific arguments.
 * @param    {API~Calls~OpListener}  opListener  - Listener error and data in order to resolve or reject the operational promise or to forward to the {@link API~Callback}.
 * @param    {API~Calls~RetryCount}  retryCt     - Number of times call has been attempted.
 */
const queueCall = (settings, state, args, opListener, retryCt = 0) => {
  const retryListener = (err, data) => {
    if (err) {
      if (settings.retryCt > retryCt) {
        queueCall(settings, state, args, opListener, ++retryCt)
      } else {
        opListener(err, null)
      }
    } else {
      opListener(null, data)
    }
  }
  const params = { method: args.method, options: { ...args.options } }
  const serial = JSON.stringify(alphabetizeNested(params))
  const cat = state.limiter.getCategory(params.method)
  state.serialReg.set(serial, params)

  let launch = false
  if (!state.catThreads.has(cat)) {
    state.catThreads.set(cat, new Map([[serial, new Set([retryListener])]]))
    launch = true
  } else if (!state.catThreads.get(cat).has(serial)) {
    state.catThreads.get(cat).set(serial, new Set([retryListener]))
  } else {
    state.catThreads.get(cat).get(serial).add(retryListener)
  }
  if (launch) {
    const thread = state.catThreads.get(cat)
    processCalls(settings, cat, thread, state.serialReg, state.limiter)
      .then(() => state.catThreads.delete(cat))
      .catch(err => retryListener(err, null))
  }
}

/**
 * Parses arguments supplied to {@link API~Calls~Call}. Reassigns callback if no options provided. Ensures valid method is supplied.
 *
 * @function API~Calls~ParseArgs
 * @param    {Settings~Config}     settings - Current settings configuration.
 * @param    {Kraken~Method}       method   - Method being called.
 * @param    {Kraken~Options}      options  - Method-specific options.
 * @param    {API~Callback}        cb       - Handles call error or data.
 * @returns  {API~Calls~Arguments} Parsed arguments.
 * @throws   {Error}               Throws 'Invalid method' if method is not found in {@link Settings~Config}.
 */
const parseArgs = (settings, method, options, cb) => {
  const isPub = method => settings.pubMethods.includes(method)
  const isPriv = method => settings.privMethods.includes(method)

  if (!isPub(method) && !isPriv(method)) throw Error('Invalid method')
  if (options instanceof Function) cb = options
  if (!options || options.constructor !== Object) options = {}

  return { method, options, cb }
}

/**
 * Loads settings and limiter instance and generates a stateful call function.
 *
 * @module  API/Calls/LoadCall
 * @param   {Settings~Config}          settings - Execution settings configuration.
 * @param   {API~RateLimits~Functions} limiter  - Limiter instance.
 * @returns {API~Calls~Call}           Stateful call function.
 */
module.exports = (settings, limiter) => {
  /**
   * Holds information essential to call operations during state.
   *
   * @typedef  API~Calls~State
   * @property {Settings~Config}          settings   - Execution settings configuration.
   * @property {API~RateLimits~Functions} limiter    - Limiter object.
   * @property {API~Calls~CatThreads}     catThreads - Category-based execution threads.
   * @property {API~Calls~SerialRegistry} serialReg  - Maps serialized params to actual params.
   */
  const state = {
    settings,
    limiter,
    catThreads: new Map(),
    serialReg: new Map()
  }

  /**
   * Makes a call to the Kraken server-side API.
   *
   * @function API~Calls~Call
   * @param    {Kraken~Method}     method    - Method being called.
   * @param    {Kraken~Options}    [options] - Method-specific options.
   * @param    {API~Callback}      [cb]      - Optional callback for error or data.
   * @returns  {(Promise|boolean)} Promise which resolves with error or data (if no callback supplied), or <code>true</code> if operation registered successfully.
   * @throws   {Error}             Throws 'Invalid method' if method is not found in {@link Settings~Config}.
   */
  return (method, options, cb) => {
    const args = parseArgs(settings, method, options, cb)

    const op = new Promise(
      (resolve, reject) => {
        const opListener = (err, data) => err ? reject(err) : resolve(data)
        queueCall(settings, state, args, opListener)
      }
    )

    if (!(cb instanceof Function)) return op
    else {
      op.then(data => cb(null, data)).catch(err => cb(err, null))
      return true
    }
  }
}
