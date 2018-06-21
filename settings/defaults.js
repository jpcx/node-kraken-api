/**
 * @author Justin Collier <jpcxme@gmail.com>
 * @license MIT
 * @see {@link http://github.com/jpcx/node-kraken-api|GitHub}
 */

'use strict'

/**
 * Default execution settings configuration.
 *
 * @module   Settings/defaults
 * @property {Kraken~Key}               key          - API key.
 * @property {Kraken~Secret}            secret       - API secret.
 * @property {Kraken~Tier}              tier         - Verification tier.
 * @property {API~Calls~Timeout}        timeout      - Response timeout in ms.
 * @property {API~Calls~RetryCount}     retryCt      - Number of times to retry a failed call.
 * @property {Kraken~Hostname}          hostname     - Kraken hostname.
 * @property {Kraken~Version}           version      - Kraken API version.
 * @property {Kraken~PublicMethods}     pubMethods   - API methods available for public users.
 * @property {Kraken~PrivateMethods}    privMethods  - API methods available for authenticated users.
 * @property {Kraken~OrderMethods}      orderMethods - All methods directly related to order modification.
 * @property {Settings~Parse}           parse        - Response parser settings.
 * @property {Settings~RateLimiter}     rateLimiter  - Limits call frequency.
 */
module.exports = ({
  key: '',
  secret: '',
  tier: 0,
  timeout: 5000,
  retryCt: 3,
  hostname: 'api.kraken.com',
  version: 0,
  pubMethods: [
    'Time', 'Assets', 'AssetPairs', 'Ticker',
    'OHLC', 'Depth', 'Trades', 'Spread'
  ],
  privMethods: [
    'Balance', 'TradeBalance', 'OpenOrders', 'ClosedOrders',
    'QueryOrders', 'TradesHistory', 'QueryTrades', 'OpenPositions',
    'Ledgers', 'QueryLedgers', 'TradeVolume', 'AddOrder',
    'CancelOrder', 'DepositMethods', 'DepositAddresses', 'DepositStatus',
    'WithdrawInfo', 'Withdraw', 'WithdrawStatus', 'WithdrawCancel'
  ],
  parse: {
    numbers: true,
    dates: true
  },
  minCallFrequency: 400,
  rateLimiter: {
    use: true,
    minOrderFrequency: 1000,
    minViolationRetry: 4500
  }
})
