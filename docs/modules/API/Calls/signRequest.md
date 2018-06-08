Module: API/Calls/signRequest
=============================

Signs the request using the 'crypto' library based on the specifications listed in the [Kraken API Docs](https://www.kraken.com/help/api#general-usage).

##### Parameters:

| Name | Type | Description |
| --- | --- | --- |
| `secret` | [Kraken~Secret](https://github.com/jpcx/node-kraken-api/blob/0.1.0/docs/namespaces/Kraken.md#~Secret) | Kraken API secret key. |
| `nonce` | [Kraken~Nonce](https://github.com/jpcx/node-kraken-api/blob/0.1.0/docs/namespaces/Kraken.md#~Nonce) | Kraken API nonce. |
| `post` | [Kraken~HTTPSRequestPOSTData](https://github.com/jpcx/node-kraken-api/blob/0.1.0/docs/namespaces/Kraken.md#~HTTPSRequestPOSTData) | POST data. |
| `path` | [Kraken~Path](https://github.com/jpcx/node-kraken-api/blob/0.1.0/docs/namespaces/Kraken.md#~Path) | Path to Kraken Method URL. |

Source:

*   [node-kraken-api/api/calls/signRequest.js](https://github.com/jpcx/node-kraken-api/blob/0.1.0/api/calls/signRequest.js), [line 11](https://github.com/jpcx/node-kraken-api/blob/0.1.0/api/calls/signRequest.js#L11)

##### Returns:

Signature for a given call.

Type

[API\~Calls~Signature](https://github.com/jpcx/node-kraken-api/blob/0.1.0/docs/namespaces/API/Calls.md#~Signature)

<hr>

## [Home](https://github.com/jpcx/node-kraken-api/blob/0.1.0/README.md)