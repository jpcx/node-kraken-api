# Settings

Contains types specific to execution settings.

__Properties:__

| Name | Type | Description |
| --- | --- | --- |
| `ParseSettings` | [module:Settings/ParseSettings](module-Settings_Parsehttps://github.com/jpcx/node-kraken-api/blob/0.4.1/docs/namespaces/Settings.md) | Parses user-provided settings, throws errors if necessary, and combines with defaults. |

Source:

* [node-kraken-api/settings/settings.jsdoc](https://github.com/jpcx/node-kraken-api/blob/0.4.1/settings/settings.jsdoc), [line 7](https://github.com/jpcx/node-kraken-api/blob/0.4.1/settings/settings.jsdoc#L7)

## Type Definitions

<a name="~Config"></a>

### Config

Contains execution settings configuration for API operations.

__Type:__

* Object

__Properties:__

| Name | Type | Attributes | Default | Description |
| --- | --- | --- | --- | --- |
| `key` | [Kraken~Key](https://github.com/jpcx/node-kraken-api/blob/0.4.1/docs/namespaces/Kraken.md#~Key) | \<optional> | '' | API key. |
| `secret` | [Kraken~Secret](https://github.com/jpcx/node-kraken-api/blob/0.4.1/docs/namespaces/Kraken.md#~Secret) | \<optional> | '' | API secret. |
| `tier` | [Kraken~Tier](https://github.com/jpcx/node-kraken-api/blob/0.4.1/docs/namespaces/Kraken.md#~Tier) | \<optional> | 0 | Verification tier. |
| `otp` | [Kraken~OTP](https://github.com/jpcx/node-kraken-api/blob/0.4.1/docs/namespaces/Kraken.md#~OTP) | \<optional> | null | Two factor password. |
| `timeout` | [API\~Calls~Timeout](https://github.com/jpcx/node-kraken-api/blob/0.4.1/docs/namespaces/API/Calls.md#~Timeout) | \<optional> | 5000 | Response timeout in ms. |
| `retryct` | [API\~Calls~RetryCount](https://github.com/jpcx/node-kraken-api/blob/0.4.1/docs/namespaces/API/Calls.md#~RetryCount) | \<optional> | 3 | Maximum number of times to automatically retry a call after an error. |
| `hostname` | [Kraken~Hostname](https://github.com/jpcx/node-kraken-api/blob/0.4.1/docs/namespaces/Kraken.md#~Hostname) | \<optional> | 'api.kraken.com' | Hostname of the Kraken API endpoint. |
| `version` | [Kraken~Version](https://github.com/jpcx/node-kraken-api/blob/0.4.1/docs/namespaces/Kraken.md#~Version) | \<optional> | 0 | Kraken API version. |
| `pubMethods` | [Kraken~PublicMethods](https://github.com/jpcx/node-kraken-api/blob/0.4.1/docs/namespaces/Kraken.md#~PublicMethods) | \<optional> | \[ 'Time', 'Assets','AssetPairs', 'Ticker','OHLC', 'Depth', 'Trades', 'Spread' \] | API methods available for public users. |
| `privMethods` | [Kraken~PrivateMethods](https://github.com/jpcx/node-kraken-api/blob/0.4.1/docs/namespaces/Kraken.md#~PrivateMethods) | \<optional> | \[ 'Balance', 'TradeBalance', 'OpenOrders', 'ClosedOrders', 'QueryOrders', 'TradesHistory', 'QueryTrades', 'OpenPositions', 'Ledgers', 'QueryLedgers', 'TradeVolume', 'AddOrder', 'CancelOrder', 'DepositMethods', 'DepositAddresses', 'DepositStatus', 'WithdrawInfo', 'Withdraw', 'WithdrawStatus', 'WithdrawCancel' \] | API methods available for authenticated users. |
| `parse` | [Tools~ParseNestedConfig](https://github.com/jpcx/node-kraken-api/blob/0.4.1/docs/namespaces/Tools.md#~ParseNestedConfig) | \<optional> | { numbers: true, dates: true } | Response parser settings. |
| `limiter` | [Settings~RateLimiter](https://github.com/jpcx/node-kraken-api/blob/0.4.1/docs/namespaces/Settings.md#~RateLimiter) | \<optional> | { baseIntvl: 500, minIntvl: 250 } | Settings for call interval limitations. |
| `syncIntervals` | [Settings~SyncIntervals](https://github.com/jpcx/node-kraken-api/blob/0.4.1/docs/namespaces/Settings.md#~SyncIntervals) | \<optional> | { Time: 2000, Assets: 2000, AssetPairs: 2000, Ticker: 2000, OHLC: 60000, Depth: 2000, Trades: 2000, Spread: 2000 } |  |
| `dataFormatter` | [Settings~DataFormatter](https://github.com/jpcx/node-kraken-api/blob/0.4.1/docs/namespaces/Settings.md#~DataFormatter) | \<optional> | null | Function for response data formatting (post-parsing, if enabled). |

Source:

* [node-kraken-api/settings/settings.jsdoc](https://github.com/jpcx/node-kraken-api/blob/0.4.1/settings/settings.jsdoc), [line 14](https://github.com/jpcx/node-kraken-api/blob/0.4.1/settings/settings.jsdoc#L14)

<a name="~DataFormatter"></a>

### DataFormatter(method, options, data) → \{*}

Formats response data (post-parsing, if enabled). Anything returned from this function is returned as the call response; returning nothing will result in the call to respond with `undefined`.

__Parameters:__

| Name | Type | Description |
| --- | --- | --- |
| `method` | [Kraken~Method](https://github.com/jpcx/node-kraken-api/blob/0.4.1/docs/namespaces/Kraken.md#~Method) | Method being called. |
| `options` | [Kraken~Options](https://github.com/jpcx/node-kraken-api/blob/0.4.1/docs/namespaces/Kraken.md#~Options) | Method-specific options. |
| `data` | [API\~Calls~CallData](https://github.com/jpcx/node-kraken-api/blob/0.4.1/docs/namespaces/API/Calls.md#~CallData) | Data received from call (post-parsing, if enabled). |

Source:

* [node-kraken-api/settings/settings.jsdoc](https://github.com/jpcx/node-kraken-api/blob/0.4.1/settings/settings.jsdoc), [line 49](https://github.com/jpcx/node-kraken-api/blob/0.4.1/settings/settings.jsdoc#L49)

__Returns:__

Formatted data.

___Type:___

* \*

<a name="~RateLimiter"></a>

### RateLimiter

Limits calls frequency. Call frequency begins at base and is gradually reduced to minimum if no violations are triggered.

__Type:__

* Object

__Properties:__

| Name | Type | Description |
| --- | --- | --- |
| `baseIntvl` | number | Default call interval. |
| `minIntvl` | number | Minimum call interval. |

Source:

* [node-kraken-api/settings/settings.jsdoc](https://github.com/jpcx/node-kraken-api/blob/0.4.1/settings/settings.jsdoc), [line 34](https://github.com/jpcx/node-kraken-api/blob/0.4.1/settings/settings.jsdoc#L34)

<a name="~SyncIntervals"></a>

### SyncIntervals

Defines default method intervals for sync updates. Intervals may be set here or via each sync instance individually.

__Type:__

* Object

__Properties:__

| Name | Type | Description |
| --- | --- | --- |
| `*` | number | Name of [Kraken~Method](https://github.com/jpcx/node-kraken-api/blob/0.4.1/docs/namespaces/Kraken.md#~Method) and default interval (in ms). |

Source:

* [node-kraken-api/settings/settings.jsdoc](https://github.com/jpcx/node-kraken-api/blob/0.4.1/settings/settings.jsdoc), [line 42](https://github.com/jpcx/node-kraken-api/blob/0.4.1/settings/settings.jsdoc#L42)

___

## [Home](https://github.com/jpcx/node-kraken-api/blob/0.4.1/README.md)

* [node-kraken-api](https://github.com/jpcx/node-kraken-api/blob/0.4.1/docs/modules/node-kraken-api.md)
  * [API](https://github.com/jpcx/node-kraken-api/blob/0.4.1/docs/namespaces/API.md)
    * [Calls](https://github.com/jpcx/node-kraken-api/blob/0.4.1/docs/namespaces/API/Calls.md)
      * [GenRequestData](https://github.com/jpcx/node-kraken-api/blob/0.4.1/docs/modules/API/Calls/GenRequestData.md)
      * [LoadCall](https://github.com/jpcx/node-kraken-api/blob/0.4.1/docs/modules/API/Calls/LoadCall.md)
      * [SignRequest](https://github.com/jpcx/node-kraken-api/blob/0.4.1/docs/modules/API/Calls/SignRequest.md)
    * [RateLimits](https://github.com/jpcx/node-kraken-api/blob/0.4.1/docs/namespaces/API/RateLimits.md)
      * [LoadLimiter](https://github.com/jpcx/node-kraken-api/blob/0.4.1/docs/modules/API/RateLimits/LoadLimiter.md)
    * [Syncing](https://github.com/jpcx/node-kraken-api/blob/0.4.1/docs/namespaces/API/Syncing.md)
      * [LoadSync](https://github.com/jpcx/node-kraken-api/blob/0.4.1/docs/modules/API/Syncing/LoadSync.md)
  * [Settings](https://github.com/jpcx/node-kraken-api/blob/0.4.1/docs/namespaces/Settings.md)
    * [ParseSettings](https://github.com/jpcx/node-kraken-api/blob/0.4.1/docs/modules/Settings/ParseSettings.md)
  * [Tools](https://github.com/jpcx/node-kraken-api/blob/0.4.1/docs/namespaces/Tools.md)
    * [AlphabetizeNested](https://github.com/jpcx/node-kraken-api/blob/0.4.1/docs/modules/Tools/AlphabetizeNested.md)
    * [ParseNested](https://github.com/jpcx/node-kraken-api/blob/0.4.1/docs/modules/Tools/ParseNested.md)
  * [Kraken](https://github.com/jpcx/node-kraken-api/blob/0.4.1/docs/namespaces/Kraken.md)