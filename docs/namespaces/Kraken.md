# Kraken

Contains types specific to the Kraken servers.

Source:

*   [node-kraken-api/kraken/kraken.jsdoc](https://github.com/jpcx/node-kraken-api/blob/develop/kraken/kraken.jsdoc), [line 7](https://github.com/jpcx/node-kraken-api/blob/develop/kraken/kraken.jsdoc#L7)

### Type Definitions

<a name="~Hostname"></a>
#### Hostname

Hostname for the Kraken API endpoint. See the [Kraken API docs](https://www.kraken.com/help/api) for more info.

##### Type:

*   string

Source:

*   [node-kraken-api/kraken/kraken.jsdoc](https://github.com/jpcx/node-kraken-api/blob/develop/kraken/kraken.jsdoc), [line 74](https://github.com/jpcx/node-kraken-api/blob/develop/kraken/kraken.jsdoc#L74)

<a name="~HTTPSRequestHeaders"></a>
#### HTTPSRequestHeaders

HTTPS request headers for calls to Kraken servers.

##### Type:

*   Object

##### Properties:

| Name | Type | Description |
| --- | --- | --- |
| `API-Key` | [Kraken~Key](https://github.com/jpcx/node-kraken-api/blob/develop/docs/namespaces/Kraken.md#~Key) | Kraken API key. |
| `API-Sign` | [API\~Calls~Signature](https://github.com/jpcx/node-kraken-api/blob/develop/docs/namespaces/API/Calls.md#~Signature) | Cryptographic signature using API secret and other call parameters. |


Source:

*   [node-kraken-api/kraken/kraken.jsdoc](https://github.com/jpcx/node-kraken-api/blob/develop/kraken/kraken.jsdoc), [line 86](https://github.com/jpcx/node-kraken-api/blob/develop/kraken/kraken.jsdoc#L86)

<a name="~HTTPSRequestOptions"></a>
#### HTTPSRequestOptions

HTTPS request options for calls to Kraken servers.

##### Type:

*   Object

##### Properties:

| Name | Type | Description |
| --- | --- | --- |
| `hostname` | [Kraken~Hostname](https://github.com/jpcx/node-kraken-api/blob/develop/docs/namespaces/Kraken.md#~Hostname) | Kraken hostname. |
| `path` | [Kraken~Path](https://github.com/jpcx/node-kraken-api/blob/develop/docs/namespaces/Kraken.md#~Path) | Kraken method path. |
| `method` | string | 'POST' HTTPS request specification. NOTE: This is NOT the same as the [Kraken~Method](https://github.com/jpcx/node-kraken-api/blob/develop/docs/namespaces/Kraken.md#~Method) for the request. |
| `headers` | [Kraken~HTTPSRequestHeaders](https://github.com/jpcx/node-kraken-api/blob/develop/docs/namespaces/Kraken.md#~HTTPSRequestHeaders) | Kraken HTTPS request headers. |


Source:

*   [node-kraken-api/kraken/kraken.jsdoc](https://github.com/jpcx/node-kraken-api/blob/develop/kraken/kraken.jsdoc), [line 94](https://github.com/jpcx/node-kraken-api/blob/develop/kraken/kraken.jsdoc#L94)

<a name="~HTTPSRequestPOSTData"></a>
#### HTTPSRequestPOSTData

HTTPS request POST data for calls to Kraken servers. Generated using 'qs' module.

##### Type:

*   string

Source:

*   [node-kraken-api/kraken/kraken.jsdoc](https://github.com/jpcx/node-kraken-api/blob/develop/kraken/kraken.jsdoc), [line 104](https://github.com/jpcx/node-kraken-api/blob/develop/kraken/kraken.jsdoc#L104)

<a name="~Key"></a>
#### Key

API key from Kraken used for authenticated connections.

##### Type:

*   string

Source:

*   [node-kraken-api/kraken/kraken.jsdoc](https://github.com/jpcx/node-kraken-api/blob/develop/kraken/kraken.jsdoc), [line 13](https://github.com/jpcx/node-kraken-api/blob/develop/kraken/kraken.jsdoc#L13)

<a name="~Method"></a>
#### Method

Type of method being called on Kraken servers. See the [Kraken API docs](https://www.kraken.com/help/api) for more info.

##### Type:

*   string

Source:

*   [node-kraken-api/kraken/kraken.jsdoc](https://github.com/jpcx/node-kraken-api/blob/develop/kraken/kraken.jsdoc), [line 49](https://github.com/jpcx/node-kraken-api/blob/develop/kraken/kraken.jsdoc#L49)

<a name="~Nonce"></a>
#### Nonce

Unique ever-increasing integer used by Kraken servers to determine request validity. See the [Kraken API docs](https://www.kraken.com/help/api) for more info. As recommended by Kraken, nonce is the current time in microseconds.

##### Type:

*   number

Source:

*   [node-kraken-api/kraken/kraken.jsdoc](https://github.com/jpcx/node-kraken-api/blob/develop/kraken/kraken.jsdoc), [line 68](https://github.com/jpcx/node-kraken-api/blob/develop/kraken/kraken.jsdoc#L68)

<a name="~Option"></a>
#### Option

A single option to be sent to the Kraken servers; varies by method type.

##### Type:

*   string | number

Source:

*   [node-kraken-api/kraken/kraken.jsdoc](https://github.com/jpcx/node-kraken-api/blob/develop/kraken/kraken.jsdoc), [line 55](https://github.com/jpcx/node-kraken-api/blob/develop/kraken/kraken.jsdoc#L55)

<a name="~Options"></a>
#### Options

Method-specific options for calls to Kraken servers. See the [Kraken API docs](https://www.kraken.com/help/api) for more info.

##### Type:

*   Object

##### Properties:

| Name | Type | Description |
| --- | --- | --- |
| `*` | [Kraken~Option](https://github.com/jpcx/node-kraken-api/blob/develop/docs/namespaces/Kraken.md#~Option) | An option to send to the servers. |


Source:

*   [node-kraken-api/kraken/kraken.jsdoc](https://github.com/jpcx/node-kraken-api/blob/develop/kraken/kraken.jsdoc), [line 61](https://github.com/jpcx/node-kraken-api/blob/develop/kraken/kraken.jsdoc#L61)

<a name="~Path"></a>
#### Path

Path to the Kraken API endpoint for a given method. See the [Kraken API docs](https://www.kraken.com/help/api) for more info.

##### Type:

*   string

Source:

*   [node-kraken-api/kraken/kraken.jsdoc](https://github.com/jpcx/node-kraken-api/blob/develop/kraken/kraken.jsdoc), [line 80](https://github.com/jpcx/node-kraken-api/blob/develop/kraken/kraken.jsdoc#L80)

<a name="~PrivateMethods"></a>
#### PrivateMethods

Set of server-side API methods available exclusively to authenticated users.

##### Type:

*   Set

Source:

*   [node-kraken-api/kraken/kraken.jsdoc](https://github.com/jpcx/node-kraken-api/blob/develop/kraken/kraken.jsdoc), [line 43](https://github.com/jpcx/node-kraken-api/blob/develop/kraken/kraken.jsdoc#L43)

<a name="~PublicMethods"></a>
#### PublicMethods

Set of server-side API methods available to all users.

##### Type:

*   Set

Source:

*   [node-kraken-api/kraken/kraken.jsdoc](https://github.com/jpcx/node-kraken-api/blob/develop/kraken/kraken.jsdoc), [line 37](https://github.com/jpcx/node-kraken-api/blob/develop/kraken/kraken.jsdoc#L37)

<a name="~Secret"></a>
#### Secret

API secret from Kraken used for authenticated connections.

##### Type:

*   string

Source:

*   [node-kraken-api/kraken/kraken.jsdoc](https://github.com/jpcx/node-kraken-api/blob/develop/kraken/kraken.jsdoc), [line 19](https://github.com/jpcx/node-kraken-api/blob/develop/kraken/kraken.jsdoc#L19)

<a name="~Tier"></a>
#### Tier

Verification tier from Kraken used for determining rate limits.

##### Type:

*   number

Source:

*   [node-kraken-api/kraken/kraken.jsdoc](https://github.com/jpcx/node-kraken-api/blob/develop/kraken/kraken.jsdoc), [line 25](https://github.com/jpcx/node-kraken-api/blob/develop/kraken/kraken.jsdoc#L25)

<a name="~Version"></a>
#### Version

Server-side API version.

##### Type:

*   number

Source:

*   [node-kraken-api/kraken/kraken.jsdoc](https://github.com/jpcx/node-kraken-api/blob/develop/kraken/kraken.jsdoc), [line 31](https://github.com/jpcx/node-kraken-api/blob/develop/kraken/kraken.jsdoc#L31)

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
  + [Tools](https://github.com/jpcx/node-kraken-api/blob/develop/docs/namespaces/Tools.md)
    + [ms](https://github.com/jpcx/node-kraken-api/blob/develop/docs/modules/Tools/ms.md)
    + [parseNested](https://github.com/jpcx/node-kraken-api/blob/develop/docs/modules/Tools/parseNested.md)
    + [readFileJSON](https://github.com/jpcx/node-kraken-api/blob/develop/docs/modules/Tools/readFileJSON.md)
    + [tryDirectory](https://github.com/jpcx/node-kraken-api/blob/develop/docs/modules/Tools/tryDirectory.md)
    + [writeFileJSON](https://github.com/jpcx/node-kraken-api/blob/develop/docs/modules/Tools/writeFileJSON.md)
  + [Kraken](https://github.com/jpcx/node-kraken-api/blob/develop/docs/namespaces/Kraken.md)