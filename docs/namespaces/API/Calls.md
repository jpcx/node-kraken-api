# [API](https://github.com/jpcx/node-kraken-api/blob/0.4.1/docs/namespaces/API.md)~Calls

Types and methods specific to making direct API calls to Kraken.

__Properties:__

| Name | Type | Description |
| --- | --- | --- |
| `LoadCall` | [module:API/Calls/LoadCall](https://github.com/jpcx/node-kraken-api/blob/0.4.1/docs/modules/API/Calls/LoadCall.md) | Loads a stateful call function given the execution settings. |
| `GenRequestData` | [module:API/Calls/GenRequestData](https://github.com/jpcx/node-kraken-api/blob/0.4.1/docs/modules/API/Calls/GenRequestData.md) | Generates request data for a given request. |
| `SignRequest` | [module:API/Calls/SignRequest](https://github.com/jpcx/node-kraken-api/blob/0.4.1/docs/modules/API/Calls/SignRequest.md) | Applies a cryptographic signature to a given request. |

Source:

* [node-kraken-api/api/calls/calls.jsdoc](https://github.com/jpcx/node-kraken-api/blob/0.4.1/api/calls/calls.jsdoc), [line 7](https://github.com/jpcx/node-kraken-api/blob/0.4.1/api/calls/calls.jsdoc#L7)

## Methods

<a name="~Call"></a>

### (inner) Call(method, optionsopt, cbopt) → \{Promise|boolean}

Makes a call to the Kraken server-side API.

__Parameters:__

| Name | Type | Attributes | Description |
| --- | --- | --- | --- |
| `method` | [Kraken~Method](https://github.com/jpcx/node-kraken-api/blob/0.4.1/docs/namespaces/Kraken.md#~Method) |  | Method being called. |
| `options` | [Kraken~Options](https://github.com/jpcx/node-kraken-api/blob/0.4.1/docs/namespaces/Kraken.md#~Options) | \<optional> | Method-specific options. |
| `cb` | [API~Callback](https://github.com/jpcx/node-kraken-api/blob/0.4.1/docs/namespaces/API.md#~Callback) | \<optional> | Optional callback for error or data. |

Source:

* [node-kraken-api/api/calls/loadCall.js](https://github.com/jpcx/node-kraken-api/blob/0.4.1/api/calls/loadCall.js), [line 267](https://github.com/jpcx/node-kraken-api/blob/0.4.1/api/calls/loadCall.js#L267)

__Throws:__

Throws 'Invalid method' if method is not found in [Settings~Config](https://github.com/jpcx/node-kraken-api/blob/0.4.1/docs/namespaces/Settings.md#~Config).

___Type:___

* Error

__Returns:__

Promise which resolves with error or data (if no callback supplied), or `true` if operation registered successfully.

___Type:___

* Promise | boolean

<a name="~HandleResponse"></a>

### (inner) HandleResponse(settings, res) → \{Promise}

Handles request responses.

__Parameters:__

| Name | Type | Description |
| --- | --- | --- |
| `settings` | [Settings~Config](https://github.com/jpcx/node-kraken-api/blob/0.4.1/docs/namespaces/Settings.md#~Config) | Instance settings. |
| `res` | Object | Provides an 'on' function which emits 'data' and 'end' events while receiving data chunks from request. |

Source:

* [node-kraken-api/api/calls/loadCall.js](https://github.com/jpcx/node-kraken-api/blob/0.4.1/api/calls/loadCall.js), [line 14](https://github.com/jpcx/node-kraken-api/blob/0.4.1/api/calls/loadCall.js#L14)

__Returns:__

Promise that resolves with call data or rejects with any errors.

___Type:___

* Promise

<a name="~MakeRequest"></a>

### (inner) MakeRequest(settings, params) → \{Promise}

Makes a request to the Kraken server-side API.

__Parameters:__

| Name | Type | Description |
| --- | --- | --- |
| `settings` | [Settings~Config](https://github.com/jpcx/node-kraken-api/blob/0.4.1/docs/namespaces/Settings.md#~Config) | Instance settings. |
| `params` | [API\~Calls~Params](https://github.com/jpcx/node-kraken-api/blob/0.4.1/docs/namespaces/API/Calls.md#~Params) | Call parameters. |

Source:

* [node-kraken-api/api/calls/loadCall.js](https://github.com/jpcx/node-kraken-api/blob/0.4.1/api/calls/loadCall.js), [line 58](https://github.com/jpcx/node-kraken-api/blob/0.4.1/api/calls/loadCall.js#L58)

__Returns:__

Resolves after successful operation and rejects upon errors.

___Type:___

* Promise

<a name="~ParseArgs"></a>

### (inner) ParseArgs(settings, method, options, otp, cb) → \{[API\~Calls~Arguments](https://github.com/jpcx/node-kraken-api/blob/0.4.1/docs/namespaces/API/Calls.md#~Arguments)}

Parses inputted arguments and reassigns them based on their type. Arguments will be successfully recognized regardless of omissions.

__Parameters:__

| Name | Type | Description |
| --- | --- | --- |
| `settings` | [Settings~Config](https://github.com/jpcx/node-kraken-api/blob/0.4.1/docs/namespaces/Settings.md#~Config) | Current settings configuration. |
| `method` | [Kraken~Method](https://github.com/jpcx/node-kraken-api/blob/0.4.1/docs/namespaces/Kraken.md#~Method) | Method being called. |
| `options` | [Kraken~Options](https://github.com/jpcx/node-kraken-api/blob/0.4.1/docs/namespaces/Kraken.md#~Options) | Method-specific options. |
| `otp` | [Kraken~OTP](https://github.com/jpcx/node-kraken-api/blob/0.4.1/docs/namespaces/Kraken.md#~OTP) | Two-factor password. |
| `cb` | [API~Callback](https://github.com/jpcx/node-kraken-api/blob/0.4.1/docs/namespaces/API.md#~Callback) | Listener for errors and data. |

Source:

* [node-kraken-api/api/calls/loadCall.js](https://github.com/jpcx/node-kraken-api/blob/0.4.1/api/calls/loadCall.js), [line 186](https://github.com/jpcx/node-kraken-api/blob/0.4.1/api/calls/loadCall.js#L186)

__Throws:__

Throws 'Bad arguments' or 'Bad method' errors if arguments are invalid.

___Type:___

* Error

__Returns:__

Parsed arguments.

___Type:___

* [API\~Calls~Arguments](https://github.com/jpcx/node-kraken-api/blob/0.4.1/docs/namespaces/API/Calls.md#~Arguments)

<a name="~ProcessCalls"></a>

### (inner) ProcessCalls(settings, cat, thread, serialReg, limiter) → \{Promise}

Processes a call queue for a given rate-limit category.

__Parameters:__

| Name | Type | Description |
| --- | --- | --- |
| `settings` | [Settings~Config](https://github.com/jpcx/node-kraken-api/blob/0.4.1/docs/namespaces/Settings.md#~Config) | Execution settings configuraiton. |
| `cat` | [API\~RateLimits~Category](https://github.com/jpcx/node-kraken-api/blob/0.4.1/docs/namespaces/API/RateLimits.md#~Category) | Rate-limit category. |
| `thread` | [API\~Calls~Thread](https://github.com/jpcx/node-kraken-api/blob/0.4.1/docs/namespaces/API/Calls.md#~Thread) | Map of serialized parameters to listeners sets. |
| `serialReg` | [API\~Calls~SerialRegistry](https://github.com/jpcx/node-kraken-api/blob/0.4.1/docs/namespaces/API/Calls.md#~SerialRegistry) | Map of serialized params to actual parameter data. |
| `limiter` | [API\~RateLimits~Functions](https://github.com/jpcx/node-kraken-api/blob/0.4.1/docs/namespaces/API/RateLimits.md#~Functions) | Rate-limit handler. |

Source:

* [node-kraken-api/api/calls/loadCall.js](https://github.com/jpcx/node-kraken-api/blob/0.4.1/api/calls/loadCall.js), [line 90](https://github.com/jpcx/node-kraken-api/blob/0.4.1/api/calls/loadCall.js#L90)

__Returns:__

Returns a promise that resolves once all calls for a given category have completed. Rejects with operational errors.

___Type:___

* Promise

<a name="~QueueCall"></a>

### (inner) QueueCall(settings, state, args, opListener, retryCt)

Attaches calls to state maps. Launches dequeue operation if necessary. Recursively calls itself in response to call errors, depending on [Settings~Config](https://github.com/jpcx/node-kraken-api/blob/0.4.1/docs/namespaces/Settings.md#~Config).retryCt.

__Parameters:__

| Name | Type | Description |
| --- | --- | --- |
| `settings` | [Settings~Config](https://github.com/jpcx/node-kraken-api/blob/0.4.1/docs/namespaces/Settings.md#~Config) | Execution settings configuraiton. |
| `state` | [API\~Calls~State](https://github.com/jpcx/node-kraken-api/blob/0.4.1/docs/namespaces/API/Calls.md#~State) | Current state variables. |
| `args` | [API\~Calls~Arguments](https://github.com/jpcx/node-kraken-api/blob/0.4.1/docs/namespaces/API/Calls.md#~Arguments) | Call-specific arguments. |
| `opListener` | [API\~Calls~OpListener](https://github.com/jpcx/node-kraken-api/blob/0.4.1/docs/namespaces/API/Calls.md#~OpListener) | Listener error and data in order to resolve or reject the operational promise or to forward to the [API~Callback](https://github.com/jpcx/node-kraken-api/blob/0.4.1/docs/namespaces/API.md#~Callback). |
| `retryCt` | [API\~Calls~RetryCount](https://github.com/jpcx/node-kraken-api/blob/0.4.1/docs/namespaces/API/Calls.md#~RetryCount) | Number of times call has been attempted. |

Source:

* [node-kraken-api/api/calls/loadCall.js](https://github.com/jpcx/node-kraken-api/blob/0.4.1/api/calls/loadCall.js), [line 139](https://github.com/jpcx/node-kraken-api/blob/0.4.1/api/calls/loadCall.js#L139)

## Type Definitions

<a name="~Arguments"></a>

### Arguments

Object of parsed arguments provided to the call function.

__Type:__

* Object

__Properties:__

| Name | Type | Description |
| --- | --- | --- |
| `method` | [Kraken~Method](https://github.com/jpcx/node-kraken-api/blob/0.4.1/docs/namespaces/Kraken.md#~Method) | Call method. |
| `options` | [Kraken~Options](https://github.com/jpcx/node-kraken-api/blob/0.4.1/docs/namespaces/Kraken.md#~Options) | Method-specific options. |
| `cb` | [API~Callback](https://github.com/jpcx/node-kraken-api/blob/0.4.1/docs/namespaces/API.md#~Callback) | Callback for error or data. |

Source:

* [node-kraken-api/api/calls/calls.jsdoc](https://github.com/jpcx/node-kraken-api/blob/0.4.1/api/calls/calls.jsdoc), [line 16](https://github.com/jpcx/node-kraken-api/blob/0.4.1/api/calls/calls.jsdoc#L16)

<a name="~CallData"></a>

### CallData

Response data for a given call after any parsing processes.

__Type:__

* Object

Source:

* [node-kraken-api/api/calls/calls.jsdoc](https://github.com/jpcx/node-kraken-api/blob/0.4.1/api/calls/calls.jsdoc), [line 51](https://github.com/jpcx/node-kraken-api/blob/0.4.1/api/calls/calls.jsdoc#L51)

<a name="~CallError"></a>

### CallError

Response errors for a given call.

__Type:__

* Error

Source:

* [node-kraken-api/api/calls/calls.jsdoc](https://github.com/jpcx/node-kraken-api/blob/0.4.1/api/calls/calls.jsdoc), [line 45](https://github.com/jpcx/node-kraken-api/blob/0.4.1/api/calls/calls.jsdoc#L45)

<a name="~CatThreads"></a>

### CatThreads

Holds maps of [API\~Calls~Params](https://github.com/jpcx/node-kraken-api/blob/0.4.1/docs/namespaces/API/Calls.md#~Params) to internal instances by rate-limit category. Different categories are executed in parallel.

__Type:__

* Map.<[API\~RateLimits~Category](https://github.com/jpcx/node-kraken-api/blob/0.4.1/docs/namespaces/API/RateLimits.md#~Category), [API\~Calls~Thread](https://github.com/jpcx/node-kraken-api/blob/0.4.1/docs/namespaces/API/Calls.md#~Thread)>

Source:

* [node-kraken-api/api/calls/calls.jsdoc](https://github.com/jpcx/node-kraken-api/blob/0.4.1/api/calls/calls.jsdoc), [line 101](https://github.com/jpcx/node-kraken-api/blob/0.4.1/api/calls/calls.jsdoc#L101)

<a name="~ListenerSet"></a>

### ListenerSet

Set of all lower listeners associated with a call.

__Type:__

* Set.<[API\~Calls~RetryListener](https://github.com/jpcx/node-kraken-api/blob/0.4.1/docs/namespaces/API/Calls.md#~RetryListener)>

Source:

* [node-kraken-api/api/calls/calls.jsdoc](https://github.com/jpcx/node-kraken-api/blob/0.4.1/api/calls/calls.jsdoc), [line 107](https://github.com/jpcx/node-kraken-api/blob/0.4.1/api/calls/calls.jsdoc#L107)

<a name="~OpListener"></a>

### OpListener(err, data)

Listener created upon first execution of call function which resolves the operational promise or rejects it.

__Parameters:__

| Name | Type | Description |
| --- | --- | --- |
| `err` | Error | Any operational errors or [API\~Calls~CallError](https://github.com/jpcx/node-kraken-api/blob/0.4.1/docs/namespaces/API/Calls.md#~CallError) |
| `data` | [API\~Calls~CallData](https://github.com/jpcx/node-kraken-api/blob/0.4.1/docs/namespaces/API/Calls.md#~CallData) | Data received from call. |

Source:

* [node-kraken-api/api/calls/calls.jsdoc](https://github.com/jpcx/node-kraken-api/blob/0.4.1/api/calls/calls.jsdoc), [line 83](https://github.com/jpcx/node-kraken-api/blob/0.4.1/api/calls/calls.jsdoc#L83)

<a name="~Params"></a>

### Params

Holds data for Kraken call method and options.

__Type:__

* Object

__Properties:__

| Name | Type | Description |
| --- | --- | --- |
| `method` | [Kraken~Method](https://github.com/jpcx/node-kraken-api/blob/0.4.1/docs/namespaces/Kraken.md#~Method) | Method being called. |
| `options` | [Kraken~Options](https://github.com/jpcx/node-kraken-api/blob/0.4.1/docs/namespaces/Kraken.md#~Options) | Method-specific options. |

Source:

* [node-kraken-api/api/calls/calls.jsdoc](https://github.com/jpcx/node-kraken-api/blob/0.4.1/api/calls/calls.jsdoc), [line 57](https://github.com/jpcx/node-kraken-api/blob/0.4.1/api/calls/calls.jsdoc#L57)

<a name="~RequestData"></a>

### RequestData

Request data prepared for use with the 'https' module.

__Type:__

* Object

__Properties:__

| Name | Type | Description |
| --- | --- | --- |
| `options` | [Kraken~HTTPSRequestOptions](https://github.com/jpcx/node-kraken-api/blob/0.4.1/docs/namespaces/Kraken.md#~HTTPSRequestOptions) | Options for HTTPS request to Kraken servers. |
| `post` | [Kraken~HTTPSRequestPOSTData](https://github.com/jpcx/node-kraken-api/blob/0.4.1/docs/namespaces/Kraken.md#~HTTPSRequestPOSTData) | POST data for HTTPS request to Kraken servers. |

Source:

* [node-kraken-api/api/calls/calls.jsdoc](https://github.com/jpcx/node-kraken-api/blob/0.4.1/api/calls/calls.jsdoc), [line 31](https://github.com/jpcx/node-kraken-api/blob/0.4.1/api/calls/calls.jsdoc#L31)

<a name="~RetryCount"></a>

### RetryCount

Number of times that a call has been retried in response to an error. Includes retries due to rate limit violations.

__Type:__

* number

Source:

* [node-kraken-api/api/calls/calls.jsdoc](https://github.com/jpcx/node-kraken-api/blob/0.4.1/api/calls/calls.jsdoc), [line 77](https://github.com/jpcx/node-kraken-api/blob/0.4.1/api/calls/calls.jsdoc#L77)

<a name="~RetryListener"></a>

### RetryListener(err, data)

Listener created during call queueing; data is forwarded to [API\~Calls~OpListener](https://github.com/jpcx/node-kraken-api/blob/0.4.1/docs/namespaces/API/Calls.md#~OpListener); errors trigger a retry attempt if possible- if not, they are forwarded to the [API\~Calls~OpListener](https://github.com/jpcx/node-kraken-api/blob/0.4.1/docs/namespaces/API/Calls.md#~OpListener).

__Parameters:__

| Name | Type | Description |
| --- | --- | --- |
| `err` | Error | Any operational errors or [API\~Calls~CallError](https://github.com/jpcx/node-kraken-api/blob/0.4.1/docs/namespaces/API/Calls.md#~CallError) |
| `data` | [API\~Calls~CallData](https://github.com/jpcx/node-kraken-api/blob/0.4.1/docs/namespaces/API/Calls.md#~CallData) | Data received from call. |

Source:

* [node-kraken-api/api/calls/calls.jsdoc](https://github.com/jpcx/node-kraken-api/blob/0.4.1/api/calls/calls.jsdoc), [line 92](https://github.com/jpcx/node-kraken-api/blob/0.4.1/api/calls/calls.jsdoc#L92)

<a name="~SerialParams"></a>

### SerialParams

Alphabetized and serialized [API\~Calls~Params](https://github.com/jpcx/node-kraken-api/blob/0.4.1/docs/namespaces/API/Calls.md#~Params) used for identifying multiple copies of the same call parameters.

__Type:__

* string

Source:

* [node-kraken-api/api/calls/calls.jsdoc](https://github.com/jpcx/node-kraken-api/blob/0.4.1/api/calls/calls.jsdoc), [line 65](https://github.com/jpcx/node-kraken-api/blob/0.4.1/api/calls/calls.jsdoc#L65)

<a name="~SerialRegistry"></a>

### SerialRegistry

Map of serialized params to actual param objects.

__Type:__

* Map.<[API\~Calls~SerialParams](https://github.com/jpcx/node-kraken-api/blob/0.4.1/docs/namespaces/API/Calls.md#~SerialParams), [API\~Calls~Params](https://github.com/jpcx/node-kraken-api/blob/0.4.1/docs/namespaces/API/Calls.md#~Params)>

Source:

* [node-kraken-api/api/calls/calls.jsdoc](https://github.com/jpcx/node-kraken-api/blob/0.4.1/api/calls/calls.jsdoc), [line 71](https://github.com/jpcx/node-kraken-api/blob/0.4.1/api/calls/calls.jsdoc#L71)

<a name="~Signature"></a>

### Signature

Cryptographic signature of a given call according to the specifications listed in the [Kraken API Docs](https://www.kraken.com/help/api#general-usage).

__Type:__

* Object

Source:

* [node-kraken-api/api/calls/calls.jsdoc](https://github.com/jpcx/node-kraken-api/blob/0.4.1/api/calls/calls.jsdoc), [line 39](https://github.com/jpcx/node-kraken-api/blob/0.4.1/api/calls/calls.jsdoc#L39)

<a name="~State"></a>

### State

Holds information essential to call operations during state.

__Properties:__

| Name | Type | Description |
| --- | --- | --- |
| `settings` | [Settings~Config](https://github.com/jpcx/node-kraken-api/blob/0.4.1/docs/namespaces/Settings.md#~Config) | Execution settings configuration. |
| `limiter` | [API\~RateLimits~Functions](https://github.com/jpcx/node-kraken-api/blob/0.4.1/docs/namespaces/API/RateLimits.md#~Functions) | Limiter object. |
| `catThreads` | [API\~Calls~CatThreads](https://github.com/jpcx/node-kraken-api/blob/0.4.1/docs/namespaces/API/Calls.md#~CatThreads) | Category-based execution threads. |
| `serialReg` | [API\~Calls~SerialRegistry](https://github.com/jpcx/node-kraken-api/blob/0.4.1/docs/namespaces/API/Calls.md#~SerialRegistry) | Maps serialized params to actual params. |

Source:

* [node-kraken-api/api/calls/loadCall.js](https://github.com/jpcx/node-kraken-api/blob/0.4.1/api/calls/loadCall.js), [line 251](https://github.com/jpcx/node-kraken-api/blob/0.4.1/api/calls/loadCall.js#L251)

<a name="~Thread"></a>

### Thread

Maps serial params to sets of associated listeners.

__Type:__

* Map.<[API\~Calls~SerialParams](https://github.com/jpcx/node-kraken-api/blob/0.4.1/docs/namespaces/API/Calls.md#~SerialParams), [API\~Calls~ListenerSet](https://github.com/jpcx/node-kraken-api/blob/0.4.1/docs/namespaces/API/Calls.md#~ListenerSet)>

Source:

* [node-kraken-api/api/calls/calls.jsdoc](https://github.com/jpcx/node-kraken-api/blob/0.4.1/api/calls/calls.jsdoc), [line 113](https://github.com/jpcx/node-kraken-api/blob/0.4.1/api/calls/calls.jsdoc#L113)

<a name="~Timeout"></a>

### Timeout

Timeout (in ms) for terminating HTTPS connections.

__Type:__

* number

Source:

* [node-kraken-api/api/calls/calls.jsdoc](https://github.com/jpcx/node-kraken-api/blob/0.4.1/api/calls/calls.jsdoc), [line 25](https://github.com/jpcx/node-kraken-api/blob/0.4.1/api/calls/calls.jsdoc#L25)

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