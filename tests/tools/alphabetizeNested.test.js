/**
 * @author Justin Collier <jpcxme@gmail.com>
 * @license MIT
 * @see {@link http://github.com/jpcx/node-kraken-api|GitHub}
 */

'use strict'

const alphabetizeNested = require('../../tools/alphabetizeNested.js')

test('Alphabetizes different arrangements of the same values', () => {

  const sortA = alphabetizeNested({
    aaa: {
      aaa: 'foo',
      aab: 'foobar'
    },
    aab: {
      aaa: 'bar',
      aab: 'barbaz'
    },
    aac: {
      aaa: 'baz',
      aab: 'bazbeh',
      aac: {
        boo: 'bleh'
      }
    }
  })

  const sortB = alphabetizeNested({
    aaa: {
      aab: 'foobar',
      aaa: 'foo'
    },
    aac: {
      aaa: 'baz',
      aac: {
        boo: 'bleh'
      },
      aab: 'bazbeh'
    },
    aab: {
      aab: 'barbaz',
      aaa: 'bar'
    }
  })

  expect(JSON.stringify(sortA)).toBe(JSON.stringify(sortB))
})