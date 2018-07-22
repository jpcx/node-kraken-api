# Module: API/Calls/SignRequest

Signs the request using the 'crypto' library based on the specifications listed in the [Kraken API Docs](https://www.kraken.com/help/api#general-usage).

__Parameters:__

| Name | Type | Description |
| --- | --- | --- |
| `secret` | [Kraken~Secret](https://github.com/jpcx/node-kraken-api/blob/0.4.1/docs/namespaces/Kraken.md#~Secret) | Kraken API secret key. |
| `nonce` | [Kraken~Nonce](https://github.com/jpcx/node-kraken-api/blob/0.4.1/docs/namespaces/Kraken.md#~Nonce) | Kraken API nonce. |
| `post` | [Kraken~HTTPSRequestPOSTData](https://github.com/jpcx/node-kraken-api/blob/0.4.1/docs/namespaces/Kraken.md#~HTTPSRequestPOSTData) | POST data. |
| `path` | [Kraken~Path](https://github.com/jpcx/node-kraken-api/blob/0.4.1/docs/namespaces/Kraken.md#~Path) | Path to Kraken Method URL. |

Source:

* [node-kraken-api/api/calls/signRequest.js](https://github.com/jpcx/node-kraken-api/blob/0.4.1/api/calls/signRequest.js), [line 11](https://github.com/jpcx/node-kraken-api/blob/0.4.1/api/calls/signRequest.js#L11)

__Returns:__

Signature for a given call.

___Type:___

* [API\~Calls~Signature](https://github.com/jpcx/node-kraken-api/blob/0.4.1/docs/namespaces/API/Calls.md#~Signature)

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