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
 * @memberof API~Schedules
 * @param    {API~Schedules~Info} info - Object containing runtime data.
 * @returns  {number}             Average wait time.
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
 * @memberof API~Schedules
 * @param    {API~Schedules~Info}  info - Object containing runtime data.
 * @returns  {Promise}             Promise which resolves when there are no more requests to process and rejects when an error has been thrown.
 */
const handleRequests = async info => {
  if (!info.requesting) {
    info.requesting = true
    let position = 0
    while (info.requests.size > 0) {
      if (position >= info.requests.size) position = 0
      const request = [...info.requests][position++][1]
      try {
        request.cb(null, await info.call(request.method, request.options))
      } catch (e) {
        request.cb(e, null)
      }
      await ms(calcAverageWait(info))
    }
    info.requesting = false
  }
}

/**
 * Loads settings and call function and returns schedule operation functions.
 *
 * @module  API/Schedules/loadSchedule
 * @param   {Kraken~Tier}            tier        - Kraken verification tier.
 * @param   {Settings~RateLimiter}   rateLimiter - Rate limiter logic defined in {@link Settings~Config}.
 * @param   {API~Calls~Call}         call - Call function.
 * @returns {API~Schedules~Schedule} Provides schedule operation functions.
 */
module.exports = (tier, rateLimiter, call) => {
  /**
   * Contains instance information used during schedule process.
   *
   * @typedef  {Object} API~Schedules~Info
   * @param    {Kraken~Tier}            tier        - Kraken verification tier.
   * @param    {Settings~RateLimiter}   rateLimiter - Rate limiter logic defined in {@link Settings~Config}.
   * @property {API~Calls~Call}         call        - Call function.
   * @property {API~Schedules~Requests} requests    - Maps API~Schedules~ID to request parameters.
   * @property {API~Schedules~ID}       id          - Incrementing ID used for schedule assignment.
   * @property {boolean}                requesting  - Whether or not there are currently active schedule operations.
   */
  const info = {
    tier,
    rateLimiter,
    call,
    requests: new Map(),
    id: 0,
    requesting: false
  }

  /**
   * Contains methods for working with schedules.
   *
   * @typedef  {Object}               API~Schedules~Schedule
   * @property {API~Schedules~Add}    add    - Adds a request to the schedule.
   * @property {API~Schedules~Delete} delete - Removes a request from the schedule.
   */
  return {
    /**
     * Adds a request to the schedule.
     *
     * @function API~Schedules~Add
     * @param    {Kraken~Method}    method  - Kraken method being called.
     * @param    {Kraken~Options}   options - Method-specific options.
     * @param    {API~Callback}     cb      - Callback for errors and data.
     * @returns  {API~Schedules~ID} ID used for schedule removal.
     */
    add: (method, options, cb) => {
      if (options instanceof Function) {
        cb = options
        options = {}
      }
      let id = info.id++
      info.requests.set(id, { method, options, cb })
      handleRequests(info).catch(e => cb(e, null))
      return id
    },
    /**
     * Removes a request from the schedule.
     *
     * @function API~Schedules~Delete
     * @param    {API~Schedules~ID} id - Schedule ID given by API~Schedule function.
     * @returns  {boolean}          True if successful, false if not.
     */
    delete: id => info.requests.delete(id)
  }
}
