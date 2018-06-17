/**
 * @author Justin Collier <jpcxme@gmail.com>
 * @license MIT
 * @see {@link http://github.com/jpcx/node-kraken-api|GitHub}
 */

'use strict'

const ms = require('../../tools/ms.js')
const normalize = require('../../tools/normalize.js')

/**
 * Calculates average wait time based on the current open sync requests.
 *
 * @function API~Syncing~calcAverageWait
 * @param    {API~Syncing~Info} info - Object containing runtime data.
 * @returns  {number}           Average wait time.
 */
const calcAverageWait = (info, starttm) => {
  let sum = 0
  let count = 0
  const inc = info.settings.rateLimiter.getIncrementAmt
  const int = info.settings.rateLimiter.getCounterIntvl
  for (let req of info.requests) {
    // console.log('debug: caa req[0]: ' + req[0])
    const params = JSON.parse(req[0])
    sum += (inc(params.method) * int(info.tier))
    count++
  }
  let wait = (sum / count) - (Date.now() - starttm)
  if (wait <= 0) wait = 0
  return wait
}

const verifyParams = (info, req) => {
  for (let intl of req[1]) {
    // handle all internals associated with params
    let params = normalize({
      method: intl.instance.method,
      options: intl.instance.options
    })
    if (intl.state === 'closed') {
      // instance has been closed with the close() function
      intl.instance.state = 'closed'
      info.requests.get(req[0]).delete(intl)
      if (info.requests.get(req[0]).size === 0) {
        info.requests.delete(req[0])
      }
    } else if (JSON.stringify(params) !== req[0]) {
      // method and/or options have been changed via the instance
      let changed = true
      if (params.method !== intl.params.method) {
        // method has been changed
        if (
          info.settings.pubMethods.includes(params.method) ||
          info.settings.privMethods.includes(params.method)
        ) {
          // method is valid
          intl.params.method = params.method
        } else {
          // if method is invalid
          // notify listeners
          intl.listeners.forEach(cb => cb(Error(
            `Invalid method ${params.method}. Reverting.`
          ), null, intl.instance))
          // revert
          params.method = intl.params.method
          intl.instance.method = params.method
          params = normalize(params)
          // check for further changes
          if (JSON.stringify(params) === req[0]) changed = false
        }
      } else if (params.options.constructor !== Object) {
        // options have changed and are invalid
        // notify listeners
        intl.listeners.forEach(cb => cb(Error(
          `Invalid options ${params.options}. Must be Object. Reverting.`
        ), null, intl.instance))
        // revert
        params.options = JSON.parse(req[0]).options
        intl.params.options = params.options
        intl.instance.options = params.options
        params = normalize(params)
        changed = false
      }

      if (changed) {
        // re-assign internal
        const serialParams = JSON.stringify(params)
        if (!info.requests.has(serialParams)) {
          info.requests.set(serialParams, new Set([intl]))
        } else {
          info.requests.get(serialParams).add(intl)
        }
        info.requests.get(req[0]).delete(intl)
        if (info.requests.get(req[0]).size === 0) {
          info.requests.delete(req[0])
        }
      }
    }
  }
}

/**
 * Handles request queue and sends data to associated {@link API~Syncing~EventListener}s.
 *
 * @function API~Syncing~handleRequests
 * @param    {API~Syncing~Info} info - Object containing runtime data.
 * @returns  {Promise}          Promise which resolves when there are no more requests to process and rejects when an error has been thrown.
 * @throws   Will throw any error which does not result directly from a call.
 */
const handleRequests = async (info) => {
  try {
    if (!info.requesting) {
      info.requesting = true
      while (info.requests.size > 0) {
        // loop continuously
        for (let req of info.requests) {
          // console.log('debug: LOOPING')
          // handle all param sets
          const starttm = Date.now()
          verifyParams(info, req)
          if (info.requests.has(req[0])) {
            // console.log('debug: REACHED HAS')
            // console.log('debug: req[0]: ' + req[0])
            const params = JSON.parse(req[0])
            const data = await info.call(params.method, params.options)
            for (let intl of req[1]) {
              if (intl.state === 'init') intl.state = 'open'
              intl.instance.state = 'open'
              Object.keys(intl.data).forEach(key => delete intl.data[key])
              Object.keys(data).forEach(key => (intl.data[key] = data[key]))
              intl.time = Date.now()
              intl.listeners.forEach(cb => cb(null, data, intl.instance))
            }
            // console.log('debug: WAIT: ' + calcAverageWait(info, starttm))
            await ms(calcAverageWait(info, starttm))
          }
        }
      }
      info.requesting = false
    }
  } catch (err) { throw err }
}

/**
 * Creates a sync instance creator by loading relevant information into a closure.
 *
 * @module  API/Syncing/loadSync
 * @param   {Settings~Config}      settings - Settings configuration.
 * @param   {API~Calls~Call}       call        - Stateful call function.
 * @returns {API~Syncing~Sync}     Function which creates sync instances.
 */
module.exports = (settings, call) => {
  /**
   * Contains runtime information to be passed around within sync operations.
   *
   * @typedef  {Object} API~Syncing~Info
   * @property {Kraken~Tier}          tier        - Kraken verification tier.
   * @property {Settings~RateLimiter} rateLimiter - RateLimiter configuration.
   * @property {API~Calls~Call}       call        - Stateful call function.
   * @property {boolean}              requesting  - Whether or not a queue processing operation is in progress.
   * @property {API~Syncing~OpenRequests}    open    - Set of all open requests.
   * @property {API~Syncing~ClosingRequests} closing - Set of all requests which should be closed.
   */
  const info = {
    settings,
    call,
    requesting: false,
    requests: new Map()
  }
  /**
   * Stateful function which creates sync instances.
   *
   * @function API~Syncing~Sync
   * @param    {Kraken~Method}             method       - Method being called.
   * @param    {Kraken~Options}            [options={}] - Method-specific options.
   * @param    {API~Syncing~EventListener} [listener]   - Listener for error and data events.
   * @returns  {API~Syncing~Instance} Instance of sync operation.
   */
  return (method, options = {}, listener) => {
    if (options instanceof Function) {
      listener = options
      options = {}
    }

    const listeners = new Set()

    if (listener instanceof Function) listeners.add(listener)

    /**
     * Sync instance used for behavior manipulation and data retrieval.
     *
     * @typedef  {Object}                   API~Syncing~Instance
     * @property {API~Syncing~InstanceData} data     - Defaults to Object that stores direct data from calls but may be reassigned within an {@link API~Syncing~EventListener} or otherwise.
     * @property {number}                   time     - Time (in ms) since last successful {@link API~Syncing~InstanceData} update.
     * @property {Kraken~Options}           options  - Current method-specific options.
     * @property {API~Syncing~Error[]}      errors   - Array of errors encountered during sync execution.
     * @property {API~Syncing~getState}     getState - Gets the current request state.
     * @property {API~Syncing~getMethod}    getMethod - Gets the current {@link Kraken~Method}.
     * @property {API~Syncing~setMethod}    setMethod - Sets a new {@link Kraken~Method}.
     * @property {API~Syncing~open}         open       - Opens the instance if closed.
     * @property {API~Syncing~close}        close      - Closes the instance if open.
     * @property {API~Syncing~addListener}  addListener - Adds a new {@link API~Syncing~EventListener} to the request.
     * @property {API~Syncing~removeListener} removeListener - Removes a {@link API~Syncing~EventListener} from the request.
     * @property {API~Syncing~once}           once           - Adds a one-time {@link API~Syncing~EventListener} if provided; otherwise returns a promise which resolves/rejects on the next error/data event.
     */
    const instance = { state: 'init', method, options }

    /**
     * Internal sync instance data.
     *
     * @typedef  {Object}               API~Syncing~Internal
     * @property {API~Syncing~State}    state    - Current state of the request.
     * @property {Kraken~Method}        method   - Current Kraken method.
     * @property {Kraken~Options}       options  - Method-specific options.
     * @property {API~Syncing~Instance} instance - Instance being tracked.
     * @property {Set<API~Syncing~EventListener>} listeners - Set of all associated event listeners.
     * @property {API~Syncing~Error[]}  errors   - Array of errors encountered during sync execution.
     */
    const internal = {
      state: 'init',
      params: {
        method,
        options
      },
      instance,
      listeners,
      data: {}
    }

    const instanceStaticTemplate = {
      data: internal.data,
      /**
       * Opens the instance if closed.
       *
       * @typedef {Function} API~Syncing~open
       * @returns {boolean}  True if opened or already open.
       */
      open: () => {
        const serialParams = JSON.stringify(normalize(internal.params))
        if (!info.requests.has(serialParams)) {
          info.requests.set(serialParams, new Set([internal]))
        } else {
          info.requests.get(serialParams).add(internal)
        }
        internal.state = 'open'
        handleRequests(info).catch(err => {
          internal.listeners.forEach(cb => { cb(err, null, instance) })
        })
        return true
      },
      /**
       * Closes the instance if opened.
       *
       * @typedef {Function} API~Syncing~close
       * @returns {boolean}  True if closed or already closed.
       */
      close: () => (internal.state = 'closed') && true,
      /**
       * Adds an {@link API~Syncing~EventListener} to the instance's request listeners.
       *
       * @typedef {Function} API~Syncing~addListener
       * @param   {API~Syncing~EventListener} listener - Listener function to add.
       * @returns {boolean}  True if added successfully.
       */
      addListener: listener => internal.listeners.add(listener) && true,
      /**
       * Removes an {@link API~Syncing~EventListener} from the instance's request listeners.
       *
       * @typedef {Function} API~Syncing~removeListener
       * @param   {API~Syncing~EventListener} listener - Listener function to remove.
       * @returns {boolean}  True if not in the listeners set.
       */
      removeListener: listener => internal.listeners.delete(listener) && true,
      /**
       * Adds a one-time {@link API~Syncing~EventListener} to the instance's request listeners. If no listener is provided as a parameter, returns a promise which resolves with the next update's error or data.
       *
       * @typedef {Function} API~Syncing~once
       * @param   {API~Syncing~EventListener} [listener] - Once listener function to add.
       * @returns {(boolean|Promise)} Returns true if added successfully or a promise if a listener function is not provided.
       */
      once: onceListener => {
        const opPromise = new Promise(
          (resolve, reject) => {
            let selfDestructListener
            selfDestructListener = (err, data) => {
              internal.listeners.delete(selfDestructListener)
              if (err) reject(err)
              else resolve(data)
            }
            internal.listeners.add(selfDestructListener)
          }
        )
        if (onceListener instanceof Function) {
          opPromise
            .then(data => onceListener(null, instance.data, instance))
            .catch(err => onceListener(err, null, instance))
          return true
        } else {
          return opPromise
        }
      },
      debug: { info }
    }

    for (let prop in instanceStaticTemplate) {
      Object.defineProperty(instance, prop, {
        value: instanceStaticTemplate[prop],
        writable: false,
        enumerable: true,
        configurable: false
      })
    }

    instance.open()

    return instance
  }
}
