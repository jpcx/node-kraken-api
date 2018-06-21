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
 * @function API~Syncing~calcAvgAuthWait
 * @param    {API~Syncing~State} state - Object containing runtime data.
 * @returns  {number}           Average wait time.
 */
const calcAvgAuthWait = (state, starttm) => {
  let sum = 0
  let count = 0
  if (state.internals.has('auth')) {
    for (let req of state.internals.get('auth')) {
      const params = JSON.parse(req[0])
      sum += state.limiter.getAuthRegenFreq(params.method, state.tier)
      count++
    }
    let wait = (sum / count) - (Date.now() - starttm)
    if (wait < 0) wait = 0
    return wait
  } else {
    return 0
  }
}

const verifyParams = (state, type, req) => {
  for (let intl of req[1]) {
    // handle all internals associated with params
    let params = normalize({
      method: intl.instance.method,
      options: intl.instance.options
    })

    const typeMap = state.internals.get(type)
    const reqSet = typeMap.get(req[0])

    if (intl.state === 'closed') {
      // instance has been closed with the close() function
      intl.instance.state = 'closed'
      reqSet.delete(intl)
      if (reqSet.size === 0) {
        typeMap.delete(req[0])
        if (typeMap.size === 0) {
          state.internals.delete(type)
        }
      }
    } else if (JSON.stringify(params) !== req[0]) {
      // method and/or options have been changed via the instance
      let changed = true
      if (params.method !== intl.params.method) {
        // method has been changed
        if (
          state.settings.pubMethods.includes(params.method) ||
          state.settings.privMethods.includes(params.method)
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
        const newType = state.limiter.getType(intl.params.method)
        if (newType !== type) {
          // type has changed
          if (!state.internals.has(newType)) {
            state.internals.set(newType, new Map())
            state.internals.get(newType).set(serialParams, new Set([intl]))
          } else {
            if (!state.internals.get(newType).has(serialParams)) {
              state.internals.get(newType).set(serialParams, new Set([intl]))
            } else {
              state.internals.get(newType).get(serialParams).add(intl)
            }
          }
        } else {
          // params have changed
          if (!typeMap.has(serialParams)) {
            typeMap.set(serialParams, new Set([intl]))
          } else {
            typeMap.get(serialParams).add(intl)
          }
        }
        reqSet.delete(intl)
        if (reqSet.size === 0) {
          typeMap.delete(req[0])
          if (typeMap.size === 0) {
            state.internals.delete(type)
          }
        }
      }
    }
  }
}

/**
 * Handles request queue and sends data to associated {@link API~Syncing~EventListener}s.
 *
 * @function API~Syncing~handleRequests
 * @param    {API~Syncing~State} state - Object containing runtime data.
 * @returns  {Promise}          Promise which resolves when there are no more requests to process and rejects when an error has been thrown.
 * @throws   Will throw any error which does not result directly from a call.
 */
const handleRequests = async (state, type) => {
  while (
    state.internals.has(type) &&
    state.internals.get(type).size > 0
  ) {
    // loop continuously
    for (let req of state.internals.get(type)) {
      // handle all param sets
      const starttm = Date.now()
      verifyParams(state, type, req)
      if (
        !state.internals.has(type) ||
        !state.internals.get(type).has(req[0])
      ) {
        continue
      }
      const params = JSON.parse(req[0])
      let data
      try {
        data = await state.call(params.method, params.options)
        for (let intl of req[1]) {
          if (intl.state === 'init') intl.state = 'open'
          intl.instance.state = 'open'
          Object.keys(intl.data).forEach(key => delete intl.data[key])
          Object.keys(data).forEach(key => (intl.data[key] = data[key]))
          intl.instance.time = Date.now()
          intl.listeners.forEach(cb => cb(null, data, intl.instance))
        }
      } catch (err) {
        for (let intl of req[1]) {
          if (intl.state === 'init') intl.state = 'open'
          intl.instance.state = 'open'
          intl.listeners.forEach(cb => cb(err, null, intl.instance))
        }
      }
      if (type === 'auth') {
        await ms(calcAvgAuthWait(state, starttm))
      }
    }
  }
}

/**
 * Creates a sync instance creator by loading relevant information into a closure.
 *
 * @module  API/Syncing/loadSync
 * @param   {Settings~Config}      settings - Settings configuration.
 * @param   {API~Calls~Call}       call        - Stateful call function.
 * @returns {API~Syncing~Sync}     Function which creates sync instances.
 */
module.exports = (settings, limiter, call) => {
  /**
   * Contains runtime information to be passed around within sync operations.
   *
   * @typedef  {Object} API~Syncing~State
   * @property {Kraken~Tier}          tier        - Kraken verification tier.
   * @property {Settings~RateLimiter} rateLimiter - RateLimiter configuration.
   * @property {API~Calls~Call}       call        - Stateful call function.
   * @property {boolean}              requesting  - Whether or not a queue processing operation is in progress.
   * @property {API~Syncing~OpenRequests}    open    - Set of all open requests.
   * @property {API~Syncing~ClosingRequests} closing - Set of all requests which should be closed.
   */
  const state = {
    settings,
    limiter,
    call,
    internals: new Map(),
    gates: new Set()
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

    const instancePermTemplate = {
      data: internal.data,
      /**
       * Opens the instance if closed.
       *
       * @function API~Syncing~open
       * @returns  {boolean}  True if opened or already open.
       */
      open: () => {
        const type = limiter.getType(internal.params.method)
        const serialParams = JSON.stringify(normalize(internal.params))

        if (!state.internals.has(type)) {
          state.internals.set(type, new Map())
        }

        const loc = state.internals.get(type)

        if (!loc.has(serialParams)) {
          loc.set(serialParams, new Set([internal]))
        } else loc.get(serialParams).add(internal)

        internal.state = 'open'

        if (!state.gates.has(type)) {
          state.gates.add(type)
          handleRequests(state, type).then(
            () => state.gates.delete(type)
          ).catch(
            err => {
              if (state.internals.has(type)) {
                state.internals.get(type).forEach(entry => {
                  entry[1].forEach(internal => {
                    internal.listeners.forEach(cb => {
                      cb(err, null, internal.instance)
                    })
                  })
                })
              }
            }
          )
        }

        return true
      },
      /**
       * Closes the instance if opened.
       *
       * @function API~Syncing~close
       * @returns  {boolean}  True if closed or already closed.
       */
      close: () => (internal.state = 'closed') && true,
      /**
       * Adds an {@link API~Syncing~EventListener} to the instance's request listeners.
       *
       * @function API~Syncing~addListener
       * @param    {API~Syncing~EventListener} listener - Listener function to add.
       * @returns  {boolean}  True if added successfully.
       */
      addListener: listener => internal.listeners.add(listener) && true,
      /**
       * Removes an {@link API~Syncing~EventListener} from the instance's request listeners.
       *
       * @function API~Syncing~removeListener
       * @param    {API~Syncing~EventListener} listener - Listener function to remove.
       * @returns  {boolean}  True if not in the listeners set.
       */
      removeListener: listener => internal.listeners.delete(listener) && true,
      /**
       * Removes all event listeners.
       *
       * @function API~Syncing~removeAllListeners
       * @returns  {boolean} True if all listeners have been deleted.
       */
      removeAllListeners: () => (
        internal.listeners.forEach(l => internal.listeners.delete(l)) && true
      ),
      /**
       * Adds a one-time {@link API~Syncing~EventListener} to the instance's request listeners. If no listener is provided as a parameter, returns a promise which resolves with the next update's error or data.
       *
       * @function API~Syncing~once
       * @param    {API~Syncing~EventListener} [listener] - Once listener function to add.
       * @returns  {(boolean|Promise)}         Returns true if added successfully or a promise if a listener function is not provided.
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
      debug: { state }
    }

    for (let prop in instancePermTemplate) {
      Object.defineProperty(instance, prop, {
        value: instancePermTemplate[prop],
        writable: false,
        enumerable: true,
        configurable: false
      })
    }

    instance.open()

    return instance
  }
}
