/**
 * @author Justin Collier <jpcxme@gmail.com>
 * @license MIT
 * @see {@link http://github.com/jpcx/node-kraken-api|GitHub}
 */

'use strict'

/**
 * Checks for more calls being made than responses received and adjusts call frequency accordingly.
 *
 * @function API~RateLimits~CheckPileUp
 * @param    {Settings~RateLimiter}    limitConfig - Current rate-limiter settings configuration.
 * @param    {API~RateLimits~CallInfo} any         - Rate information for all calls.
 */
const checkPileUp = (limitConfig, any) => {
  if (any.attmp.length - any.compl.length > limitConfig.pileUpThreshold) {
    if (any.intvl < limitConfig.pileUpResetIntvl) {
      any.intvl = limitConfig.pileUpResetIntvl
    }
    any.intvl *= limitConfig.pileUpMultiplier
  }
}

/**
 * Checks the response context for {@link API~RateLimits~Update} and adjusts call frequency accordingly.
 *
 * @function API~RateLimits~CheckContext
 * @param    {('pass'|'fail'|undefined)} context     - Reason for invocation; may be called in response to a successful call, a rate limit violation, or a pre-response call attempt.
 * @param    {Settings~RateLimiter}      limitConfig - Rate-limiter settings configuration.
 * @param    {API~RateLimits~CallInfo}   any         - Rate information for all calls.
 * @param    {API~RateLimits~CatInfo}    spec        - Rate information for specific {@link API~RateLimits~Category}.
 */
const checkContext = (context, limitConfig, any, spec) => {
  if (context === 'fail') {
    if (spec.intvl < limitConfig.violationResetIntvl) {
      spec.intvl = limitConfig.violationResetIntvl
    }
    spec.intvl *= limitConfig.violationMultiplier
  } else if (context === 'pass') {
    any.intvl *= limitConfig.anyPassDecay
    spec.intvl *= limitConfig.specificPassDecay
  }
}

/**
 * Updates {@link API~RateLimits~CallInfo} and {@link API~RateLimits~CatInfo} intervals in response to server response behavior.
 *
 * @function API~RateLimits~Update
 * @param    {API~RateLimits~State}    state     - Stateful registry of limiter information.
 * @param    {API~RateLimits~Category} category  - Type of category based on rate-limiting behavior.
 * @param    {('pass'|'fail')}         [context] - Reason for invocation; may be called in response to a successful call, a rate limit violation, or a pre-response call attempt.
 */
const update = (state, category, context) => {
  const limitConfig = state.settings.limiter
  const now = Date.now()
  const any = state.calls
  if (!state.catInfo.has(category)) {
    state.catInfo.set(category, { intvl: limitConfig.baseIntvl, last: 0 })
  }
  if (context === 'pass' || context === 'fail') {
    any.compl.push(now)
  } else any.attmp.push(now)

  const spec = state.catInfo.get(category)

  any.attmp = any.attmp.filter(t => t > now - limitConfig.pileUpWindow)
  any.compl = any.compl.filter(t => t > now - limitConfig.pileUpWindow)

  checkPileUp(limitConfig, any)
  checkContext(context, limitConfig, any, spec)

  if (any.intvl < limitConfig.minIntvl) any.intvl = limitConfig.minIntvl
  if (spec.intvl < limitConfig.minIntvl) spec.intvl = limitConfig.minIntvl
}

/**
 * Loads settings and returns an object with rate-limiting functions.
 *
 * @module  API/RateLimits/LoadLimiter
 * @param   {Settings~Config}          settings - Current settings configuration.
 * @returns {API~RateLimits~Functions} Rate-limiting functions.
 */
module.exports = settings => {
  /**
   * Holds data relevant to current execution state.
   *
   * @typedef  API~RateLimits~State
   * @property {Settings~Config}         settings - Current settings configuration.
   * @property {API~RateLimits~CallInfo} calls    - Rate info for all calls.
   * @property {API~RateLimits~CatInfo}  catInfo  - Map of category to object containing category-specific rate information.
   */
  const state = {
    settings,
    calls: {
      intvl: settings.limiter.baseIntvl,
      attmp: [],
      compl: []
    },
    catInfo: new Map()
  }
  /**
   * Contains functions for working with rate-limits.
   *
   * @typedef  {Object}                 API~RateLimits~Functions
   * @property {API~RateLimits~Attempt} attempt - Register a new call attempt.
   * @property {API~RateLimits~AddPass} addPass - Register a new successful call response.
   * @property {API~RateLimits~AddFail} addFail - Register a new rate-limit violation.
   * @property {API~RateLimits~GetCategory} getCategory - Gets the type of rate-limiting behavior based on the method.
   * @property {API~RateLimits~GetAuthRegenIntvl} getAuthRegenIntvl - Gets the amount of time necessary for a given private method to be called sustainably.
   */
  return {
    /**
     * Registers a new call attempt and returns a promise that signifies that the call placement may be submitted.
     *
     * @function API~RateLimits~Attempt
     * @param    {API~RateLimits~Category} category - Type of category based on rate-limiting behavior.
     * @returns  {Promise}                 Resolves when an adequate wait period has been completed.
     */
    attempt: category => new Promise(resolve => {
      const now = Date.now()
      const any = state.calls
      update(state, category)
      const spec = state.catInfo.get(category)
      const elapsedAny = now - any.attmp.slice(-2)[0]
      const elapsedSpec = now - spec.last
      spec.last = now

      let wait

      if (elapsedAny > any.intvl) {
        if (elapsedSpec > spec.intvl) {
          wait = 0
        } else {
          wait = spec.intvl - elapsedSpec
        }
      } else {
        if (elapsedSpec > spec.intvl) {
          wait = any.intvl - elapsedAny
        } else {
          if (spec.intvl - elapsedSpec > any.intvl - elapsedAny) {
            wait = spec.intvl - elapsedSpec
          } else {
            wait = any.intvl - elapsedAny
          }
        }
      }
      setTimeout(resolve, wait)
    }),
    /**
     * Registers any response that is not a rate-limit violation and updates frequencies accordingly.
     *
     * @function API~RateLimits~AddPass
     * @param    {API~RateLimits~Category} category - Type of category based on rate-limiting behavior.
     * @returns  {boolean}                 True if successfully updated.
     */
    addPass: category => {
      update(state, category, 'pass')
      return true
    },
    /**
     * Registers a new rate-limit violation and updates frequencies accordingly.
     *
     * @function API~RateLimits~AddFail
     * @param    {API~RateLimits~Category} category - Type of category based on rate-limiting behavior.
     * @returns  {boolean}                 True if successfully updated.
     */
    addFail: category => {
      update(state, category, 'fail')
      return true
    },
    /**
     * Gets the type of server-side rate-limiter category based on the method.
     *
     * @function API~RateLimits~GetCategory
     * @param    {Kraken~Method}           method - Method being called.
     * @returns  {API~RateLimits~Category} Type of rate-limiter category.
     */
    getCategory: method => (
      method === 'OHLC'
        ? 'ohlc'
        : method === 'Trades'
          ? 'trades'
          : settings.privMethods.includes(method)
            ? 'auth'
            : 'other'
    ),
    /**
     * Gets the frequency required for sustainable execution of a private method.
     *
     * @function API~RateLimits~GetAuthRegenIntvl
     * @param    {Kraken~Method} method - Method being called.
     * @param    {Kraken~Tier}   tier   - Current verification tier.
     * @returns  {number}        Optimal interval.
     */
    getAuthRegenIntvl: (method, tier) => {
      const increment = method === 'Ledgers' || method === 'TradesHistory'
        ? 2
        : method === 'AddOrder' || method === 'CancelOrder'
          ? 0
          : 1
      const decIntvl = tier === 4 ? 1000 : tier === 3 ? 2000 : 3000
      return increment * decIntvl
    }
  }
}
