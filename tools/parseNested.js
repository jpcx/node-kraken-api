/**
 * @author Justin Collier <jpcxme@gmail.com>
 * @license MIT
 * @see {@link http://github.com/jpcx/node-kraken-api|GitHub}
 */

'use strict'

const { extract, set } = require('deep-props')
const rangedDate = require('ranged-date')

/**
 * Parses objects based on {@link Tools~ParseNestedConfig}.
 *
 * @module Tools/ParseNested
 * @param    {Tools~ParseNestedConfig} config - Parse types config.
 * @param    {(Object|Array|Map|Set)}  obj    - Object to parse.
 * @returns  {(Object|Array|Map|Set)}  Parsed object
 */
module.exports = (config, obj) => {
  const info = extract(obj)
  info.forEach(x => {
    if (config.numbers) {
      const testNum = +x.value
      if (!isNaN(testNum)) {
        set(obj, x.path, testNum)
      }
    }
    if (config.dates) {
      const testDate = rangedDate(x.value)
      if (testDate !== false) {
        set(obj, x.path, testDate)
      }
    }
  })
  return obj
}
