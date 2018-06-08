/**
 * @author Justin Collier <jpcxme@gmail.com>
 * @license MIT
 * @see {@link http://github.com/jpcx/node-kraken-api|GitHub}
 */

'use strict'

const fs = require('fs')
const tryDirectory = require('./tryDirectory.js')

/**
 * Reads JSON in a file given a path. Creates file with supplied default data if not found.
 *
 * @memberof Tools
 * @param    {string}         path - Path to file (prepended by <code>process.cwd()</code>).
 * @param    {(Object|Array)} data - Default data to create if not found.
 * @returns  {(Object|Array)} Parsed JSON.
 */
const tryFileJSON = (path, data) => {
  try {
    return JSON.parse(
      fs.readFileSync(process.cwd() + path, 'utf8')
    )
  } catch (e) {
    fs.writeFileSync(
      process.cwd() + path, JSON.stringify(data), 'utf8'
    )
    return data
  }
}

/**
 * Reads JSON in a file given a path.
 * Creates directory structure if not found.
 * Creates file with supplied default data if not found.
 *
 * @module  Tools/readFileJSON
 * @param   {string}         path - Path to file (prepended by <code>process.cwd()</code>).
 * @param   {(Object|Array)} data - Default data to create if not found.
 * @returns {Promise}        Resolves with read data (or written default data); rejects with failures.
 */
module.exports = (path, data = {}) => new Promise(
  (resolve, reject) => {
    try {
      if (path[0] !== '/') path = '/' + path
      tryDirectory(path.replace(/(.*)\/.*/gm, '$1')).then(
        resolve(tryFileJSON(path, data))
      ).catch(e => reject(e))
    } catch (e) {
      reject(e)
    }
  }
)
