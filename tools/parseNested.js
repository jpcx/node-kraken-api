/**
 * @author Justin Collier <jpcxme@gmail.com>
 * @license MIT
 * @see {@link http://github.com/jpcx/node-kraken-api|GitHub}
 */

'use strict'

const extract = require('deep-props.extract')
const set = require('deep-props.set')
const rangedDate = require('ranged-date')

/**
 * Parses objects based on {@link Settings~Config}.
 *
 * @module Tools/parseNested
 * @param  {Settings~Config}        settings - Execution settings configuration.
 * @param  {(Object|Array|Map|Set)} obj      - Object to parse.
 */
module.exports = (settings, obj) => {
  const info = extract(obj)
  info.forEach(x => {
    if (settings.parse.numbers) {
      const testNum = +x.value
      if (!isNaN(testNum)) {
        set(obj, x.path, testNum)
      }
    }
    if (settings.parse.dates) {
      const testDate = rangedDate(x.value)
      if (testDate !== false) {
        set(obj, x.path, testDate)
      }
    }
  })
  return obj
}
