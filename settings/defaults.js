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
  orderMethods: [ 'AddOrder', 'CancelOrder' ],
  parse: {
    numbers: true,
    dates: true
  },
  rateLimiter: {
    public: true,
    private: true,
    minOrderFrequency: 1000,
    minViolationRetry: 4500,
    getCounterLimit: tier => tier >= 3 ? 20 : 15,
    getCounterIntvl: tier => tier === 4 ? 1000 : tier === 3 ? 2000 : 3000,
    getIncrementAmt: method => (
      method === 'Ledgers' || method === 'TradesHistory'
        ? 2
        : method === 'AddOrder' || method === 'CancelOrder'
          ? 0
          : 1
    )
  }
})
