/**
 * @author Justin Collier <jpcxme@gmail.com>
 * @license MIT
 * @see {@link http://github.com/jpcx/node-kraken-api|GitHub}
 */

'use strict'

const fs = require('fs')
const readFileJSON = require('../../tools/readFileJSON.js')
const writeFileJSON = require('../../tools/writeFileJSON.js')

test('Is function', () => expect(writeFileJSON.constructor).toBe(Function))

test('Writes dummy file', async() => {
  const dummy = {
    foo: 'bar'
  }
  await writeFileJSON('/tests/~tmp/foo/bar.json', dummy)
  expect(await readFileJSON('/tests/~tmp/foo/bar.json')).toEqual(dummy)
  fs.unlinkSync(process.cwd() + '/tests/~tmp/foo/bar.json')
  fs.rmdirSync(process.cwd() + '/tests/~tmp/foo')
  fs.rmdirSync(process.cwd() + '/tests/~tmp')
})