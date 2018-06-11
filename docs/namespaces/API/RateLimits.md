# [API](https://github.com/jpcx/node-kraken-api/blob/develop/docs/namespaces/API.md)~RateLimits

Types and methods specific to limiting call frequency according to the rate limit specifications listed in the [Kraken API docs](https://www.kraken.com/help/api#api-call-rate-limit)

##### Properties:

| Name | Type | Description |
| --- | --- | --- |
| `limiter` | [module:API/RateLimits/limiter](https://github.com/jpcx/node-kraken-api/blob/develop/docs/modules/API/RateLimits/limiter.md) | Prepares rate-limiting promises according to the [Kraken~Tier](https://github.com/jpcx/node-kraken-api/blob/develop/docs/namespaces/Kraken.md#~Tier), [Kraken~Method](https://github.com/jpcx/node-kraken-api/blob/develop/docs/namespaces/Kraken.md#~Method), and [Settings~RateLimiter](https://github.com/jpcx/node-kraken-api/blob/develop/docs/namespaces/Settings.md#~RateLimiter). |


Source:

*   [node-kraken-api/api/rateLimits/rateLimits.jsdoc](https://github.com/jpcx/node-kraken-api/blob/develop/api/rateLimits/rateLimits.jsdoc), [line 7](https://github.com/jpcx/node-kraken-api/blob/develop/api/rateLimits/rateLimits.jsdoc#L7)

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
    + [Syncing](https://github.com/jpcx/node-kraken-api/blob/develop/docs/namespaces/API/Syncing.md)
      + [loadSync](https://github.com/jpcx/node-kraken-api/blob/develop/docs/modules/API/Syncing/loadSync.md)
  + [Settings](https://github.com/jpcx/node-kraken-api/blob/develop/docs/namespaces/Settings.md)
    + [defaults](https://github.com/jpcx/node-kraken-api/blob/develop/docs/modules/Settings/defaults.md)
  + [Tools](https://github.com/jpcx/node-kraken-api/blob/develop/docs/namespaces/Tools.md)
    + [ms](https://github.com/jpcx/node-kraken-api/blob/develop/docs/modules/Tools/ms.md)
    + [parseNested](https://github.com/jpcx/node-kraken-api/blob/develop/docs/modules/Tools/parseNested.md)
    + [readFileJSON](https://github.com/jpcx/node-kraken-api/blob/develop/docs/modules/Tools/readFileJSON.md)
    + [tryDirectory](https://github.com/jpcx/node-kraken-api/blob/develop/docs/modules/Tools/tryDirectory.md)
    + [writeFileJSON](https://github.com/jpcx/node-kraken-api/blob/develop/docs/modules/Tools/writeFileJSON.md)
  + [Kraken](https://github.com/jpcx/node-kraken-api/blob/develop/docs/namespaces/Kraken.md)