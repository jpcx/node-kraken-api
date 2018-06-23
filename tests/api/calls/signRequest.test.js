/**
 * @author Justin Collier <jpcxme@gmail.com>
 * @license MIT
 * @see {@link http://github.com/jpcx/node-kraken-api|GitHub}
 */

'use strict'

const signRequest = require('../../../api/calls/signRequest.js')
const defaults = require('../../../settings/defaults.json')

test('Is function', () => {
  expect(signRequest.constructor).toBe(Function)
})

test('Returns correct signature', () => {
  const expected = 'bFpuDbyjuZ9NsD+TaV4iZ0SHENR8stLSqMeUgYHaTOATUYkXPS8fH53M+o+hEqZDJGuM6M4JkfJ41gCT6LmhRg=='
  const data = signRequest(
    defaults.secret, undefined, '', '/0/public/Time'
  )
  expect(data).toEqual(expected)
})