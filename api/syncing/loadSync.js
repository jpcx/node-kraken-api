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
  try {
    if (!info.requesting) {
      info.requesting = true
      let position = 0
      const queue = info.queue
      while (queue.size > 0) {
        if (position >= queue.size) position = 0
        const request = [...queue][position]
        const instance = request.instance
        const params = request.params
        try {
          const data = await info.call(params.method, params.options)
          if (queue.has(request)) request.state = 'open'
          instance.data = [...request.listeners].reduce(
            (newData, cb) => {
              const modified = cb(null, data, instance)
              if (modified) return instance.data
              else return newData
            }, data
          )
          instance.time = Date.now()
        } catch (e) {
          const err = Error(e)
          err.time = Date.now()
          instance.errors.push(err)
          request.listeners.forEach(cb => cb(err, null, instance))
        }
        await ms(calcAverageWait(info))
        if (!queue.has(request)) request.state = 'closed'
      }
      info.requesting = false
      info.requests.forEach(req => { req.state = 'closed' })
    }
  } catch (e) { throw e }
}

module.exports = (tier, rateLimiter, call) => {
  const info = {
    tier,
    rateLimiter,
    call,
    id: 0,
    requests: new Map(),
    requesting: false,
    queue: new Set()
  }

  return (method, options = {}, listener) => {
    if (options instanceof Function) {
      listener = options
      options = {}
    }

    let id = info.id++

    const listeners = new Set()

    if (listener instanceof Function) listeners.add(listener)

    const instance = {}

    const request = {
      state: 'init',
      params: { method, options },
      instance,
      listeners
    }

    const template = {
      data: {},
      time: -1,
      errors: [],
      getState: () => request.state,
      getParams: () => request.params,
      setParams: params => {
        request.params = params
        return true
      },
      open: () => {
        info.queue.add(request)
        handleRequests(info).catch(
          err => request.listeners.forEach(cb => { cb(err, null, instance) })
        )
        return true
      },
      close: () => {
        info.queue.delete(request)
        return true
      },
      addListener: listener => {
        request.listeners.add(listener)
        return true
      },
      removeListener: listener => {
        request.listeners.delete(listener)
        return true
      },
      next: () => new Promise((resolve, reject) => {
        let selfDestructListener
        selfDestructListener = (err, data, instance) => {
          request.listeners.delete(selfDestructListener)
          if (err) reject(err)
          else resolve(data)
        }
        request.listeners.add(selfDestructListener)
      })
    }

    for (let prop in template) {
      if (template[prop] instanceof Function) {
        Object.defineProperty(instance, prop, {
          value: template[prop],
          writable: false,
          enumerable: true,
          configurable: false
        })
      } else {
        instance[prop] = template[prop]
      }
    }

    info.requests.set(id, request)
    instance.open()
    return instance
  }
}
