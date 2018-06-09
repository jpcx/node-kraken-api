# Settings

Contains types specific to execution settings.

##### Properties:

| Name | Type | Description |
| --- | --- | --- |
| `defaults` | [module:Settings/defaults](https://github.com/jpcx/node-kraken-api/blob/develop/docs/modules/Settings/defaults.md) | Default execution settings. |

Source:

*   [node-kraken-api/settings/settings.jsdoc](https://github.com/jpcx/node-kraken-api/blob/develop/settings/settings.jsdoc), [line 7](https://github.com/jpcx/node-kraken-api/blob/develop/settings/settings.jsdoc#L7)

### Type Definitions

<a name="~Config"></a>
#### Config

Contains execution settings configuration for API operations.

##### Type:

*   Object

##### Properties:

| Name | Type | Attributes | Default | Description |
| --- | --- | --- | --- | --- |
| `key` | [Kraken~Key](https://github.com/jpcx/node-kraken-api/blob/develop/docs/namespaces/Kraken.md#~Key) | \<optional> | '' | API key. |
| `secret` | [Kraken~Secret](https://github.com/jpcx/node-kraken-api/blob/develop/docs/namespaces/Kraken.md#~Secret) | \<optional> | '' | API secret. |
| `tier` | [Kraken~Tier](https://github.com/jpcx/node-kraken-api/blob/develop/docs/namespaces/Kraken.md#~Tier) | \<optional> | 0 | Verification tier. |
| `timeout` | [API\~Calls~Timeout](https://github.com/jpcx/node-kraken-api/blob/develop/docs/namespaces/API/Calls.md#~Timeout) | \<optional> | 5000 | Response timeout in ms. |
| `version` | [Kraken~Version](https://github.com/jpcx/node-kraken-api/blob/develop/docs/namespaces/Kraken.md#~Version) | \<optional> | 0 | Kraken API version. |
| `pubMethods` | [Kraken~PublicMethods](https://github.com/jpcx/node-kraken-api/blob/develop/docs/namespaces/Kraken.md#~PublicMethods) | \<optional> | Set{ 'Time', 'Assets','AssetPairs', 'Ticker','OHLC', 'Depth', 'Trades', 'Spread' } | API methods available for public users. |
| `privMethods` | [Kraken~PrivateMethods](https://github.com/jpcx/node-kraken-api/blob/develop/docs/namespaces/Kraken.md#~PrivateMethods) | \<optional> | Set{ 'Balance', 'TradeBalance', 'OpenOrders', 'ClosedOrders', 'QueryOrders', 'TradesHistory', 'QueryTrades', 'OpenPositions', 'Ledgers', 'QueryLedgers', 'TradeVolume', 'AddOrder', 'CancelOrder', 'DepositMethods', 'DepositAddresses', 'DepositStatus', 'WithdrawInfo', 'Withdraw', 'WithdrawStatus', 'WithdrawCancel' } | API methods available for authenticated users. |
| `parse` | [Settings~Parse](https://github.com/jpcx/node-kraken-api/blob/develop/docs/namespaces/Settings.md#~Parse) | \<optional> | { numbers: true, dates: true } | Response parser settings. |
| `rateLimiter` | [Settings~RateLimiter](https://github.com/jpcx/node-kraken-api/blob/develop/docs/namespaces/Settings.md#~RateLimiter) | \<optional> | { use: true, getCounterLimit: tier => tier >= 3 ? 20 : 15, getCounterIntvl: tier => tier === 4 ? 1000 : tier === 3 ? 2000 : 3000, getIncrementAmt: method => ( method === 'Ledgers' || method === 'TradesHistory' ? 2 : method === 'AddOrder' || method === 'CancelOrder' ? 0 : 1 ), limitOrderOps: true, isOrderOp: method => method === 'AddOrder' || method === 'CancelOrder' } | Limits call frequency. |

Source:

*   [node-kraken-api/settings/settings.jsdoc](https://github.com/jpcx/node-kraken-api/blob/develop/settings/settings.jsdoc), [line 14](https://github.com/jpcx/node-kraken-api/blob/develop/settings/settings.jsdoc#L14)

<a name="~GetCounterIntvl"></a>
#### GetCounterIntvl(tier) → \{Kraken~CounterInterval}

Determines counter countdown interval given a tier.

##### Parameters:

| Name | Type | Description |
| --- | --- | --- |
| `tier` | [Kraken~Tier](https://github.com/jpcx/node-kraken-api/blob/develop/docs/namespaces/Kraken.md#~Tier) | Verification tier. |

Source:

*   [node-kraken-api/settings/settings.jsdoc](https://github.com/jpcx/node-kraken-api/blob/develop/settings/settings.jsdoc), [line 45](https://github.com/jpcx/node-kraken-api/blob/develop/settings/settings.jsdoc#L45)

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
| `tier` | [Kraken~Tier](https://github.com/jpcx/node-kraken-api/blob/develop/docs/namespaces/Kraken.md#~Tier) | Verification tier. |

Source:

*   [node-kraken-api/settings/settings.jsdoc](https://github.com/jpcx/node-kraken-api/blob/develop/settings/settings.jsdoc), [line 37](https://github.com/jpcx/node-kraken-api/blob/develop/settings/settings.jsdoc#L37)

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
| `method` | [Kraken~Method](https://github.com/jpcx/node-kraken-api/blob/develop/docs/namespaces/Kraken.md#~Method) | Method being called. |

Source:

*   [node-kraken-api/settings/settings.jsdoc](https://github.com/jpcx/node-kraken-api/blob/develop/settings/settings.jsdoc), [line 53](https://github.com/jpcx/node-kraken-api/blob/develop/settings/settings.jsdoc#L53)

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
| `method` | [Kraken~Method](https://github.com/jpcx/node-kraken-api/blob/develop/docs/namespaces/Kraken.md#~Method) | Method being called. |

Source:

*   [node-kraken-api/settings/settings.jsdoc](https://github.com/jpcx/node-kraken-api/blob/develop/settings/settings.jsdoc), [line 61](https://github.com/jpcx/node-kraken-api/blob/develop/settings/settings.jsdoc#L61)

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
| `dates` | boolean | Converts date strings, seconds, and microseconds to milliseconds using the ranged-date module. |

Source:

*   [node-kraken-api/settings/settings.jsdoc](https://github.com/jpcx/node-kraken-api/blob/develop/settings/settings.jsdoc), [line 29](https://github.com/jpcx/node-kraken-api/blob/develop/settings/settings.jsdoc#L29)

<a name="~RateLimiter"></a>
#### RateLimiter

Limits call frequency.

##### Type:

*   Object

##### Properties:

| Name | Type | Description |
| --- | --- | --- |
| `use` | boolean | Whether or not to enable rate-limiting. |
| `getCounterLimit` | [Settings~GetCounterLimit](https://github.com/jpcx/node-kraken-api/blob/develop/docs/namespaces/Settings.md#~GetCounterLimit) | Rules for determining counter limit from tier. |
| `getCounterIntvl` | [Settings~GetCounterIntvl](https://github.com/jpcx/node-kraken-api/blob/develop/docs/namespaces/Settings.md#~GetCounterIntvl) | Rules for determining counter interval from tier. |
| `getIncrementAmt` | [Settings~GetIncrementAmt](https://github.com/jpcx/node-kraken-api/blob/develop/docs/namespaces/Settings.md#~GetIncrementAmt) | Rules for determining increment amount from method. |
| `limitOrderOps` | boolean | Whether or not to limit order operations to 1 hz. |
| `isOrderOp` | [Settings~IsOrderOp](https://github.com/jpcx/node-kraken-api/blob/develop/docs/namespaces/Settings.md#~IsOrderOp) | Rules for determining methods which should be limited to 1 hz. |

Source:

*   [node-kraken-api/settings/settings.jsdoc](https://github.com/jpcx/node-kraken-api/blob/develop/settings/settings.jsdoc), [line 69](https://github.com/jpcx/node-kraken-api/blob/develop/settings/settings.jsdoc#L69)

<hr>

## [Home](https://github.com/jpcx/node-kraken-api/blob/develop/README.md)
  + [node-kraken-api](https://github.com/jpcx/node-kraken-api/blob/develop/docs/modules/node-kraken-api.md)
  + [API](https://github.com/jpcx/node-kraken-api/blob/develop/docs/namespaces/API.md)
    + [Calls](https://github.com/jpcx/node-kraken-api/blob/develop/docs/namespaces/API/Calls.md)
      + [genRequestData](https://github.com/jpcx/node-kraken-api/blob/develop/docs/modules/API/Calls/genRequestData.md)
      + [loadCall](https://github.com/jpcx/node-kraken-api/blob/develop/docs/modules/API/Calls/loadCall.md)
      + [signRequest](https://github.com/jpcx/node-kraken-api/blob/develop/docs/modules/API/Calls/signRequest.md)
    + [RateLimits](https://github.com/jpcx/node-kraken-api/blob/develop/docs/namespaces/API/RateLimits.md)
      + [limiter](https://github.com/jpcx/node-kraken-api/blob/develop/docs/modules/API/RateLimits/limiter.md)
    + [Schedules](https://github.com/jpcx/node-kraken-api/blob/develop/docs/namespaces/API/Schedules.md)
      + [loadSchedule](https://github.com/jpcx/node-kraken-api/blob/develop/docs/modules/API/Schedules/loadSchedule.md)
  + [Settings](https://github.com/jpcx/node-kraken-api/blob/develop/docs/namespaces/Settings.md)
    + [defaults](https://github.com/jpcx/node-kraken-api/blob/develop/docs/modules/Settings/defaults.md)
  + [Tools](https://github.com/jpcx/node-kraken-api/blob/develop/docs/namespaces/Tools.md)
    + [ms](https://github.com/jpcx/node-kraken-api/blob/develop/docs/modules/Tools/ms.md)
    + [parseNested](https://github.com/jpcx/node-kraken-api/blob/develop/docs/modules/Tools/parseNested.md)
    + [readFileJSON](https://github.com/jpcx/node-kraken-api/blob/develop/docs/modules/Tools/readFileJSON.md)
    + [tryDirectory](https://github.com/jpcx/node-kraken-api/blob/develop/docs/modules/Tools/tryDirectory.md)
    + [writeFileJSON](https://github.com/jpcx/node-kraken-api/blob/develop/docs/modules/Tools/writeFileJSON.md)
  + [Kraken](https://github.com/jpcx/node-kraken-api/blob/develop/docs/namespaces/Kraken.md)