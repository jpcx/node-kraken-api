/**
 * @author Justin Collier <jpcxme@gmail.com>
 * @license MIT
 * @see {@link http://github.com/jpcx/node-kraken-api|GitHub}
 */

'use strict'

const parseNested = require('../../tools/parseNested.js')
const defaultParseSettings = { numbers: true, dates: true }

test('Is function', () => expect(parseNested.constructor).toBe(Function))

test('Parses objects successfully', () => {
  const obj = {
    foo: '2018-05-27T15:58:53.568Z',
    bar: {
      baz: '1325.32'
    }
  }

  const parsedObj = {
    foo: 1527436733568,
    bar: {
      baz: 1325.32
    }
  }

  expect(parseNested(defaultParseSettings, obj)).toEqual(parsedObj)
})

test('Parses arrays successfully', () => {
  const arr = [
    '2018-05-27T15:58:53.568Z',
    [
      '1325.32'
    ]
  ]

  const parsedArr = [
    1527436733568,
    [
      1325.32
    ]
  ]
  
  expect(parseNested(defaultParseSettings, arr)).toEqual(parsedArr)
})