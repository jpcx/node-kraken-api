const parseSettings = require('../../settings/parseSettings.js')
const defaults = require('../../settings/defaults.json')

test('Returns default settings', () => {
  const parsed = parseSettings({})
  expect(parsed).toEqual(defaults)
})

test('Fills with custom settings', () => {
  const customSettings = {
    key: 'foo',
    secret: 'bar',
    tier: 1,
    otp: 328553,
    timeout: 5500,
    retryCt: 8,
    hostname: 'api.test.com',
    version: 3,
    pubMethods: ['foo', 'bar'],
    privMethods: ['food', 'bar'],
    parse: { numbers: false, dates: false },
    limiter: {
      baseIntvl: 3000,
      minIntvl: 2000
    },
    syncIntervals: { Time: 32, Assets: 2023500, AssetPairs: 3, Ticker: 31, OHLC: 555, Depth: 333, Trades: 135, Spread: 531 },
    dataFormatter: Array
  }
  expect(parseSettings(customSettings)).toEqual(customSettings)
})

test('Throws errors correctly', () => {
  const stringE = [{ key: 42 }, { secret: 42 }, { hostname: 42 }]
  const booleanE = [
    { parse: { numbers: 'not a boolean' } }, { parse: { dates: 'also not'} }
  ]
  const nullOrStringOrNumberE = [{ otp: Date }]
  const arrayOfStringE = [
    { pubMethods: 3 }, { pubMethods: [3] },
    { privMethods: 3 }, { privMethods: [3] }
  ]
  const nullOrFunctionE = [{ dataFormatter: 'yay' }]
  const greaterZeroE = [{ timeout: 0 }]
  const zeroE = [
    { tier: -1 }, { retryCt: -1 }, { version: -1 },
    { limiter: { baseIntvl: -1 } }, { limiter: { minIntvl: -1 } },
    { syncIntervals: { Time: -1 } }, { syncIntervals: { Assets: -1 } },
    { syncIntervals: { AssetPairs: -1 } }, { syncIntervals: { Ticker: -1 } },
    { syncIntervals: { OHLC: -1 } }, { syncIntervals: { Depth: -1 } },
    { syncIntervals: { Trades: -1 } }, { syncIntervals: { Spread: -1 } }
  ]
  stringE.forEach(
    x => {
      try {
        expect(parseSettings(x)).toBeUndefined()
      } catch (err) {
        expect(err.constructor).toBe(TypeError)
        expect(err.message).toMatch(/must be string/gi)
      }
    }
  )
  booleanE.forEach(
    x => {
      try {
        expect(parseSettings(x)).toBeUndefined()
      } catch (err) {
        expect(err.constructor).toBe(TypeError)
        expect(err.message).toMatch(/must be boolean/gi)
      }
    }
  )
  nullOrStringOrNumberE.forEach(
    x => {
      try {
        expect(parseSettings(x)).toBeUndefined()
      } catch (err) {
        expect(err.constructor).toBe(TypeError)
        expect(err.message).toMatch(/must be null, a string, or a number/gi)
      }
    }
  )
  arrayOfStringE.forEach(
    x => {
      try {
        expect(parseSettings(x)).toBeUndefined()
      } catch (err) {
        expect(err.constructor).toBe(TypeError)
        expect(err.message).toMatch(/must be an array of strings/gi)
      }
    }
  )
  nullOrFunctionE.forEach(
    x => {
      try {
        expect(parseSettings(x)).toBeUndefined()
      } catch (err) {
        expect(err.constructor).toBe(TypeError)
        expect(err.message).toMatch(/must be a function or null/gi)
      }
    }
  )
  greaterZeroE.forEach(
    x => {
      try {
        expect(parseSettings(x)).toBeUndefined()
      } catch (err) {
        expect(err.constructor).toBe(RangeError)
        expect(err.message).toMatch(/must be > 0/gi)
      }
    }
  )
  zeroE.forEach(
    x => {
      try {
        expect(parseSettings(x)).toBeUndefined()
      } catch (err) {
        expect(err.constructor).toBe(RangeError)
        expect(err.message).toMatch(/must be >= 0/gi)
      }
    }
  )
})