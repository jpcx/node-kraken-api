/**
 * @author Justin Collier <jpcxme@gmail.com>
 * @license MIT
 * @see {@link http://github.com/jpcx/node-kraken-api|GitHub}
 */

'use strict'

const ms = require('../../tools/ms.js')

/**
 * Calculates average wait time.
 *
 * @memberof API~Syncing
 * @param    {API~Syncing~Info} info - Object containing runtime data.
 * @returns  {number}           Average wait time.
 */
const calcAverageWait = info => {
  let sum = 0
  let count = 0
  for (let request of info.requests) {
    sum += (
      info.rateLimiter.getIncrementAmt(request[1].method) *
      info.rateLimiter.getCounterIntvl(info.tier)
    )
    count++
  }
  return sum / count
}

/**
 * Handles request queue and sends data to associated callbacks.
 *
 * @memberof API~Syncing
 * @param    {API~Syncing~Info} info - Object containing runtime data.
 * @returns  {Promise}          Promise which resolves when there are no more requests to process and rejects when an error has been thrown.
 */
const handleRequests = async info => {
  let lastID
  try {
    if (!info.requesting) {
      info.requesting = true
      let position = 0
      const requests = info.requests
      const listeners = info.listeners
      while (requests.size > 0) {
        if (position >= requests.size) position = 0
        const request = [...requests][position][1]
        const id = [...requests][position++][0]
        lastID = id
        const instance = request.instance
        try {
          instance.data = await info.call(request.method, request.options)
          instance.time = Date.now()
          if (request.hasOwnProperty('initResolve')) {
            request.initResolve(instance.data)
            delete request.initResolve
            delete request.initReject
          }
          if (listeners.has(id)) {
            listeners.get(id).forEach(
              cb => cb(null, instance.data, 'data')
            )
          }
        } catch (e) {
          const err = Error(e)
          err.time = Date.now()
          instance.errors.push(err)
          if (request.hasOwnProperty('initReject')) {
            request.initReject(err)
            delete request.initResolve
            delete request.initReject
          }
          if (listeners.has(id)) {
            listeners.get(id).forEach(cb => cb(err, null, 'error'))
          }
        }
        await ms(calcAverageWait(info))
        if (
          !requests.has(id) &&
          listeners.has(id)
        ) {
          listeners.get(id).forEach(cb => cb(null, null, 'close'))
        }
      }
      info.requesting = false
      for (let entry of listeners) {
        if (entry[1].size > 0) {
          entry[1].forEach(cb => cb(null, null, 'close'))
        }
      }
    }
  } catch (e) {
    e.lastID = lastID
    throw e
  }
}

/**
 * Loads settings and call function and returns syncing operation functions.
 *
 * @module  API/Syncing/loadSync
 * @param   {Kraken~Tier}            tier        - Kraken verification tier.
 * @param   {Settings~RateLimiter}   rateLimiter - Rate limiter logic defined in {@link Settings~Config}.
 * @param   {API~Calls~Call}         call        - Call function.
 * @returns {API~Syncing~Sync}       Provides syncing operation functions.
 */
module.exports = (tier, rateLimiter, call) => {
  /**
   * Contains instance information used during sync process.
   *
   * @typedef  {Object} API~Syncing~Info
   * @param    {Kraken~Tier}          tier        - Kraken verification tier.
   * @param    {Settings~RateLimiter} rateLimiter - Rate limiter logic defined in {@link Settings~Config}.
   * @property {API~Calls~Call}       call        - Call function.
   * @property {API~Syncing~Requests} requests    - Maps API~Syncing~ID to request parameters.
   * @property {API~Syncing~ID}       id          - Incrementing ID used for sync assignment.
   * @property {boolean}              requesting  - Whether or not there are currently active schedule operations.
   * @property {API~Syncing~EventListeners} listeners - Event listeners for sync instances.
   */
  const info = {
    tier,
    rateLimiter,
    call,
    requests: new Map(),
    id: 0,
    requesting: false,
    listeners: new Map()
  }

  /**
   * Creates a sync instance.
   *
   * @typedef  {Function}                  API~Syncing~Sync
   * @param    {Kraken~Method}             method     - Kraken method to sync.
   * @param    {Kraken~Options}            [options]  - Method-specific options.
   * @param    {API~Syncing~EventListener} [listener] - Callback for instance-specific events.
   * @returns  {API~Syncing~Instance}      Sync instance that holds data and manipulation functions.
   */
  return (method, options, listener) => {
    if (options instanceof Function) {
      listener = options
      options = {}
    }

    let id = info.id++

    if (listener instanceof Function) {
      info.listeners.set(id, new Set([listener]))
    }

    let instance
    let initResolve, initReject

    /**
     * Instance of sync operation.
     *
     * @typedef  {Object}             API~Syncing~Instance
     * @property {API~Calls~CallData} data   - Data received from last call.
     * @property {number}             time   - Time (in ms) of last data update.
     * @property {API~Syncing~TimestampedCallError[]} errors - List of errors with attached time (in ms).
     * @property {API~Syncing~Open}   open   - Function that opens the sync instance.
     * @property {API~Syncing~Close}  close  - Function that closes the sync instance.
     * @property {API~Syncing~AddListener}    addListener    - Adds a listener callback for instance-specific events.
     * @property {API~Syncing~RemoveListener} removeListener - Removes a callback from the listeners Set.
     */
    instance = {
      data: {},
      time: -1,
      errors: [],
      /**
       * Opens the sync instance by adding it to the request queue (if not already added). Notifies event listeners only if request has been added.
       *
       * @function API~Syncing~Open
       * @returns  {boolean} True if instance has been opened or is already open.
       */
      open: () => {
        if (!info.requests.has(id)) {
          info.requests.set(
            id, { method, options, instance }
          )
          if (
            info.listeners.has(id) &&
            info.listeners.get(id).size > 0
          ) {
            info.listeners.get(id).forEach(cb => cb(null, null, 'open'))
          }
          handleRequests(info).catch(e => { throw e })
        }
        return true
      },
      /**
       * Closes the sync instance by removing it from the request queue.
       *
       * @function API~Syncing~Close
       * @returns  {boolean} True if instance has been closed or is already closed.
       */
      close: () => {
        info.requests.delete(id)
        return true
      },
      /**
       * Adds a listening callback to for sync operation events.
       *
       * @function API~Syncing~AddListener
       * @param    {API~Syncing~EventListener} listener - Callback for instance-specific events.
       * @returns  {boolean} True if listener has been registered or is already registered.
       */
      addListener: listener => {
        if (!info.listeners.has(id)) info.listeners.set(id, new Set())
        info.listeners.get(id).add(listener)
        return true
      },
      /**
       * Removes a listening callback from the set of listeners.
       *
       * @function API~Syncing~RemoveListener
       * @param    {API~Syncing~EventListener} listener - Callback for instance-specific events.
       * @returns  {boolean} True if listener has been unregistered or is not registered.
       */
      removeListener: listener => {
        if (info.listeners.has(id)) {
          info.listeners.get(id).delete(listener)
          if (info.listeners.get(id).size === 0) {
            info.listeners.delete(id)
          }
        }
        return true
      },
      next: new Promise((resolve, reject) => {
        initResolve = resolve
        initReject = reject
      })
    }
    info.requests.set(
      id, { method, options, instance, initResolve, initReject }
    )
    handleRequests(info).catch(e => {
      const lastID = e.lastID
      delete e.lastID
      e.time = Date.now()
      if (info.requests.has(lastID)) {
        info.requests.get(lastID).instance.errors.push(e)
      }
      if (info.listeners.has(lastID)) {
        info.listeners.get(lastID).forEach(cb => cb(e, null, 'error'))
      }
    })
    return instance
  }
}
