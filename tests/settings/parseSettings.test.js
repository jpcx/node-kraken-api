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
      baseIntvl: 0,
      minIntvl: 0,
      pileUpWindow: 0,
      pileUpThreshold: 2,
      pileUpResetIntvl: 0,
      pileUpMultiplier: 1.01,
      violationResetIntvl: 0,
      violationMultiplier: 1.01,
      anyPassDecay: 0.999,
      specificPassDecay: 0.999
    },
    syncIntervals: { Time: 32, Assets: 2023500, AssetPairs: 3, Ticker: 31, OHLC: 555, Depth: 333, Trades: 135, Spread: 531 }
  }
  expect(parseSettings(customSettings)).toEqual(customSettings)
})

test('Throws errors correctly', () => {
  const stringErrors = [{ key: 42 }, { secret: 42 }, { hostname: 42 }]
  const booleanErrors = [
    { parse: { numbers: 'not a boolean' } }, { parse: { dates: 'also not'} }
  ]
  const stringOrNumberErrors = [ { otp: Date } ]
  const arrayOfStringErrors = [
    { pubMethods: 3 }, { pubMethods: [3] },
    { privMethods: 3 }, { privMethods: [3] }
  ]
  const zeroErrors = [
    { tier: -1 }, { timeout: -1 }, { retryCt: -1 }, { version: -1 },
    { limiter: { baseIntvl: -1 } }, { limiter: { minIntvl: -1 } },
    { limiter: { pileUpWindow: -1 } }, { limiter: { pileUpResetIntvl: -1 } },
    { limiter: { violationResetIntvl: -1 } }, { syncIntervals: { Time: -1 } },
    { syncIntervals: { Assets: -1 } }, { syncIntervals: { AssetPairs: -1 } },
    { syncIntervals: { Ticker: -1 } }, { syncIntervals: { OHLC: -1 } },
    { syncIntervals: { Depth: -1 } }, { syncIntervals: { Trades: -1 } },
    { syncIntervals: { Spread: -1 } }
  ]
  const greaterOneErrors = [
    { limiter: { pileUpThreshold: 1 } }, { limiter: { pileUpMultiplier: 1 } },
    { limiter: { violationMultiplier: 1 } }
  ]
  const betweenZeroOneErrors = [
    { limiter: { anyPassDecay: 0 } }, { limiter: { specificPassDecay: 0 } }
  ]
  stringErrors.forEach(
    x => {
      try {
        expect(parseSettings(x)).toBeUndefined()
      } catch (err) {
        expect(err.constructor).toBe(TypeError)
        expect(err.message).toMatch(/must be string/gi)
      }
    }
  )
  booleanErrors.forEach(
    x => {
      try {
        expect(parseSettings(x)).toBeUndefined()
      } catch (err) {
        expect(err.constructor).toBe(TypeError)
        expect(err.message).toMatch(/must be boolean/gi)
      }
    }
  )
  stringOrNumberErrors.forEach(
    x => {
      try {
        expect(parseSettings(x)).toBeUndefined()
      } catch (err) {
        expect(err.constructor).toBe(TypeError)
        expect(err.message).toMatch(/must be a string or a number/gi)
      }
    }
  )
  arrayOfStringErrors.forEach(
    x => {
      try {
        expect(parseSettings(x)).toBeUndefined()
      } catch (err) {
        expect(err.constructor).toBe(TypeError)
        expect(err.message).toMatch(/must be an array of strings/gi)
      }
    }
  )
  zeroErrors.forEach(
    x => {
      try {
        expect(parseSettings(x)).toBeUndefined()
      } catch (err) {
        expect(err.constructor).toBe(RangeError)
        expect(err.message).toMatch(/must be >= 0/gi)
      }
    }
  )
  greaterOneErrors.forEach(
    x => {
      try {
        expect(parseSettings(x)).toBeUndefined()
      } catch (err) {
        expect(err.constructor).toBe(RangeError)
        expect(err.message).toMatch(/must be > 1/gi)
      }
    }
  )
  betweenZeroOneErrors.forEach(
    x => {
      try {
        expect(parseSettings(x)).toBeUndefined()
      } catch (err) {
        expect(err.constructor).toBe(RangeError)
        expect(err.message).toMatch(/must be between 0 and 1/gi)
      }
    }
  )
})