# [API](https://github.com/jpcx/node-kraken-api/blob/develop/docs/namespaces/API.md)~Calls

Types and methods specific to making direct API calls to Kraken.

##### Properties:

| Name | Type | Description |
| --- | --- | --- |
| `LoadCall` | [module:API/Calls/loadCall](https://github.com/jpcx/node-kraken-api/blob/develop/docs/modules/API/Calls/loadCall.md) | Loads a stateful call function given the execution settings. |
| `GenRequestData` | [module:API/Calls/genRequestData](https://github.com/jpcx/node-kraken-api/blob/develop/docs/modules/API/Calls/genRequestData.md) | Generates request data for a given request. |
| `SignRequest` | [module:API/Calls/signRequest](https://github.com/jpcx/node-kraken-api/blob/develop/docs/modules/API/Calls/signRequest.md) | Applies a cryptographic signature to a given request. |

Source:

*   [node-kraken-api/api/calls/calls.jsdoc](https://github.com/jpcx/node-kraken-api/blob/develop/api/calls/calls.jsdoc), [line 7](https://github.com/jpcx/node-kraken-api/blob/develop/api/calls/calls.jsdoc#L7)

### Methods

<a name=".handleResponse"></a>
#### (static) handleResponse(settings, res, resolve, reject)

Handles request responses.

##### Parameters:

| Name | Type | Description |
| --- | --- | --- |
| `settings` | [Settings~Config](https://github.com/jpcx/node-kraken-api/blob/develop/docs/namespaces/Settings.md#~Config) | Instance settings. |
| `res` | Object | Provides an 'on' function which emits 'data' and 'end' events while receiving data chunks from request. |
| `resolve` | function | Operational promise resolve function. |
| `reject` | function | Operational promise reject function. |

Source:

*   [node-kraken-api/api/calls/loadCall.js](https://github.com/jpcx/node-kraken-api/blob/develop/api/calls/loadCall.js), [line 23](https://github.com/jpcx/node-kraken-api/blob/develop/api/calls/loadCall.js#L23)

<a name=".makeRequest"></a>
#### (async, static) makeRequest(settings, method, options, resolve, reject)

Makes a request to the Kraken servers.

##### Parameters:

| Name | Type | Description |
| --- | --- | --- |
| `settings` | [Settings~Config](https://github.com/jpcx/node-kraken-api/blob/develop/docs/namespaces/Settings.md#~Config) | Instance settings. |
| `method` | [Kraken~Method](https://github.com/jpcx/node-kraken-api/blob/develop/docs/namespaces/Kraken.md#~Method) | Method being called. |
| `options` | [Kraken~Options](https://github.com/jpcx/node-kraken-api/blob/develop/docs/namespaces/Kraken.md#~Options) | Method-specific options. |
| `resolve` | function | Operational promise resolve function. |
| `reject` | function | Operational promise reject function. |

Source:

*   [node-kraken-api/api/calls/loadCall.js](https://github.com/jpcx/node-kraken-api/blob/develop/api/calls/loadCall.js), [line 77](https://github.com/jpcx/node-kraken-api/blob/develop/api/calls/loadCall.js#L77)

<a name="~Call"></a>
#### (inner) Call(method, optionsopt, cbopt) → \{Promise|undefined}

Executes a call to the kraken servers using closure-loaded settings.

##### Parameters:

| Name | Type | Attributes | Description |
| --- | --- | --- | --- |
| `method` | [Kraken~Method](https://github.com/jpcx/node-kraken-api/blob/develop/docs/namespaces/Kraken.md#~Method) |  | Method being called. |
| `options` | [Kraken~Options](https://github.com/jpcx/node-kraken-api/blob/develop/docs/namespaces/Kraken.md#~Options) | \<optional> | Method-specific options. |
| `cb` | [API~Callback](https://github.com/jpcx/node-kraken-api/blob/develop/docs/namespaces/API.md#~Callback) | \<optional> | Callback for errors and data. |

Source:

*   [node-kraken-api/api/calls/loadCall.js](https://github.com/jpcx/node-kraken-api/blob/develop/api/calls/loadCall.js), [line 112](https://github.com/jpcx/node-kraken-api/blob/develop/api/calls/loadCall.js#L112)

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
| `options` | [Kraken~HTTPSRequestOptions](https://github.com/jpcx/node-kraken-api/blob/develop/docs/namespaces/Kraken.md#~HTTPSRequestOptions) | Options for HTTPS request to Kraken servers. |
| `post` | [Kraken~HTTPSRequestPOSTData](https://github.com/jpcx/node-kraken-api/blob/develop/docs/namespaces/Kraken.md#~HTTPSRequestPOSTData) | POST data for HTTPS request to Kraken servers. |

Source:

*   [node-kraken-api/api/calls/calls.jsdoc](https://github.com/jpcx/node-kraken-api/blob/develop/api/calls/calls.jsdoc), [line 22](https://github.com/jpcx/node-kraken-api/blob/develop/api/calls/calls.jsdoc#L22)

<a name="~Signature"></a>
#### Signature

Cryptographic signature of a given call according to the specifications listed in the [Kraken API Docs](https://www.kraken.com/help/api#general-usage).

##### Type:

*   Object

Source:

*   [node-kraken-api/api/calls/calls.jsdoc](https://github.com/jpcx/node-kraken-api/blob/develop/api/calls/calls.jsdoc), [line 30](https://github.com/jpcx/node-kraken-api/blob/develop/api/calls/calls.jsdoc#L30)

<a name="~Timeout"></a>
#### Timeout

Timeout (in ms) for terminating HTTPS connections.

##### Type:

*   number

Source:

*   [node-kraken-api/api/calls/calls.jsdoc](https://github.com/jpcx/node-kraken-api/blob/develop/api/calls/calls.jsdoc), [line 16](https://github.com/jpcx/node-kraken-api/blob/develop/api/calls/calls.jsdoc#L16)

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