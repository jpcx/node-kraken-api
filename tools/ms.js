/**
 * @author Justin Collier <jpcxme@gmail.com>
 * @license MIT
 * @see {@link http://github.com/jpcx/node-kraken-api|GitHub}
 */

'use strict'

/**
 * Returns a promise which resolves after a given number of milliseconds.
 *
 * @module  Tools/ms
 * @param   {number}  ms - Milliseconds to wait.
 * @returns {Promise} Promise which resolves after setTimeout has completed.
 */
module.exports = ms => new Promise(resolve => setTimeout(resolve, ms))
