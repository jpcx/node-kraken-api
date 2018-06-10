Module: Settings/defaults
=========================

Default execution settings configuration.

##### Properties:

| Name | Type | Description |
| --- | --- | --- |
| `key` | [Kraken~Key](https://github.com/jpcx/node-kraken-api/blob/develop/docs/namespaces/Kraken.md#~Key) | API key. |
| `secret` | [Kraken~Secret](https://github.com/jpcx/node-kraken-api/blob/develop/docs/namespaces/Kraken.md#~Secret) | API secret. |
| `tier` | [Kraken~Tier](https://github.com/jpcx/node-kraken-api/blob/develop/docs/namespaces/Kraken.md#~Tier) | Verification tier. |
| `timeout` | [API\~Calls~Timeout](https://github.com/jpcx/node-kraken-api/blob/develop/docs/namespaces/API/Calls.md#~Timeout) | Response timeout in ms. |
| `hostname` | [Kraken~Hostname](https://github.com/jpcx/node-kraken-api/blob/develop/docs/namespaces/Kraken.md#~Hostname) | Kraken hostname. |
| `version` | [Kraken~Version](https://github.com/jpcx/node-kraken-api/blob/develop/docs/namespaces/Kraken.md#~Version) | Kraken API version. |
| `pubMethods` | [Kraken~PublicMethods](https://github.com/jpcx/node-kraken-api/blob/develop/docs/namespaces/Kraken.md#~PublicMethods) | API methods available for public users. |
| `privMethods` | [Kraken~PrivateMethods](https://github.com/jpcx/node-kraken-api/blob/develop/docs/namespaces/Kraken.md#~PrivateMethods) | API methods available for authenticated users. |
| `parse` | [Settings~Parse](https://github.com/jpcx/node-kraken-api/blob/develop/docs/namespaces/Settings.md#~Parse) | Response parser settings. |
| `rateLimiter` | [Settings~RateLimiter](https://github.com/jpcx/node-kraken-api/blob/develop/docs/namespaces/Settings.md#~RateLimiter) | Limits call frequency. |

Source:

*   [node-kraken-api/settings/defaults.js](https://github.com/jpcx/node-kraken-api/blob/develop/settings/defaults.js), [line 24](https://github.com/jpcx/node-kraken-api/blob/develop/settings/defaults.js#L24)

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