# Settings

Contains types specific to execution settings.

##### Properties:

| Name | Type | Description |
| --- | --- | --- |
| `defaults` | [module:Settings/defaults](https://github.com/jpcx/node-kraken-api/blob/0.1.0/docs/modules/Settings/defaults.md) | Default execution settings. |

Source:

*   [settings/settings.jsdoc](settings_settings.jsdoc.html), [line 7](settings_settings.jsdoc.html#line7)

### Type Definitions

<a name="~Config"></a>
#### Config

Contains execution settings configuration for API operations.

##### Type:

*   Object

##### Properties:

| Name | Type | Attributes | Default | Description |
| --- | --- | --- | --- | --- |
| `key` | [Kraken~Key](https://github.com/jpcx/node-kraken-api/blob/0.1.0/docs/namespaces/Kraken.md#~Key) | \<optional> | '' | API key. |
| `secret` | [Kraken~Secret](https://github.com/jpcx/node-kraken-api/blob/0.1.0/docs/namespaces/Kraken.md#~Secret) | \<optional> | '' | API secret. |
| `tier` | [Kraken~Tier](https://github.com/jpcx/node-kraken-api/blob/0.1.0/docs/namespaces/Kraken.md#~Tier) | \<optional> | 0 | Verification tier. |
| `timeout` | [API\~Calls~Timeout](https://github.com/jpcx/node-kraken-api/blob/0.1.0/docs/namespaces/API/Calls.md#~Timeout) | \<optional> | 5000 | Response timeout in ms. |
| `version` | [Kraken~Version](https://github.com/jpcx/node-kraken-api/blob/0.1.0/docs/namespaces/Kraken.md#~Version) | \<optional> | 0 | Kraken API version. |
| `pubMethods` | [Kraken~PublicMethods](https://github.com/jpcx/node-kraken-api/blob/0.1.0/docs/namespaces/Kraken.md#~PublicMethods) | \<optional> | Set{ 'Time', 'Assets','AssetPairs', 'Ticker','OHLC', 'Depth', 'Trades', 'Spread' } | API methods available for public users. |
| `privMethods` | [Kraken~PrivateMethods](https://github.com/jpcx/node-kraken-api/blob/0.1.0/docs/namespaces/Kraken.md#~PrivateMethods) | \<optional> | Set{ 'Balance', 'TradeBalance', 'OpenOrders', 'ClosedOrders', 'QueryOrders', 'TradesHistory', 'QueryTrades', 'OpenPositions', 'Ledgers', 'QueryLedgers', 'TradeVolume', 'AddOrder', 'CancelOrder', 'DepositMethods', 'DepositAddresses', 'DepositStatus', 'WithdrawInfo', 'Withdraw', 'WithdrawStatus', 'WithdrawCancel' } | API methods available for authenticated users. |
| `parse` | [Settings~Parse](https://github.com/jpcx/node-kraken-api/blob/0.1.0/docs/namespaces/Settings.md#~Parse) | \<optional> | { numbers: true, dates: true } | Response parser settings. |
| `rateLimiter` | [Settings~RateLimiter](https://github.com/jpcx/node-kraken-api/blob/0.1.0/docs/namespaces/Settings.md#~RateLimiter) | \<optional> | { use: true, getCounterLimit: tier => tier >= 3 ? 20 : 15, getCounterIntvl: tier => tier === 4 ? 1000 : tier === 3 ? 2000 : 3000, getIncrementAmt: method => ( method === 'Ledgers' || method === 'TradesHistory' ? 2 : method === 'AddOrder' || method === 'CancelOrder' ? 0 : 1 ), limitOrderOps: true, isOrderOp: method => method === 'AddOrder' || method === 'CancelOrder' } | Limits call frequency. |

Source:

*   [settings/settings.jsdoc](settings_settings.jsdoc.html), [line 14](settings_settings.jsdoc.html#line14)

<a name="~GetCounterIntvl"></a>
#### GetCounterIntvl(tier) → \{Kraken~CounterInterval}

Determines counter countdown interval given a tier.

##### Parameters:

| Name | Type | Description |
| --- | --- | --- |
| `tier` | [Kraken~Tier](https://github.com/jpcx/node-kraken-api/blob/0.1.0/docs/namespaces/Kraken.md#~Tier) | Verification tier. |

Source:

*   [settings/settings.jsdoc](settings_settings.jsdoc.html), [line 45](settings_settings.jsdoc.html#line45)

##### Returns:

Counter interval.

Type

Kraken~CounterInterval

<a name="~GetCounterLimit"></a>
#### GetCounterLimit(tier) → \{Kraken~CounterLimit}

Determines counter limit given a tier.

##### Parameters:

| Name | Type | Description |
| --- | --- | --- |
| `tier` | [Kraken~Tier](https://github.com/jpcx/node-kraken-api/blob/0.1.0/docs/namespaces/Kraken.md#~Tier) | Verification tier. |

Source:

*   [settings/settings.jsdoc](settings_settings.jsdoc.html), [line 37](settings_settings.jsdoc.html#line37)

##### Returns:

Counter limit.

Type

Kraken~CounterLimit

<a name="~GetIncrementAmt"></a>
#### GetIncrementAmt(method) → \{Kraken~IncrementAmount}

Determines amount to increment counter depending on the method.

##### Parameters:

| Name | Type | Description |
| --- | --- | --- |
| `method` | [Kraken~Method](https://github.com/jpcx/node-kraken-api/blob/0.1.0/docs/namespaces/Kraken.md#~Method) | Method being called. |

Source:

*   [settings/settings.jsdoc](settings_settings.jsdoc.html), [line 53](settings_settings.jsdoc.html#line53)

##### Returns:

Amount to increment counter.

Type

Kraken~IncrementAmount

<a name="~IsOrderOp"></a>
#### IsOrderOp(method) → \{boolean}

Determines whether or not a method should be limited to 1 hz.

##### Parameters:

| Name | Type | Description |
| --- | --- | --- |
| `method` | [Kraken~Method](https://github.com/jpcx/node-kraken-api/blob/0.1.0/docs/namespaces/Kraken.md#~Method) | Method being called. |

Source:

*   [settings/settings.jsdoc](settings_settings.jsdoc.html), [line 61](settings_settings.jsdoc.html#line61)

##### Returns:

True if it should be limited, false if not.

Type

boolean

<a name="~Parse"></a>
#### Parse

Configures response parsing.

##### Type:

*   Object

##### Properties:

| Name | Type | Description |
| --- | --- | --- |
| `numbers` | boolean | Parses string numbers via unary plus. |
| `dates` | boolean | Converts date strings, seconds, and microseconds to milliseconds using the deep-props module. |

Source:

*   [settings/settings.jsdoc](settings_settings.jsdoc.html), [line 29](settings_settings.jsdoc.html#line29)

<a name="~RateLimiter"></a>
#### RateLimiter

Limits call frequency.

##### Type:

*   Object

##### Properties:

| Name | Type | Description |
| --- | --- | --- |
| `use` | boolean | Whether or not to enable rate-limiting. |
| `getCounterLimit` | [Settings~GetCounterLimit](https://github.com/jpcx/node-kraken-api/blob/0.1.0/docs/namespaces/Settings.md#~GetCounterLimit) | Rules for determining counter limit from tier. |
| `getCounterIntvl` | [Settings~GetCounterIntvl](https://github.com/jpcx/node-kraken-api/blob/0.1.0/docs/namespaces/Settings.md#~GetCounterIntvl) | Rules for determining counter interval from tier. |
| `getIncrementAmt` | [Settings~GetIncrementAmt](https://github.com/jpcx/node-kraken-api/blob/0.1.0/docs/namespaces/Settings.md#~GetIncrementAmt) | Rules for determining increment amount from method. |
| `limitOrderOps` | boolean | Whether or not to limit order operations to 1 hz. |
| `isOrderOp` | [Settings~IsOrderOp](https://github.com/jpcx/node-kraken-api/blob/0.1.0/docs/namespaces/Settings.md#~IsOrderOp) | Rules for determining methods which should be limited to 1 hz. |

Source:

*   [settings/settings.jsdoc](settings_settings.jsdoc.html), [line 69](settings_settings.jsdoc.html#line69)

<hr>

## [Home](https://github.com/jpcx/node-kraken-api/blob/0.1.0/README.md)