/**
 * @author Justin Collier <jpcxme@gmail.com>
 * @license MIT
 * @see {@link http://github.com/jpcx/node-kraken-api|GitHub}
 */

'use strict'

const update = (state, type, context) => {
  const now = Date.now()
  const any = state.calls
  if (!state.types.has(type)) {
    state.types.set(type, { freq: 500, last: 0 })
  }
  if (context === 'pass' || context === 'fail') {
    any.compl.push(now)
  } else any.attmp.push(now)

  const spec = state.types.get(type)

  any.attmp = any.attmp.filter(t => t > now - 60000)
  any.compl = any.compl.filter(t => t > now - 60000)

  if (any.attmp.length > any.compl.length * 1.1) {
    if (any.freq < 1000) any.freq = 1000
    any.freq *= 1.05
  }

  if (context === 'fail') {
    if (spec.freq < 4500) spec.freq = 4500
    spec.freq *= 1.1
  }
  if (context === 'pass') {
    if (any.freq < 1) any.freq = 0
    else any.freq *= 0.95
    if (spec.freq < 1) spec.freq = 0
    else spec.freq *= 0.95
  }
}

module.exports = settings => {
  const state = {
    settings,
    calls: {
      freq: 500,
      attmp: [],
      compl: []
    },
    types: new Map()
  }
  return {
    attempt: type => new Promise(resolve => {
      const now = Date.now()
      const any = state.calls
      update(state, type)
      const spec = state.types.get(type)
      const elapsedAny = now - any.attmp.slice(-2)[0]
      const elapsedSpec = now - spec.last
      spec.last = now

      let wait

      if (elapsedAny > any.freq) {
        if (elapsedSpec > spec.freq) {
          wait = 0
        } else {
          wait = spec.freq - elapsedSpec
        }
      } else {
        if (elapsedSpec > spec.freq) {
          wait = any.freq - elapsedAny
        } else {
          wait = spec.freq - elapsedSpec
        }
      }
      // =======================================================================
      // DEBUG
      // =======================================================================
      const debug = {
        callFreq: state.calls.freq,
        callAttm: state.calls.attmp.length,
        callComp: state.calls.compl.length
      }
      for (let type of state.types.keys()) {
        debug[type] = state.types.get(type).freq
      }
      console.dir(debug, { depth: null, colors: true })
      console.log('Wait time: ' + wait)
      // =======================================================================
      // END DEBUG
      // =======================================================================
      setTimeout(resolve, wait)
    }),
    addPass: type => update(state, type, 'pass') && true,
    addFail: type => update(state, type, 'fail') && true,
    getType: method => (
      method === 'OHLC'
        ? 'ohlc'
        : method === 'Trades'
          ? 'trades'
          : settings.privMethods.includes(method)
            ? 'auth'
            : 'other'
    ),
    getAuthRegenFreq: (method, tier) => {
      const increment = method === 'Ledgers' || method === 'TradesHistory'
        ? 2
        : method === 'AddOrder' || method === 'CancelOrder'
          ? 0
          : 1
      const interval = tier === 4 ? 1000 : tier === 3 ? 2000 : 3000
      return increment * interval
    }
  }
}
