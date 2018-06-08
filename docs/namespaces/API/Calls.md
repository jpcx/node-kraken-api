# [API](https://github.com/jpcx/node-kraken-api/blob/0.1.0/docs/namespaces/API.md)~Calls

Types and methods specific to making direct API calls to Kraken.

##### Properties:

| Name | Type | Description |
| --- | --- | --- |
| `LoadCall` | [module:API/Calls/loadCall](https://github.com/jpcx/node-kraken-api/blob/0.1.0/docs/modules/API/Calls/loadCall.md) | Loads a stateful call function given the execution settings. |
| `GenRequestData` | [module:API/Calls/genRequestData](https://github.com/jpcx/node-kraken-api/blob/0.1.0/docs/modules/API/Calls/genRequestData.md) | Generates request data for a given request. |
| `SignRequest` | [module:API/Calls/signRequest](https://github.com/jpcx/node-kraken-api/blob/0.1.0/docs/modules/API/Calls/signRequest.md) | Applies a cryptographic signature to a given request. |

Source:

*   [api/calls/calls.jsdoc](api_calls_calls.jsdoc.html), [line 7](api_calls_calls.jsdoc.html#line7)

### Methods

<a name=".handleResponse"></a>
#### (static) handleResponse(settings, res, resolve, reject)

Handles request responses.

##### Parameters:

| Name | Type | Description |
| --- | --- | --- |
| `settings` | [Settings~Config](https://github.com/jpcx/node-kraken-api/blob/0.1.0/docs/namespaces/Settings.md#~Config) | Instance settings. |
| `res` | Object | Provides an 'on' function which emits 'data' and 'end' events while receiving data chunks from request. |
| `resolve` | function | Operational promise resolve function. |
| `reject` | function | Operational promise reject function. |

Source:

*   [node-kraken-api/api/calls/loadCall.js](https://github.com/jpcx/node-kraken-api/blob/0.1.0/api/calls/loadCall.js), [line 23](https://github.com/jpcx/node-kraken-api/blob/0.1.0/api/calls/loadCall.js#L23)

<a name=".makeRequest"></a>
#### (async, static) makeRequest(settings, method, options, resolve, reject)

Makes a request to the Kraken servers.

##### Parameters:

| Name | Type | Description |
| --- | --- | --- |
| `settings` | [Settings~Config](https://github.com/jpcx/node-kraken-api/blob/0.1.0/docs/namespaces/Settings.md#~Config) | Instance settings. |
| `method` | [Kraken~Method](https://github.com/jpcx/node-kraken-api/blob/0.1.0/docs/namespaces/Kraken.md#~Method) | Method being called. |
| `options` | [Kraken~Options](https://github.com/jpcx/node-kraken-api/blob/0.1.0/docs/namespaces/Kraken.md#~Options) | Method-specific options. |
| `resolve` | function | Operational promise resolve function. |
| `reject` | function | Operational promise reject function. |

Source:

*   [node-kraken-api/api/calls/loadCall.js](https://github.com/jpcx/node-kraken-api/blob/0.1.0/api/calls/loadCall.js), [line 77](https://github.com/jpcx/node-kraken-api/blob/0.1.0/api/calls/loadCall.js#L77)

<a name="~Call"></a>
#### (inner) Call(method, optionsopt, cbopt) → \{Promise|undefined}

Executes a call to the kraken servers using closure-loaded settings.

##### Parameters:

| Name | Type | Attributes | Description |
| --- | --- | --- | --- |
| `method` | [Kraken~Method](https://github.com/jpcx/node-kraken-api/blob/0.1.0/docs/namespaces/Kraken.md#~Method) |  | Method being called. |
| `options` | [Kraken~Options](https://github.com/jpcx/node-kraken-api/blob/0.1.0/docs/namespaces/Kraken.md#~Options) | \<optional> | Method-specific options. |
| `cb` | [API~Callback](https://github.com/jpcx/node-kraken-api/blob/0.1.0/docs/namespaces/API.md#~Callback) | \<optional> | Callback for errors and data. |

Source:

*   [node-kraken-api/api/calls/loadCall.js](https://github.com/jpcx/node-kraken-api/blob/0.1.0/api/calls/loadCall.js), [line 112](https://github.com/jpcx/node-kraken-api/blob/0.1.0/api/calls/loadCall.js#L112)

##### Returns:

Promise which resolves with response data and rejects with errors (if callback is not supplied).

Type

Promise | undefined

### Type Definitions

<a name="~RequestData"></a>
#### RequestData

Request data prepared for use with the 'https' module.

##### Type:

*   Object

##### Properties:

| Name | Type | Description |
| --- | --- | --- |
| `options` | [Kraken~HTTPSRequestOptions](https://github.com/jpcx/node-kraken-api/blob/0.1.0/docs/namespaces/Kraken.md#~HTTPSRequestOptions) | Options for HTTPS request to Kraken servers. |
| `post` | [Kraken~HTTPSRequestPOSTData](https://github.com/jpcx/node-kraken-api/blob/0.1.0/docs/namespaces/Kraken.md#~HTTPSRequestPOSTData) | POST data for HTTPS request to Kraken servers. |

Source:

*   [api/calls/calls.jsdoc](api_calls_calls.jsdoc.html), [line 22](api_calls_calls.jsdoc.html#line22)

<a name="~Signature"></a>
#### Signature

Cryptographic signature of a given call according to the specifications listed in the [Kraken API Docs](https://www.kraken.com/help/api#general-usage).

##### Type:

*   Object

Source:

*   [api/calls/calls.jsdoc](api_calls_calls.jsdoc.html), [line 30](api_calls_calls.jsdoc.html#line30)

<a name="~Timeout"></a>
#### Timeout

Timeout (in ms) for terminating HTTPS connections.

##### Type:

*   number

Source:

*   [api/calls/calls.jsdoc](api_calls_calls.jsdoc.html), [line 16](api_calls_calls.jsdoc.html#line16)

<hr>

## [Home](https://github.com/jpcx/node-kraken-api/blob/0.1.0/README.md)