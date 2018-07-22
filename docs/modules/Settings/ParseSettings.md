# Module: Settings/ParseSettings

Parses settings input, checks for bad values, and combines with defaults.

__Parameters:__

| Name | Type | Description |
| --- | --- | --- |
| `settings` | [Settings~Config](https://github.com/jpcx/node-kraken-api/blob/0.4.1/docs/namespaces/Settings.md#~Config) | Current supplied custom settings configuration. |

Source:

* [node-kraken-api/settings/parseSettings.js](https://github.com/jpcx/node-kraken-api/blob/0.4.1/settings/parseSettings.js), [line 13](https://github.com/jpcx/node-kraken-api/blob/0.4.1/settings/parseSettings.js#L13)

__Throws:__

Throws an error if a setting is not of an acceptable type or range.

___Type:___

* TypeError | RangeError

__Returns:__

Parsed settings.

___Type:___

* [Settings~Config](https://github.com/jpcx/node-kraken-api/blob/0.4.1/docs/namespaces/Settings.md#~Config)

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