/**
 * @author Justin Collier <jpcxme@gmail.com>
 * @license MIT
 * @see {@link http://github.com/jpcx/node-kraken-api|GitHub}
 */

'use strict'

const crypto = require('crypto')

/**
 * Signs the request using the 'crypto' library based on the specifications listed in the [Kraken API Docs]{@link https://www.kraken.com/help/api#general-usage}.
 *
 * @module  API/Calls/SignRequest
 * @param   {Kraken~Secret}               secret   - Kraken API secret key.
 * @param   {Kraken~Nonce}                nonce    - Kraken API nonce.
 * @param   {Kraken~HTTPSRequestPOSTData} post     - POST data.
 * @param   {Kraken~Path}                 path     - Path to Kraken Method URL.
 * @returns {API~Calls~Signature}         Signature for a given call.
 */
module.exports = (secret, nonce, post, path) => {
  const sec = Buffer.from(secret, 'base64')
  const hash = crypto.createHash('sha256')
  const hmac = crypto.createHmac('sha512', sec)
  const dig = hash.update(nonce + post).digest('binary')
  return hmac.update(path + dig, 'binary').digest('base64')
}
