Module: API/Calls/signRequest
=============================

Signs the request using the 'crypto' library based on the specifications listed in the [Kraken API Docs](https://www.kraken.com/help/api#general-usage).

##### Parameters:

| Name | Type | Description |
| --- | --- | --- |
| `secret` | [Kraken~Secret](https://github.com/jpcx/node-kraken-api/blob/develop/docs/namespaces/Kraken.md#~Secret) | Kraken API secret key. |
| `nonce` | [Kraken~Nonce](https://github.com/jpcx/node-kraken-api/blob/develop/docs/namespaces/Kraken.md#~Nonce) | Kraken API nonce. |
| `post` | [Kraken~HTTPSRequestPOSTData](https://github.com/jpcx/node-kraken-api/blob/develop/docs/namespaces/Kraken.md#~HTTPSRequestPOSTData) | POST data. |
| `path` | [Kraken~Path](https://github.com/jpcx/node-kraken-api/blob/develop/docs/namespaces/Kraken.md#~Path) | Path to Kraken Method URL. |

Source:

*   [node-kraken-api/api/calls/signRequest.js](https://github.com/jpcx/node-kraken-api/blob/develop/api/calls/signRequest.js), [line 11](https://github.com/jpcx/node-kraken-api/blob/develop/api/calls/signRequest.js#L11)

##### Returns:

Signature for a given call.

Type

[API\~Calls~Signature](https://github.com/jpcx/node-kraken-api/blob/develop/docs/namespaces/API/Calls.md#~Signature)

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