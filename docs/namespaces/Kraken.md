# Kraken

Contains types specific to the Kraken servers.

Source:

*   [node-kraken-api/kraken/kraken.jsdoc](https://github.com/jpcx/node-kraken-api/blob/develop/kraken/kraken.jsdoc), [line 7](https://github.com/jpcx/node-kraken-api/blob/develop/kraken/kraken.jsdoc#L7)

### Type Definitions

<a name="~CounterInterval"></a>
#### CounterInterval

Number of seconds for the [Kraken~RateLimitCount](https://github.com/jpcx/node-kraken-api/blob/develop/docs/namespaces/Kraken.md#~RateLimitCount) to decrement by one. Depends on the [Kraken~Tier](https://github.com/jpcx/node-kraken-api/blob/develop/docs/namespaces/Kraken.md#~Tier). See the [Kraken API docs](https://www.kraken.com/help/api#api-call-rate-limit) for more information.

##### Type:

*   number

Source:

*   [node-kraken-api/kraken/kraken.jsdoc](https://github.com/jpcx/node-kraken-api/blob/develop/kraken/kraken.jsdoc), [line 134](https://github.com/jpcx/node-kraken-api/blob/develop/kraken/kraken.jsdoc#L134)

<a name="~CounterLimit"></a>
#### CounterLimit

Positive integer counter limit used for determining private API rate limit adherence. Depends on the [Kraken~Tier](https://github.com/jpcx/node-kraken-api/blob/develop/docs/namespaces/Kraken.md#~Tier). See the [Kraken API docs](https://www.kraken.com/help/api#api-call-rate-limit) for more information.

##### Type:

*   [Kraken~RateLimitCount](https://github.com/jpcx/node-kraken-api/blob/develop/docs/namespaces/Kraken.md#~RateLimitCount)

Source:

*   [node-kraken-api/kraken/kraken.jsdoc](https://github.com/jpcx/node-kraken-api/blob/develop/kraken/kraken.jsdoc), [line 122](https://github.com/jpcx/node-kraken-api/blob/develop/kraken/kraken.jsdoc#L122)

<a name="~Hostname"></a>
#### Hostname

Hostname for the Kraken API endpoint. See the [Kraken API docs](https://www.kraken.com/help/api#public-market-data) for more info.

##### Type:

*   string

Source:

*   [node-kraken-api/kraken/kraken.jsdoc](https://github.com/jpcx/node-kraken-api/blob/develop/kraken/kraken.jsdoc), [line 80](https://github.com/jpcx/node-kraken-api/blob/develop/kraken/kraken.jsdoc#L80)

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

*   [node-kraken-api/kraken/kraken.jsdoc](https://github.com/jpcx/node-kraken-api/blob/develop/kraken/kraken.jsdoc), [line 92](https://github.com/jpcx/node-kraken-api/blob/develop/kraken/kraken.jsdoc#L92)

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

*   [node-kraken-api/kraken/kraken.jsdoc](https://github.com/jpcx/node-kraken-api/blob/develop/kraken/kraken.jsdoc), [line 100](https://github.com/jpcx/node-kraken-api/blob/develop/kraken/kraken.jsdoc#L100)

<a name="~HTTPSRequestPOSTData"></a>
#### HTTPSRequestPOSTData

HTTPS request POST data for calls to Kraken servers. Generated using 'qs' module.

##### Type:

*   string

Source:

*   [node-kraken-api/kraken/kraken.jsdoc](https://github.com/jpcx/node-kraken-api/blob/develop/kraken/kraken.jsdoc), [line 110](https://github.com/jpcx/node-kraken-api/blob/develop/kraken/kraken.jsdoc#L110)

<a name="~IncrementAmount"></a>
#### IncrementAmount

Positive integer counter increment amount used for determining private API rate limit adherence. Depends on the [Kraken~Method](https://github.com/jpcx/node-kraken-api/blob/develop/docs/namespaces/Kraken.md#~Method). See the [Kraken API docs](https://www.kraken.com/help/api#api-call-rate-limit) for more information.

##### Type:

*   [Kraken~RateLimitCount](https://github.com/jpcx/node-kraken-api/blob/develop/docs/namespaces/Kraken.md#~RateLimitCount)

Source:

*   [node-kraken-api/kraken/kraken.jsdoc](https://github.com/jpcx/node-kraken-api/blob/develop/kraken/kraken.jsdoc), [line 128](https://github.com/jpcx/node-kraken-api/blob/develop/kraken/kraken.jsdoc#L128)

<a name="~Key"></a>
#### Key

API key from Kraken used for authenticated connections.

##### Type:

*   string

Source:

*   [node-kraken-api/kraken/kraken.jsdoc](https://github.com/jpcx/node-kraken-api/blob/develop/kraken/kraken.jsdoc), [line 13](https://github.com/jpcx/node-kraken-api/blob/develop/kraken/kraken.jsdoc#L13)

<a name="~Method"></a>
#### Method

Type of method being called on Kraken servers. See the [Kraken API docs](https://www.kraken.com/help/api#public-market-data) for more info.

##### Type:

*   string

Source:

*   [node-kraken-api/kraken/kraken.jsdoc](https://github.com/jpcx/node-kraken-api/blob/develop/kraken/kraken.jsdoc), [line 55](https://github.com/jpcx/node-kraken-api/blob/develop/kraken/kraken.jsdoc#L55)

<a name="~Nonce"></a>
#### Nonce

Unique ever-increasing integer used by Kraken servers to determine request validity. See the [Kraken API docs](https://www.kraken.com/help/api#general-usage) for more info. As recommended by Kraken, nonce is the current time in microseconds.

##### Type:

*   number

Source:

*   [node-kraken-api/kraken/kraken.jsdoc](https://github.com/jpcx/node-kraken-api/blob/develop/kraken/kraken.jsdoc), [line 74](https://github.com/jpcx/node-kraken-api/blob/develop/kraken/kraken.jsdoc#L74)

<a name="~Option"></a>
#### Option

A single option to be sent to the Kraken servers; varies by method type.

##### Type:

*   string | number

Source:

*   [node-kraken-api/kraken/kraken.jsdoc](https://github.com/jpcx/node-kraken-api/blob/develop/kraken/kraken.jsdoc), [line 61](https://github.com/jpcx/node-kraken-api/blob/develop/kraken/kraken.jsdoc#L61)

<a name="~Options"></a>
#### Options

Method-specific options for calls to Kraken servers. See the [Kraken API docs](https://www.kraken.com/help/api#public-market-data) for more info.

##### Type:

*   Object

##### Properties:

| Name | Type | Description |
| --- | --- | --- |
| `*` | [Kraken~Option](https://github.com/jpcx/node-kraken-api/blob/develop/docs/namespaces/Kraken.md#~Option) | An option to send to the servers. |


Source:

*   [node-kraken-api/kraken/kraken.jsdoc](https://github.com/jpcx/node-kraken-api/blob/develop/kraken/kraken.jsdoc), [line 67](https://github.com/jpcx/node-kraken-api/blob/develop/kraken/kraken.jsdoc#L67)

<a name="~OTP"></a>
#### OTP

Two factor password used for authenticated calls (if required).

##### Type:

*   number | string

Source:

*   [node-kraken-api/kraken/kraken.jsdoc](https://github.com/jpcx/node-kraken-api/blob/develop/kraken/kraken.jsdoc), [line 31](https://github.com/jpcx/node-kraken-api/blob/develop/kraken/kraken.jsdoc#L31)

<a name="~Path"></a>
#### Path

Path to the Kraken API endpoint for a given method. See the [Kraken API docs](https://www.kraken.com/help/api#public-market-data) for more info.

##### Type:

*   string

Source:

*   [node-kraken-api/kraken/kraken.jsdoc](https://github.com/jpcx/node-kraken-api/blob/develop/kraken/kraken.jsdoc), [line 86](https://github.com/jpcx/node-kraken-api/blob/develop/kraken/kraken.jsdoc#L86)

<a name="~PrivateMethods"></a>
#### PrivateMethods

Set of server-side API methods available exclusively to authenticated users.

##### Type:

*   Array

Source:

*   [node-kraken-api/kraken/kraken.jsdoc](https://github.com/jpcx/node-kraken-api/blob/develop/kraken/kraken.jsdoc), [line 49](https://github.com/jpcx/node-kraken-api/blob/develop/kraken/kraken.jsdoc#L49)

<a name="~PublicMethods"></a>
#### PublicMethods

Set of server-side API methods available to all users.

##### Type:

*   Array

Source:

*   [node-kraken-api/kraken/kraken.jsdoc](https://github.com/jpcx/node-kraken-api/blob/develop/kraken/kraken.jsdoc), [line 43](https://github.com/jpcx/node-kraken-api/blob/develop/kraken/kraken.jsdoc#L43)

<a name="~RateLimitCount"></a>
#### RateLimitCount

Counts within the the authenticated rate-limit counter. Kraken limits authenticated requests using a counter system. Counts go up when a call is made, and decay after a certain amount of time. Counter behavior is dependent on verification tier. See the [Kraken API docs](https://www.kraken.com/help/api#api-call-rate-limit) for more information.

##### Type:

*   number

Source:

*   [node-kraken-api/kraken/kraken.jsdoc](https://github.com/jpcx/node-kraken-api/blob/develop/kraken/kraken.jsdoc), [line 116](https://github.com/jpcx/node-kraken-api/blob/develop/kraken/kraken.jsdoc#L116)

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

Server-side API version. See the [Kraken API docs](https://www.kraken.com/help/api#public-market-data) for more info.

##### Type:

*   number

Source:

*   [node-kraken-api/kraken/kraken.jsdoc](https://github.com/jpcx/node-kraken-api/blob/develop/kraken/kraken.jsdoc), [line 37](https://github.com/jpcx/node-kraken-api/blob/develop/kraken/kraken.jsdoc#L37)

<hr>

## [Home](https://github.com/jpcx/node-kraken-api/blob/develop/README.md)
  + [node-kraken-api](https://github.com/jpcx/node-kraken-api/blob/develop/docs/modules/node-kraken-api.md)
  + [API](https://github.com/jpcx/node-kraken-api/blob/develop/docs/namespaces/API.md)
    + [Calls](https://github.com/jpcx/node-kraken-api/blob/develop/docs/namespaces/API/Calls.md)
      + [GenRequestData](https://github.com/jpcx/node-kraken-api/blob/develop/docs/modules/API/Calls/GenRequestData.md)
      + [LoadCall](https://github.com/jpcx/node-kraken-api/blob/develop/docs/modules/API/Calls/LoadCall.md)
      + [SignRequest](https://github.com/jpcx/node-kraken-api/blob/develop/docs/modules/API/Calls/SignRequest.md)
    + [RateLimits](https://github.com/jpcx/node-kraken-api/blob/develop/docs/namespaces/API/RateLimits.md)
      + [LoadLimiter](https://github.com/jpcx/node-kraken-api/blob/develop/docs/modules/API/RateLimits/LoadLimiter.md)
    + [Syncing](https://github.com/jpcx/node-kraken-api/blob/develop/docs/namespaces/API/Syncing.md)
      + [LoadSync](https://github.com/jpcx/node-kraken-api/blob/develop/docs/modules/API/Syncing/LoadSync.md)
  + [Settings](https://github.com/jpcx/node-kraken-api/blob/develop/docs/namespaces/Settings.md)
    + [ParseSettings](https://github.com/jpcx/node-kraken-api/blob/develop/docs/modules/Settings/ParseSettings.md)
  + [Tools](https://github.com/jpcx/node-kraken-api/blob/develop/docs/namespaces/Tools.md)
    + [AlphabetizeNested](https://github.com/jpcx/node-kraken-api/blob/develop/docs/modules/Tools/AlphabetizeNested.md)
    + [ParseNested](https://github.com/jpcx/node-kraken-api/blob/develop/docs/modules/Tools/ParseNested.md)
  + [Kraken](https://github.com/jpcx/node-kraken-api/blob/develop/docs/namespaces/Kraken.md)