/**
 * @author Justin Collier <jpcxme@gmail.com>
 * @license MIT
 * @see {@link http://github.com/jpcx/node-kraken-api|GitHub}
 */

'use strict'

const alphabetizeNested = require('../../tools/alphabetizeNested.js')

/**
 * Responds to changes to changes within the instances associated with the current thread. Pushes out errors if the params are invalid and reverts changes.
 *
 * @function API~Syncing~VerifyInternals
 * @param    {API~Syncing~State}       state     - Object containing runtime data.
 * @param    {API~RateLimits~Category} cat       - Rate limiting category of the current thread.
 * @param    {API~Calls~SerialParams}  serial    - Serial currently associated with the call that triggered verifyInternals.
 * @param    {API~Syncing~InternalSet} internals - Set of all internals associated with the current thread.
 */
const verifyInternals = (state, cat, serial, internals) => {
  for (let intl of internals) {
    // handle all internals associated with serial
    let params = alphabetizeNested({
      method: intl.instance.method,
      options: intl.instance.options
    })

    if (!state.catThreads.has(cat)) continue
    const catMap = state.catThreads.get(cat)
    if (!catMap.has(serial)) continue
    const intlSet = catMap.get(serial)

    if (intl.paused) {
      // instance has been paused as a result of the defined interval
      intlSet.delete(intl)
      if (intlSet.size === 0) {
        catMap.delete(serial)
        state.serialReg.delete(serial)
        if (catMap.size === 0) {
          state.catThreads.delete(cat)
        }
      }
    } else if (JSON.stringify(params) !== serial) {
      // method and/or options have been changed via the instance
      let paramChange = true
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
          params = alphabetizeNested(params)
          // check for further changes
          if (JSON.stringify(params) === serial) paramChange = false
        }
      } else if (params.options.constructor !== Object) {
        // options have changed and are invalid
        // notify listeners
        intl.listeners.forEach(cb => cb(Error(
          `Invalid options ${params.options}. Must be Object. Reverting.`
        ), null, intl.instance))
        // revert
        params.options = JSON.parse(serial).options
        intl.params.options = params.options
        intl.instance.options = params.options
        params = alphabetizeNested(params)
        paramChange = false
      }

      if (paramChange) {
        // re-assign internal
        const newSerial = JSON.stringify(params)
        state.serialReg.set(newSerial, params)
        const newCat = state.limiter.getCategory(intl.params.method)
        if (newCat !== cat) {
          // category has changed
          if (!state.catThreads.has(newCat)) {
            state.catThreads.set(newCat, new Map())
            state.catThreads.get(newCat).set(newSerial, new Set([intl]))
          } else {
            if (!state.catThreads.get(newCat).has(newSerial)) {
              state.catThreads.get(newCat).set(newSerial, new Set([intl]))
            } else {
              state.catThreads.get(newCat).get(newSerial).add(intl)
            }
          }
        } else {
          // params have changed
          if (!catMap.has(newSerial)) {
            catMap.set(newSerial, new Set([intl]))
          } else {
            catMap.get(newSerial).add(intl)
          }
        }
        intlSet.delete(intl)
        if (intlSet.size === 0) {
          catMap.delete(serial)
          state.serialReg.delete(serial)
          if (catMap.size === 0) {
            state.catThreads.delete(cat)
          }
        }
      }
    } else if (intl.instance.interval !== intl.interval) {
      if (!isNaN(intl.instance.interval)) {
        if (typeof intl.instance.interval === 'number') {
          intl.interval = intl.instance.interval
        } else {
          intl.interval = +intl.instance.interval
        }
      } else {
        intl.listeners.forEach(cb => cb(Error(
          `Invalid interval ${intl.instance.interval}. Must be number. Reverting.`
        ), null, intl.instance))
        intl.instance.interval = intl.interval
      }
    }
  }
}

/**
 * Handles request queue and sends data to associated {@link API~Syncing~EventListener}s.
 *
 * @function API~Syncing~HandleRequests
 * @param    {API~Syncing~State}       state - Object containing runtime data.
 * @param    {API~RateLimits~Category} cat - Current rate-limit category.
 * @returns  {Promise}                 Promise which resolves when there are no more requests to process and rejects upon any operational errors.
 */
const handleRequests = async (state, cat) => {
  while (
    state.catThreads.has(cat) &&
    state.catThreads.get(cat).size > 0
  ) {
    // loop continuously
    for (let serial of state.catThreads.get(cat).keys()) {
      const internals = state.catThreads.get(cat).get(serial)
      // handle all param sets
      const starttm = Date.now()
      verifyInternals(state, cat, serial, internals)
      if (!state.catThreads.has(cat)) break
      if (!state.catThreads.get(cat).has(serial)) continue

      const params = state.serialReg.get(serial)
      let data
      try {
        data = await state.call(params.method, params.options)
        for (let intl of internals) {
          if (intl.status === 'init') intl.status = 'open'
          intl.instance.status = 'open'
          intl.instance.data = data
          intl.instance.time = Date.now()
          const listenerErrors = []
          intl.listeners.forEach(cb => {
            try {
              cb(null, data, intl.instance)
            } catch (err) {
              err.message = 'Error in attached event listener! ' + err.message
              listenerErrors.push(err)
            }
          })
          if (listenerErrors.length > 0) {
            intl.listeners.forEach(cb => {
              listenerErrors.forEach(err => cb(err, null, intl.instance))
            })
          }
          let interval = intl.interval
          if (cat === 'auth') {
            const regenIntvl = state.limiter.getAuthRegenIntvl(
              params.method, state.tier
            )
            if (interval < regenIntvl) {
              interval = regenIntvl
            }
          }
          const duration = Date.now() - starttm
          if (interval > duration) {
            intl.paused = true
            setTimeout(
              () => {
                intl.paused = false
                if (intl.status !== 'closed') intl.instance.open()
              },
              interval - duration
            )
          }
        }
      } catch (err) {
        for (let intl of internals) {
          if (intl.status === 'init') intl.status = 'open'
          intl.instance.status = 'open'
          intl.listeners.forEach(cb => cb(err, null, intl.instance))
        }
      }
    }
  }
}

/**
 * Parses inputted arguments and reassigns them based on their type. Arguments will be successfully recognized regardless of omissions.
 *
 * @function API~Syncing~ParseArgs
 * @param   {Settings~Config}           settings - Current settings configuration.
 * @param   {Kraken~Method}             method   - Method being called.
 * @param   {Kraken~Options}            options  - Method-specific options.
 * @param   {API~Syncing~Interval}      interval - Minimum sync update interval.
 * @param   {API~Syncing~EventListener} listener - Listener for errors and data.
 * @returns {API~Syncing~Arguments}     Parsed sync arguments.
 * @throws  {Error}                     Throws 'Bad arguments' or 'Bad method' errors if arguments are invalid.
 */
const parseArgs = (settings, method, options, interval, listener) => {
  if (
    !settings.pubMethods.includes(method) &&
    !settings.privMethods.includes(method)
  ) {
    throw Error(`Bad method: ${method}. See documentation and check settings.`)
  }

  const argArr = []
  if (options !== undefined) argArr.push(options)
  if (interval !== undefined) argArr.push(interval)
  if (listener !== undefined) argArr.push(listener)

  const parseOp = argArr.reduce(
    (op, arg) => {
      if (!op.invalid) {
        if (arg.constructor === Object) {
          if (
            op.args.has('options') ||
            op.args.has('interval') ||
            op.args.has('listener')
          ) {
            op.invalid = true
          } else {
            op.args.set('options', arg)
          }
        } else if (!isNaN(arg)) {
          if (
            op.args.has('interval') ||
            op.args.has('listener')
          ) {
            op.invalid = true
          } else {
            op.args.set('interval', arg)
          }
        } else if (typeof arg === 'function') {
          if (op.args.has('listener')) {
            op.invalid = true
          } else {
            op.args.set('listener', arg)
          }
        } else {
          op.invalid = true
        }
      }
      return op
    }, { args: new Map(), invalid: false }
  )

  if (parseOp.invalid) throw Error('Bad arguments. See documentation.')

  const defaultInterval = settings.syncIntervals[method] || 0
  return {
    options: parseOp.args.get('options') || {},
    interval: parseOp.args.get('interval') || defaultInterval,
    listener: parseOp.args.get('listener')
  }
}

/**
 * Creates a sync instance creator by loading relevant information into a closure.
 *
 * @module  API/Syncing/LoadSync
 * @param   {Settings~Config}          settings - Settings configuration.
 * @param   {API~RateLimits~Functions} limiter  - Limiter instance.
 * @param   {API~Calls~Call}           call     - Stateful call function.
 * @returns {API~Syncing~Sync}         Function which creates sync instances.
 */
module.exports = (settings, limiter, call) => {
  /**
   * Contains runtime information to be passed around within sync operations.
   *
   * @typedef  {Object} API~Syncing~State
   * @property {Settings~Config}          settings        - Settings configuration.
   * @property {API~RateLimits~Functions} limiter - Limiter instance.
   * @property {API~Calls~Call}           call        - Stateful call function.
   * @property {API~Syncing~CatThreads}   catThreads - Map of category to map of serials to internals set.
   * @property {API~Calls~SerialRegistry}       serialReg  - Maps serialized params to actual params.
   */
  const state = {
    settings,
    limiter,
    call,
    catThreads: new Map(),
    serialReg: new Map()
  }
  /**
   * Stateful function which creates sync instances. Any argument (except method) may be omitted and replaced with another, as long as the order [options, interval, listener] is preserved.
   *
   * @function API~Syncing~Sync
   * @param    {Kraken~Method}             method     - Method being called.
   * @param    {Kraken~Options}            [options]  - Method-specific options.
   * @param    {API~Syncing~Interval}      [interval] - Minimum update interval for sync operation.
   * @param    {API~Syncing~EventListener} [listener] - Listener for error and data events.
   * @returns  {API~Syncing~Instance} Instance of sync operation.
   * @throws   {Error}                Throws 'Bad arguments' or 'Bad method' errors if arguments are invalid.
   */
  return (method, options, interval, listener) => {
    const args = parseArgs(settings, method, options, interval, listener)
    options = args.options
    interval = args.interval
    listener = args.listener

    const listeners = new Set()

    if (typeof listener === 'function') listeners.add(listener)

    /**
     * Sync instance used for behavior manipulation and data retrieval.
     *
     * @typedef  {Object} API~Syncing~Instance
     * @property {API~Syncing~Status} status - Current status of the instance. Set to 'init' until request attempt, 'open' when active, and 'closed' when not. Note: changing this value during runtime will not change instance behaviors; use the associated 'open' and 'close' methods instead.
     * @property {API~Syncing~Interval} interval - Minimum sync update time.
     * @property {Kraken~Method} method - Current method associated with the instance. Changes to this value during runtime will result in thread reassignment if valid; if invalid, will be reverted and will notify the event listeners with an 'Invalid method' error.
     * @property {Kraken~Options} options - Current method-specific options. Changes to this value during runtime will result in map reassignment if valid; if invalid (not an object), will be reverted and will notify the event listeners with an 'Invalid options' error.
     * @property {API~Syncing~InstanceData} data - Object containing data from the last successful response.
     * @property {number} time - Time (in ms) of last successful {@link API~Syncing~InstanceData} update.
     * @property {API~Syncing~Open} open - Opens the instance if closed.
     * @property {API~Syncing~Close} close - Closes the instance if open.
     * @property {API~Syncing~AddListener} addListener - Associates a new {@link API~Syncing~EventListener}.
     * @property {API~Syncing~RemoveListener} removeListener - Disassociates a {@link API~Syncing~EventListener}.
     * @property {API~Syncing~Once} once - Adds a one-time {@link API~Syncing~EventListener} if provided; otherwise returns a promise which resolves/rejects on the next error/data event.
     */
    const instance = {
      status: 'init', interval, method, options, data: {}, time: -1
    }

    /**
     * Internal sync instance data.
     *
     * @typedef  {Object}               API~Syncing~Internal
     * @property {API~Syncing~Status}   status   - Current status of the request.
     * @property {boolean}              paused   - Whether or not sync updates are paused due to interval.
     * @property {API~Syncing~Interval} interval - Minimum sync update interval.
     * @property {API~Calls~Params}     params   - Object containing method and options.
     * @property {API~Syncing~Instance} instance - Instance being tracked.
     * @property {Set<API~Syncing~EventListener>} listeners - Set of all associated event listeners.
     */
    const internal = {
      status: 'init',
      paused: false,
      interval,
      params: {
        method,
        options
      },
      instance,
      listeners
    }

    const instancePermTemplate = {
      /**
       * Opens the instance if closed.
       *
       * @function API~Syncing~Open
       * @returns  {boolean}  True if opened or already open.
       */
      open: () => {
        const cat = limiter.getCategory(internal.params.method)
        const serial = JSON.stringify(alphabetizeNested(internal.params))
        state.serialReg.set(serial, internal.params)

        let launch = false

        if (!state.catThreads.has(cat)) {
          state.catThreads.set(cat, new Map())
          launch = true
        }

        const thread = state.catThreads.get(cat)

        if (!thread.has(serial)) {
          thread.set(serial, new Set([internal]))
        } else thread.get(serial).add(internal)

        internal.status = 'open'

        if (launch) {
          handleRequests(state, cat).catch(
            err => {
              if (state.catThreads.has(cat)) {
                state.catThreads.get(cat).forEach(thread => {
                  thread.forEach(internal => {
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
       * @function API~Syncing~Close
       * @returns  {boolean} True if closed or already closed.
       */
      close: () => {
        const cat = limiter.getCategory(internal.params.method)
        const serial = JSON.stringify(alphabetizeNested(internal.params))
        if (state.catThreads.has(cat)) {
          const catMap = state.catThreads.get(cat)
          if (catMap.has(serial)) {
            const intlSet = catMap.get(serial)
            intlSet.delete(internal)
            if (intlSet.size === 0) {
              catMap.delete(serial)
              state.serialReg.delete(serial)
              if (catMap.size === 0) {
                state.catThreads.delete(cat)
              }
            }
          }
        }
        internal.status = 'closed'
        instance.status = 'closed'
        return true
      },
      /**
       * Associates a new {@link API~Syncing~EventListener} with the instance.
       *
       * @function API~Syncing~AddListener
       * @param    {API~Syncing~EventListener} listener - Listener function to add.
       * @returns  {boolean} True if added successfully.
       */
      addListener: listener => internal.listeners.add(listener) && true,
      /**
       * Disassociates an {@link API~Syncing~EventListener} from the instance.
       *
       * @function API~Syncing~RemoveListener
       * @param    {API~Syncing~EventListener} listener - Listener function to remove.
       * @returns  {boolean} True if not in the listeners set.
       */
      removeListener: listener => internal.listeners.delete(listener) && true,
      /**
       * Adds a one-time {@link API~Syncing~EventListener} to the instance. If no listener is provided as a parameter, returns a promise which resolves with the next update's error or data.
       *
       * @function API~Syncing~Once
       * @param    {API~Syncing~EventListener} [listener] - Once listener function to add.
       * @returns  {(boolean|Promise)}         Returns true if added successfully or a promise if a listener function is not provided.
       */
      once: onceListener => {
        const op = new Promise(
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
        if (typeof onceListener === 'function') {
          op
            .then(data => onceListener(null, instance.data, instance))
            .catch(err => onceListener(err, null, instance))
          return true
        } else {
          return op
        }
      }
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
