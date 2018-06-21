/**
 * @author Justin Collier <jpcxme@gmail.com>
 * @license MIT
 * @see {@link http://github.com/jpcx/node-kraken-api|GitHub}
 */

'use strict'

const https = require('https')
const parseNested = require('../../tools/parseNested.js')
const normalize = require('../../tools/normalize.js')
const genRequestData = require('./genRequestData.js')

const handleResponse = (settings, res) => new Promise(
  (resolve, reject) => {
    let body = ''
    res.setEncoding('utf8')
    res.on('data', chunk => {
      try {
        body += chunk
        const testBody = JSON.parse(body)
        if (testBody.error && testBody.error.length > 0) {
          reject(Error(testBody.error))
        }
      } catch (e) {
        if (e.message !== 'Unexpected end of JSON input') reject(e)
      }
    })
    res.on('end', () => {
      if (res.statusCode >= 200 && res.statusCode < 300) {
        try {
          body = JSON.parse(body)
          if (settings.parse.numbers || settings.parse.dates) {
            body.result = parseNested(settings, body.result)
          }
          if (body.error && body.error.length > 0) {
            reject(Error(body.error))
          } else {
            resolve(body.result)
          }
        } catch (e) {
          reject(e)
        }
      } else {
        reject(Error(res.statusCode + ' ' + res.statusMessage))
      }
    })
  }
)

const makeRequest = (settings, params) => new Promise(
  (resolve, reject) => {
    try {
      const reqData = genRequestData(settings, params)
      const req = https.request(
        reqData.options,
        res => handleResponse(settings, res).then(resolve).catch(reject)
      )
      req.on('error', e => {
        req.abort()
        reject(e)
      })
      req.setTimeout(settings.timeout, () => {
        req.abort()
        reject(Error('ETIMEDOUT'))
      })
      req.write(reqData.post)
      req.end()
    } catch (err) { reject(err) }
  }
)

const processCalls = async (settings, type, serials, paramMap, limiter) => {
  while (serials.size > 0) {
    for (let serial of serials.keys()) {
      const params = { ...paramMap.get(serial) }
      await limiter.attempt(type)
      if (!serials.has(serial) || serials.get(serial).size === 0) {
        limiter.addPass(type)
        continue
      }
      const group = new Set([...serials.get(serial)])
      makeRequest(settings, params).then(
        data => {
          limiter.addPass(type)
          group.forEach(listener => listener(null, data))
        }
      ).catch(
        err => {
          if (err.message.match(/rate limit/gi)) {
            limiter.addFail(type)
          } else limiter.addPass(type)

          group.forEach(listener => listener(err, null))
        }
      )
      group.forEach(listener => serials.get(serial).delete(listener))
      if (serials.get(serial).size === 0) {
        serials.delete(serial)
        paramMap.delete(serial)
      }
    }
  }
}

const queueCall = (settings, state, args, topListener, retryCt = 0) => {
  const thisListener = (err, data) => {
    if (err) {
      if (settings.retryCt > retryCt) {
        queueCall(settings, state, args, topListener, ++retryCt)
      } else {
        topListener(err, null)
      }
    } else {
      topListener(null, data)
    }
  }
  const params = { method: args.method, options: { ...args.options } }
  const serial = JSON.stringify(normalize(params))
  const type = state.limiter.getType(params.method)
  state.fromSerial.set(serial, params)
  if (!state.threads.has(type)) {
    state.threads.set(type, new Map([[serial, new Set([thisListener])]]))
  } else if (!state.threads.get(type).has(serial)) {
    state.threads.get(type).set(serial, new Set([thisListener]))
  } else {
    state.threads.get(type).get(serial).add(thisListener)
  }
  if (state.threads.get(type).size === 1) {
    const serials = state.threads.get(type)
    processCalls(settings, type, serials, state.fromSerial, state.limiter)
      .then(() => state.threads.delete(type))
      .catch(err => thisListener(err, null))
  }
}

const parseArgs = (settings, method, options, cb) => {
  const isPub = method => settings.pubMethods.includes(method)
  const isPriv = method => settings.privMethods.includes(method)

  if (!isPub(method) && !isPriv(method)) throw Error('Invalid method')
  if (options instanceof Function) cb = options
  if (!options || options.constructor !== Object) options = {}

  return { method, options, cb }
}

module.exports = (settings, limiter) => {
  const state = {
    settings,
    limiter,
    threads: new Map(),
    fromSerial: new Map()
  }

  return (method, options, cb) => {
    const args = parseArgs(settings, method, options, cb)

    const op = new Promise(
      (resolve, reject) => {
        const topListener = (err, data) => err ? reject(err) : resolve(data)
        queueCall(settings, state, args, topListener)
      }
    )

    if (!(cb instanceof Function)) return op
    else op.then(data => cb(null, data)).catch(err => cb(err, null))
  }
}
