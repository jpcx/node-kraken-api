# Module: API/Calls/LoadCall

Loads settings and limiter instance and generates a stateful call function.

__Parameters:__

| Name | Type | Description |
| --- | --- | --- |
| `settings` | [Settings~Config](https://github.com/jpcx/node-kraken-api/blob/0.4.1/docs/namespaces/Settings.md#~Config) | Execution settings configuration. |
| `limiter` | [API\~RateLimits~Functions](https://github.com/jpcx/node-kraken-api/blob/0.4.1/docs/namespaces/API/RateLimits.md#~Functions) | Limiter instance. |

Source:

* [node-kraken-api/api/calls/loadCall.js](https://github.com/jpcx/node-kraken-api/blob/0.4.1/api/calls/loadCall.js), [line 242](https://github.com/jpcx/node-kraken-api/blob/0.4.1/api/calls/loadCall.js#L242)

__Returns:__

Stateful call function.

___Type:___

* [API\~Calls~Call](https://github.com/jpcx/node-kraken-api/blob/0.4.1/docs/namespaces/API/Calls.md#~Call)

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