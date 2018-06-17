/**
 * @author Justin Collier <jpcxme@gmail.com>
 * @license MIT
 * @see {@link http://github.com/jpcx/node-kraken-api|GitHub}
 */

'use strict'

const ms = require('../../tools/ms.js')

/**
 * Calculates average wait time based on the current open sync requests.
 *
 * @function API~Syncing~calcAverageWait
 * @param    {API~Syncing~Info} info - Object containing runtime data.
 * @returns  {number}           Average wait time.
 */
const calcAverageWait = info => {
  let sum = 0
  let count = 0
  const inc = info.settings.rateLimiter.getIncrementAmt
  const int = info.settings.rateLimiter.getCounterIntvl
  info.open.forEach(request => {
    sum += (inc(request.method) * int(info.tier))
    count++
  })
  return sum / count
}

/**
 * Closes all requests sent to the closing set by dequeuing them and changing their state.
 *
 * @function API~Syncing~closeClosing
 * @param    {API~Syncing~Info} info - Object containing runtime data.
 */
const closeClosing = info => {
  info.closing.forEach(
    req => {
      info.open.delete(req)
      info.closing.delete(req)
      req.instance.state = 'closed'
    }
  )
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
      while (info.open.size > 0) {
        for (let req of info.open) {
          try {
            if (req.method !== req.instance.method) {
              if (
                info.settings.pubMethods.includes(req.instance.method) ||
                info.settings.privMethods.includes(req.instance.method)
              ) {
                req.method = req.instance.method
              } else {
                req.instance.method = req.method
                req.listeners.forEach(
                  cb => cb(
                    Error(`Invalid method set. Reverted to ${req.method}`),
                    null,
                    req.instance
                  )
                )
              }
            }
            const data = await info.call(req.method, req.options)
            Object.keys(req.data).forEach(key => delete req.data[key])
            Object.keys(data).forEach(key => (req.data[key] = data[key]))
            req.instance.state = 'open'
            req.instance.time = Date.now()
            req.listeners.forEach(
              cb => cb(null, req.instance.data, req.instance)
            )
          } catch (err) {
            req.listeners.forEach(cb => cb(Error(err), null, req.instance))
          }
          closeClosing(info)
          await ms(calcAverageWait(info))
          closeClosing(info)
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
    open: new Set(),
    closing: new Set()
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
    const instance = { state: 'init', method }

    /**
     * Internal sync instance data.
     *
     * @typedef  {Object}               API~Syncing~Request
     * @property {API~Syncing~State}    state    - Current state of the request.
     * @property {Kraken~Method}        method   - Current Kraken method.
     * @property {Kraken~Options}       options  - Method-specific options.
     * @property {API~Syncing~Instance} instance - Instance being tracked.
     * @property {Set<API~Syncing~EventListener>} listeners - Set of all associated event listeners.
     * @property {API~Syncing~Error[]}  errors   - Array of errors encountered during sync execution.
     */
    const request = {
      method,
      options,
      instance,
      listeners,
      data: {}
    }

    const instanceStaticTemplate = {
      options: request.options,
      data: request.data,
      /**
       * Opens the instance if closed.
       *
       * @typedef {Function} API~Syncing~open
       * @returns {boolean}  True if opened or already open.
       */
      open: () => {
        info.closing.delete(request)
        info.open.add(request)
        handleRequests(info).catch(err => {
          request.listeners.forEach(cb => { cb(err, null, instance) })
        })
        return true
      },
      /**
       * Closes the instance if opened.
       *
       * @typedef {Function} API~Syncing~close
       * @returns {boolean}  True if closed or already closed.
       */
      close: () => info.closing.add(request) && true,
      /**
       * Adds an {@link API~Syncing~EventListener} to the instance's request listeners.
       *
       * @typedef {Function} API~Syncing~addListener
       * @param   {API~Syncing~EventListener} listener - Listener function to add.
       * @returns {boolean}  True if added successfully.
       */
      addListener: listener => request.listeners.add(listener) && true,
      /**
       * Removes an {@link API~Syncing~EventListener} from the instance's request listeners.
       *
       * @typedef {Function} API~Syncing~removeListener
       * @param   {API~Syncing~EventListener} listener - Listener function to remove.
       * @returns {boolean}  True if not in the listeners set.
       */
      removeListener: listener => request.listeners.delete(listener) && true,
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
              request.listeners.delete(selfDestructListener)
              if (err) reject(err)
              else resolve(data)
            }
            request.listeners.add(selfDestructListener)
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
      }
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
