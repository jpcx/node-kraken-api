/**
 * @author Justin Collier <jpcxme@gmail.com>
 * @license MIT
 * @see {@link http://github.com/jpcx/node-kraken-api|GitHub}
 */

'use strict'

const fs = require('fs')

/**
 * Attempts to access a given directory. Creates structure if not found.
 *
 * @module  Tools/tryDirectory
 * @param   {string}  path - Path to file (prepended by <code>process.cwd()</code>).
 * @returns {Promise} Resolves if directory structure exists or has been created; rejects if unsuccessful.
 */
module.exports = path => new Promise(
  (resolve, reject) => {
    try {
      if (path[0] !== '/') path = '/' + path
      if (path[path.length - 1] === '/') path = path.slice(0, -1)
      path = path.split(/\//g)
      let gradualPath = ''
      for (let p of path) {
        gradualPath += p
        try {
          fs.accessSync(process.cwd() + gradualPath)
        } catch (e) {
          fs.mkdirSync(process.cwd() + gradualPath)
        }
        gradualPath += '/'
      }
      resolve()
    } catch (e) {
      reject(e)
    }
  }
)
