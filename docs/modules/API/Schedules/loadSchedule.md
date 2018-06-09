Module: API/Schedules/loadSchedule
==================================

Loads settings and call function and returns schedule operation functions.

##### Parameters:

| Name | Type | Description |
| --- | --- | --- |
| `tier` | [Kraken~Tier](https://github.com/jpcx/node-kraken-api/blob/develop/docs/namespaces/Kraken.md#~Tier) | Kraken verification tier. |
| `rateLimiter` | [Settings~RateLimiter](https://github.com/jpcx/node-kraken-api/blob/develop/docs/namespaces/Settings.md#~RateLimiter) | Rate limiter logic defined in [Settings~Config](https://github.com/jpcx/node-kraken-api/blob/develop/docs/namespaces/Settings.md#~Config). |
| `call` | [API\~Calls~Call](https://github.com/jpcx/node-kraken-api/blob/develop/docs/namespaces/API/Calls.md#~Call) | Call function. |

Source:

*   [node-kraken-api/api/schedules/loadSchedule.js](https://github.com/jpcx/node-kraken-api/blob/develop/api/schedules/loadSchedule.js), [line 56](https://github.com/jpcx/node-kraken-api/blob/develop/api/schedules/loadSchedule.js#L56)

##### Returns:

Provides schedule operation functions.

Type

[API\~Schedules~Schedule](https://github.com/jpcx/node-kraken-api/blob/develop/docs/namespaces/API/Schedules.md#~Schedule)

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