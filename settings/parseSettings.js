/**
 * @author Justin Collier <jpcxme@gmail.com>
 * @license MIT
 * @see {@link http://github.com/jpcx/node-kraken-api|GitHub}
 */

'use strict'

const extract = require('deep-props').extract
const set = require('deep-props').set
const defaults = require('./defaults.json')

/**
 * Parses settings input, checks for bad values, and combines with defaults.
 *
 * @module   Settings/ParseSettings
 * @param    {Settings~Config} settings - Current supplied custom settings configuration.
 * @returns  {Settings~Config} Parsed settings.
 * @throws   {(TypeError|RangeError)} Throws an error if a setting is not of an acceptable type or range.
 */
module.exports = settings => {
  const strings = ['key', 'secret', 'hostname']
  const booleans = ['parse.numbers', 'parse.dates']
  const nullOrStringsOrNumbers = ['otp']
  const arraysOfStrings = ['pubMethods', 'privMethods']
  const nullOrFunctions = ['dataFormatter']
  const greaterThanZero = ['timeout']
  const greaterThanOrEqualToZero = [
    'tier', 'retryCt', 'version', 'limiter.baseIntvl',
    'limiter.minIntvl', 'syncIntervals.Time', 'syncIntervals.Assets',
    'syncIntervals.AssetPairs', 'syncIntervals.Ticker', 'syncIntervals.OHLC',
    'syncIntervals.Depth', 'syncIntervals.Trades', 'syncIntervals.Spread'
  ]
  const combined = defaults
  extract(settings).reduce(
    (consolidated, v) => {
      if (isNaN(v.path[v.path.length - 1])) {
        consolidated.push(v)
      } else if (consolidated.length === 0) {
        consolidated.push({
          path: v.path.slice(0, -1),
          value: [v.value]
        })
      } else {
        const same = consolidated.slice(-1)[0].path.reduce(
          (s, x, i) => {
            if (x !== v.path[i]) return false
            else if (s) return true
          }, true
        )
        if (same) {
          consolidated.slice(-1)[0].value.push(v.value)
        } else {
          consolidated.push({
            path: v.path.slice(0, -1),
            value: [v.value]
          })
        }
      }
      return consolidated
    }, []
  ).reduce(
    (parsed, val) => {
      let cust = val.value
      const path = val.path.reduce((str, v) => {
        if (str === '') {
          return v
        } else {
          return str + '.' + v
        }
      }, '')
      if (strings.includes(path) && typeof cust !== 'string') {
        throw TypeError(`Invalid setting ${path}. Must be string.`)
      } else if (booleans.includes(path) && typeof cust !== 'boolean') {
        throw TypeError(`Invalid setting ${path}. Must be boolean.`)
      } else if (
        nullOrStringsOrNumbers.includes(path) &&
          !(cust === null || typeof cust === 'string' || !isNaN(cust))
      ) {
        throw TypeError(
          `Invalid setting ${path}. Must be null, a string, or a number.`
        )
      } else if (arraysOfStrings.includes(path)) {
        if (
          !(cust instanceof Array) ||
            cust.reduce((b, v) => typeof v !== 'string', false)
        ) {
          throw TypeError(
            `Invalid setting ${path}. Must be an array of strings.`
          )
        }
      } else if (
        nullOrFunctions.includes(path) &&
        !(cust === null || typeof cust === 'function')
      ) {
        throw TypeError(`Invalid setting ${path}. Must be a function or null.`)
      } else if (greaterThanZero.includes(path) && cust <= 0) {
        throw RangeError(`Invalid setting ${path}. Must be > 0.`)
      } else if (greaterThanOrEqualToZero.includes(path) && cust < 0) {
        throw RangeError(`Invalid setting ${path}. Must be >= 0.`)
      }
      parsed.push(val)
      return parsed
    }, []
  ).forEach(v => set(combined, v.path, v.value))
  return combined
}
