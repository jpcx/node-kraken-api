/**
 * @author Justin Collier <jpcxme@gmail.com>
 * @license MIT
 * @see {@link http://github.com/jpcx/node-kraken-api|GitHub}
 */

'use strict'

const fs = require('fs')
const tryDirectory = require('./tryDirectory.js')

/**
 * Writes JSON in a file given a path. Creates file with supplied default data if not found.
 *
 * @memberof               Tools
 * @param {string}         path - Path to file.
 * @param {(Object|Array)} data - Data to write as JSON.
 */
const writeJSON = (path, data) => {
  if (path[0] !== '/') path = '/' + path
  fs.writeFileSync(
    process.cwd() + path,
    JSON.stringify(data, null, 2),
    'utf8'
  )
}

/**
 * Writes JSON in a file given a path.
 * Creates directory structure if not found.
 * Creates file with supplied default data if not found.
 *
 * @module  Tools/writeFileJSON
 * @param   {string}         path - Path to file (prepended by <code>process.cwd()</code>).
 * @param   {(Object|Array)} data - Default data to create if not found.
 * @returns {Promise}        Resolves with read data (or written default data); rejects with failures.
 */
module.exports = (path, data) => new Promise(
  (resolve, reject) => {
    try {
      tryDirectory(path.replace(/(.*)\/.*/gm, '$1')).then(
        resolve(writeJSON(path, data))
      ).catch(e => reject(e))
    } catch (e) {
      reject(e)
    }
  }
)
