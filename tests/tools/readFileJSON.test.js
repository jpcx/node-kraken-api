/**
 * @author Justin Collier <jpcxme@gmail.com>
 * @license MIT
 * @see {@link http://github.com/jpcx/node-kraken-api|GitHub}
 */

'use strict'

const fs = require('fs')
const readFileJSON = require('../../tools/readFileJSON.js')

test('Is function', () => {
  expect(readFileJSON.constructor).toBe(Function)
})

test('Returns object', async() => {
  expect(
    (await readFileJSON('/tests/~tmp/foo/bar.json')).constructor
  ).toBe(Object)
  fs.unlinkSync(process.cwd() + '/tests/~tmp/foo/bar.json')
  fs.rmdirSync(process.cwd() + '/tests/~tmp/foo')
  fs.rmdirSync(process.cwd() + '/tests/~tmp')
})

test('Reads dummy data', async() => {
  try {
    fs.accessSync(process.cwd() + '/tests/~tmp')
  } catch (e) {
    fs.mkdirSync(process.cwd() + '/tests/~tmp')
  }
  try {
    fs.accessSync(process.cwd() + '/tests/~tmp/foo')
  } catch (e) {
    fs.mkdirSync(process.cwd() + '/tests/~tmp/foo')
  }
  const dummy = {
    foo: 'bar'
  }
  fs.writeFileSync(
    process.cwd() + '/tests/~tmp/foo/bar.json',
    JSON.stringify(dummy, null, 2),
    'utf8'
  )
  expect(await readFileJSON('/tests/~tmp/foo/bar.json')).toEqual(dummy)
  fs.unlinkSync(process.cwd() + '/tests/~tmp/foo/bar.json')
  fs.rmdirSync(process.cwd() + '/tests/~tmp/foo')
  fs.rmdirSync(process.cwd() + '/tests/~tmp')
})