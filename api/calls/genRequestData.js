/**
 * @author Justin Collier <jpcxme@gmail.com>
 * @license MIT
 * @see {@link http://github.com/jpcx/node-kraken-api|GitHub}
 */

'use strict'

const qs = require('qs')
const signRequest = require('./signRequest.js')

/**
 * Generates request data for a given call.
 *
 * @module  API/Calls/GenRequestData
 * @param   {Settings~Config}       settings - Execution settings.
 * @param   {API~Calls~Params}      params   - Object containing call specs.
 * @returns {API~Calls~RequestData} Request data.
 */
module.exports = (settings, params) => {
  const nonce = Date.now() * 1000
  const prePost = { ...params.options, nonce }
  if (settings.otp) prePost.otp = settings.otp
  const post = qs.stringify(prePost)
  const isPriv = settings.privMethods.includes(params.method)
  const type = isPriv ? 'private' : 'public'
  const path = '/' + settings.version + '/' + type + '/' + params.method
  const headers = { 'User-Agent': 'Kraken Node.JS API Client' }

  if (settings.secret && type === 'private') {
    const sig = signRequest(settings.secret, nonce, post, path)
    headers['API-Key'] = settings.key
    headers['API-Sign'] = sig
  } else {
    if (type === 'private') throw Error('EAPI:Invalid key')
  }

  return {
    options: { hostname: settings.hostname, path, method: 'POST', headers },
    post
  }
}
