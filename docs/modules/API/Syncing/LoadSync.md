Module: API/Syncing/LoadSync
============================

Creates a sync instance creator by loading relevant information into a closure.

##### Parameters:

| Name | Type | Description |
| --- | --- | --- |
| `settings` | [Settings~Config](https://github.com/jpcx/node-kraken-api/blob/0.1.2/docs/namespaces/Settings.md#~Config) | Settings configuration. |
| `limiter` | [API\~RateLimits~Functions](https://github.com/jpcx/node-kraken-api/blob/0.1.2/docs/namespaces/API/RateLimits.md#~Functions) | Limiter instance. |
| `call` | [API\~Calls~Call](https://github.com/jpcx/node-kraken-api/blob/0.1.2/docs/namespaces/API/Calls.md#~Call) | Stateful call function. |


Source:

*   [node-kraken-api/api/syncing/loadSync.js](https://github.com/jpcx/node-kraken-api/blob/0.1.2/api/syncing/loadSync.js), [line 300](https://github.com/jpcx/node-kraken-api/blob/0.1.2/api/syncing/loadSync.js#L300)

##### Returns:

Function which creates sync instances.

Type

[API\~Syncing~Sync](https://github.com/jpcx/node-kraken-api/blob/0.1.2/docs/namespaces/API/Syncing.md#~Sync)

<hr>

## [Home](https://github.com/jpcx/node-kraken-api/blob/0.1.2/README.md)
  + [node-kraken-api](https://github.com/jpcx/node-kraken-api/blob/0.1.2/docs/modules/node-kraken-api.md)
  + [API](https://github.com/jpcx/node-kraken-api/blob/0.1.2/docs/namespaces/API.md)
    + [Calls](https://github.com/jpcx/node-kraken-api/blob/0.1.2/docs/namespaces/API/Calls.md)
      + [GenRequestData](https://github.com/jpcx/node-kraken-api/blob/0.1.2/docs/modules/API/Calls/GenRequestData.md)
      + [LoadCall](https://github.com/jpcx/node-kraken-api/blob/0.1.2/docs/modules/API/Calls/LoadCall.md)
      + [SignRequest](https://github.com/jpcx/node-kraken-api/blob/0.1.2/docs/modules/API/Calls/SignRequest.md)
    + [RateLimits](https://github.com/jpcx/node-kraken-api/blob/0.1.2/docs/namespaces/API/RateLimits.md)
      + [LoadLimiter](https://github.com/jpcx/node-kraken-api/blob/0.1.2/docs/modules/API/RateLimits/LoadLimiter.md)
    + [Syncing](https://github.com/jpcx/node-kraken-api/blob/0.1.2/docs/namespaces/API/Syncing.md)
      + [LoadSync](https://github.com/jpcx/node-kraken-api/blob/0.1.2/docs/modules/API/Syncing/LoadSync.md)
  + [Settings](https://github.com/jpcx/node-kraken-api/blob/0.1.2/docs/namespaces/Settings.md)
    + [ParseSettings](https://github.com/jpcx/node-kraken-api/blob/0.1.2/docs/modules/Settings/ParseSettings.md)
  + [Tools](https://github.com/jpcx/node-kraken-api/blob/0.1.2/docs/namespaces/Tools.md)
    + [AlphabetizeNested](https://github.com/jpcx/node-kraken-api/blob/0.1.2/docs/modules/Tools/AlphabetizeNested.md)
    + [ParseNested](https://github.com/jpcx/node-kraken-api/blob/0.1.2/docs/modules/Tools/ParseNested.md)
  + [Kraken](https://github.com/jpcx/node-kraken-api/blob/0.1.2/docs/namespaces/Kraken.md)