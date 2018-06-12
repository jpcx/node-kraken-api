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
          let options = {}
          Object.entries(request.options).forEach(entry => {
            if (entry[1] instanceof Function) {
              options[entry[0]] = entry[1](instance.data)
            } else {
              options[entry[0]] = entry[1]
            }
          })
          const callData = await info.call(request.method, options)
          if (request.dataBuilder instanceof Function) {
            instance.data = request.dataBuilder(instance.data, callData)
          } else {
            instance.data = callData
          }
          instance.time = Date.now()
          if (instance.state !== 'open' && requests.has(id)) {
            instance.state = 'open'
          }
          if (listeners.has(id)) {
            listeners.get(id).forEach(cb => cb(null, instance.data))
          }
        } catch (e) {
          const err = Error(e)
          if (err.message.match(/EGeneral:Unknown method/g) !== null) {
            err.actions = 'Closed this request'
            instance.close()
          }
          err.time = Date.now()
          instance.errors.push(err)
          if (listeners.has(id)) {
            listeners.get(id).forEach(cb => cb(err, null))
          }
        }
        await ms(calcAverageWait(info))
      }
      info.requesting = false
    }
  } catch (e) {
    e.lastID = lastID
    throw e
  }
}

/**
 * Handles request errors by attempting to find the associated error reporting avenue for a given request.
 *
 * @memberof {API~Syncing}
 * @param {API~Syncing~Info} info - Instance information.
 * @param {Error}            eID  - HandleRequests error with attached last ID.
 */
const reqErrorHandler = (info, eID) => {
  const lastID = eID.lastID
  delete eID.lastID
  eID.time = Date.now()
  if (info.requests.has(lastID)) {
    info.requests.get(lastID).instance.errors.push(eID)
  }
  if (info.listeners.has(lastID)) {
    info.listeners.get(lastID).forEach(cb => cb(eID, null))
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
   * @param    {Kraken~Method}             method      - Kraken method to sync.
   * @param    {API~Syncing~DynamicKrakenOptions} [options] - Method-specific options that may contain functions.
   * @param    {API~Syncing~EventListener} [listener]  - Callback for instance-specific events.
   * @param    {API~Syncing~DataBuilder}   dataBuilder - Builds instance.data given current instance.data and new data.
   * @returns  {API~Syncing~Instance}      Sync instance that holds data and manipulation functions.
   */
  return (method, options, listener, dataBuilder) => {
    if (
      options instanceof Function &&
      !listener &&
      !dataBuilder
    ) {
      listener = options
      options = {}
      dataBuilder = null
    } else if (
      options instanceof Function &&
      listener instanceof Function &&
      !dataBuilder
    ) {
      dataBuilder = listener
      listener = options
      options = {}
    } else if (!options) { options = {} }

    let id = info.id++

    let instance

    if (listener instanceof Function) {
      if (!info.listeners.has(id)) info.listeners.set(id, new Set())
      info.listeners.get(id).add(listener)
    }

    /**
     * Instance of sync operation.
     *
     * @typedef  {Object}             API~Syncing~Instance
     * @property {('init'|'open'|'closed')} state - State is 'init' when initializing; 'open' when data has first been received and will continue to be received; 'closed' when data will no longer be received (one update may occur if it is in progress).
     * @property {API~Calls~CallData} data   - Data received from last call.
     * @property {number}             time   - Time (in ms) of last data update.
     * @property {API~Syncing~SyncError[]} errors - List of errors with attached time (in ms).
     * @property {API~Syncing~Open}   open   - Function that opens the sync instance.
     * @property {API~Syncing~Close}  close  - Function that closes the sync instance.
     * @property {API~Syncing~AddListener}    addListener    - Adds a listener callback for instance-specific events.
     * @property {API~Syncing~RemoveListener} removeListener - Removes a callback from the listeners Set.
     * @property {API~Syncing~Next}           next           - Creates a promise which resolves on next data update and rejects if an error has occurred.
     */
    instance = {
      state: 'init',
      data: {},
      time: -1,
      errors: [],
      /**
       * Opens the sync instance by adding it to the request queue (if not already added).
       *
       * @function API~Syncing~Open
       * @returns  {boolean} True if instance has been opened or is already open.
       */
      open: () => {
        if (!info.requests.has(id)) {
          info.requests.set(
            id, { method, options, instance, dataBuilder }
          )
        }
        if (!info.requesting) {
          handleRequests(info).catch(eID => reqErrorHandler(info, eID))
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
        instance.state = 'closed'
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
      /**
       * Creates a promise that resolves upon new data and rejects upon an error. Creates a self-destructing listener for errors and data.
       *
       * @typedef API~Syncing~Next
       * @returns {Promise} Resolves with data; rejects with an error.
       */
      next: () => new Promise((resolve, reject) => {
        let selfDestructListener
        selfDestructListener = (err, data) => {
          info.listeners.get(id).delete(selfDestructListener)
          if (info.listeners.get(id).size === 0) info.listeners.delete(id)
          if (err) {
            reject(err)
          } else {
            resolve(data)
          }
        }
        if (!info.listeners.has(id)) info.listeners.set(id, new Set())
        info.listeners.get(id).add(selfDestructListener)
      })
    }
    instance.open()
    return instance
  }
}
