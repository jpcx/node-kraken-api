# Kraken

Contains types specific to the Kraken servers.

Source:

*   [kraken/kraken.jsdoc](kraken_kraken.jsdoc.html), [line 7](kraken_kraken.jsdoc.html#line7)

### Type Definitions

<a name="~Hostname"></a>
#### Hostname

Hostname for the Kraken API endpoint. See the [Kraken API docs](https://www.kraken.com/help/api) for more info.

##### Type:

*   string

Source:

*   [kraken/kraken.jsdoc](kraken_kraken.jsdoc.html), [line 67](kraken_kraken.jsdoc.html#line67)

<a name="~HTTPSRequestHeaders"></a>
#### HTTPSRequestHeaders

HTTPS request headers for calls to Kraken servers.

##### Type:

*   Object

##### Properties:

| Name | Type | Description |
| --- | --- | --- |
| `API-Key` | [Kraken~Key](https://github.com/jpcx/node-kraken-api/blob/0.1.0/docs/namespaces/Kraken.md#~Key) | Kraken API key. |
| `API-Sign` | [API\~Calls~Signature](https://github.com/jpcx/node-kraken-api/blob/0.1.0/docs/namespaces/API/Calls.md#~Signature) | Cryptographic signature using API secret and other call parameters. |

Source:

*   [kraken/kraken.jsdoc](kraken_kraken.jsdoc.html), [line 79](kraken_kraken.jsdoc.html#line79)

<a name="~HTTPSRequestOptions"></a>
#### HTTPSRequestOptions

HTTPS request options for calls to Kraken servers.

##### Type:

*   Object

##### Properties:

| Name | Type | Description |
| --- | --- | --- |
| `hostname` | [Kraken~Hostname](https://github.com/jpcx/node-kraken-api/blob/0.1.0/docs/namespaces/Kraken.md#~Hostname) | Kraken hostname. |
| `path` | [Kraken~Path](https://github.com/jpcx/node-kraken-api/blob/0.1.0/docs/namespaces/Kraken.md#~Path) | Kraken method path. |
| `method` | string | 'POST' HTTPS request specification. NOTE: This is NOT the same as the [Kraken~Method](https://github.com/jpcx/node-kraken-api/blob/0.1.0/docs/namespaces/Kraken.md#~Method) for the request. |
| `headers` | [Kraken~HTTPSRequestHeaders](https://github.com/jpcx/node-kraken-api/blob/0.1.0/docs/namespaces/Kraken.md#~HTTPSRequestHeaders) | Kraken HTTPS request headers. |

Source:

*   [kraken/kraken.jsdoc](kraken_kraken.jsdoc.html), [line 87](kraken_kraken.jsdoc.html#line87)

<a name="~HTTPSRequestPOSTData"></a>
#### HTTPSRequestPOSTData

HTTPS request POST data for calls to Kraken servers. Generated using 'qs' module.

##### Type:

*   string

Source:

*   [kraken/kraken.jsdoc](kraken_kraken.jsdoc.html), [line 97](kraken_kraken.jsdoc.html#line97)

<a name="~Key"></a>
#### Key

API key from Kraken used for authenticated connections.

##### Type:

*   string

Source:

*   [kraken/kraken.jsdoc](kraken_kraken.jsdoc.html), [line 13](kraken_kraken.jsdoc.html#line13)

<a name="~Method"></a>
#### Method

Type of method being called on Kraken servers. See the [Kraken API docs](https://www.kraken.com/help/api) for more info.

##### Type:

*   string

Source:

*   [kraken/kraken.jsdoc](kraken_kraken.jsdoc.html), [line 49](kraken_kraken.jsdoc.html#line49)

<a name="~Nonce"></a>
#### Nonce

Unique ever-increasing integer used by Kraken servers to determine request validity. See the [Kraken API docs](https://www.kraken.com/help/api) for more info. As recommended by Kraken, nonce is the current time in microseconds.

##### Type:

*   number

Source:

*   [kraken/kraken.jsdoc](kraken_kraken.jsdoc.html), [line 61](kraken_kraken.jsdoc.html#line61)

<a name="~Options"></a>
#### Options

Method-specific options for calls to Kraken servers. See the [Kraken API docs](https://www.kraken.com/help/api) for more info.

##### Type:

*   string

Source:

*   [kraken/kraken.jsdoc](kraken_kraken.jsdoc.html), [line 55](kraken_kraken.jsdoc.html#line55)

<a name="~Path"></a>
#### Path

Path to the Kraken API endpoint for a given method. See the [Kraken API docs](https://www.kraken.com/help/api) for more info.

##### Type:

*   string

Source:

*   [kraken/kraken.jsdoc](kraken_kraken.jsdoc.html), [line 73](kraken_kraken.jsdoc.html#line73)

<a name="~PrivateMethods"></a>
#### PrivateMethods

Set of server-side API methods available exclusively to authenticated users.

##### Type:

*   Set

Source:

*   [kraken/kraken.jsdoc](kraken_kraken.jsdoc.html), [line 43](kraken_kraken.jsdoc.html#line43)

<a name="~PublicMethods"></a>
#### PublicMethods

Set of server-side API methods available to all users.

##### Type:

*   Set

Source:

*   [kraken/kraken.jsdoc](kraken_kraken.jsdoc.html), [line 37](kraken_kraken.jsdoc.html#line37)

<a name="~Secret"></a>
#### Secret

API secret from Kraken used for authenticated connections.

##### Type:

*   string

Source:

*   [kraken/kraken.jsdoc](kraken_kraken.jsdoc.html), [line 19](kraken_kraken.jsdoc.html#line19)

<a name="~Tier"></a>
#### Tier

Verification tier from Kraken used for determining rate limits.

##### Type:

*   number

Source:

*   [kraken/kraken.jsdoc](kraken_kraken.jsdoc.html), [line 25](kraken_kraken.jsdoc.html#line25)

<a name="~Version"></a>
#### Version

Server-side API version.

##### Type:

*   number

Source:

*   [kraken/kraken.jsdoc](kraken_kraken.jsdoc.html), [line 31](kraken_kraken.jsdoc.html#line31)

<hr>

## [Home](https://github.com/jpcx/node-kraken-api/blob/0.1.0/README.md)