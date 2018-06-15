# [API](https://github.com/jpcx/node-kraken-api/blob/develop/docs/namespaces/API.md)~Syncing

Types and methods specific to scheduling persistent API~Caller operations.

##### Properties:

| Name | Type | Description |
| --- | --- | --- |
| `loadSync` | [module:API/Syncing/loadSync](https://github.com/jpcx/node-kraken-api/blob/develop/docs/modules/API/Syncing/loadSync.md) | Loads settings and loaded call function and returns stateful sync creation function. |


Source:

*   [node-kraken-api/api/syncing/syncing.jsdoc](https://github.com/jpcx/node-kraken-api/blob/develop/api/syncing/syncing.jsdoc), [line 7](https://github.com/jpcx/node-kraken-api/blob/develop/api/syncing/syncing.jsdoc#L7)

### Methods

<a name=".calcAverageWait"></a>
#### (static) calcAverageWait(info) → \{number}

Calculates average wait time.

##### Parameters:

| Name | Type | Description |
| --- | --- | --- |
| `info` | [API\~Syncing~Info](https://github.com/jpcx/node-kraken-api/blob/develop/docs/namespaces/API/Syncing.md#~Info) | Object containing runtime data. |


Source:

*   [node-kraken-api/api/syncing/loadSync.js](https://github.com/jpcx/node-kraken-api/blob/develop/api/syncing/loadSync.js), [line 18](https://github.com/jpcx/node-kraken-api/blob/develop/api/syncing/loadSync.js#L18)

##### Returns:

Average wait time.

Type

number

<a name=".handleRequests"></a>
#### (async, static) handleRequests(info) → \{Promise}

Handles request queue and sends data to associated callbacks.

##### Parameters:

| Name | Type | Description |
| --- | --- | --- |
| `info` | [API\~Syncing~Info](https://github.com/jpcx/node-kraken-api/blob/develop/docs/namespaces/API/Syncing.md#~Info) | Object containing runtime data. |


Source:

*   [node-kraken-api/api/syncing/loadSync.js](https://github.com/jpcx/node-kraken-api/blob/develop/api/syncing/loadSync.js), [line 53](https://github.com/jpcx/node-kraken-api/blob/develop/api/syncing/loadSync.js#L53)

##### Throws:

Will throw any error which does not result directly from a call.

##### Returns:

Promise which resolves when there are no more requests to process and rejects when an error has been thrown.

Type

Promise

<a name=".parseArgs"></a>
#### (static) parseArgs(settings, method, options, listener) → \{Object}

Parses [API\~Syncing~Sync](https://github.com/jpcx/node-kraken-api/blob/develop/docs/namespaces/API/Syncing.md#~Sync) input and returns correct arguments unless invalid.

##### Parameters:

| Name | Type | Description |
| --- | --- | --- |
| `settings` | [Settings~Config](https://github.com/jpcx/node-kraken-api/blob/develop/docs/namespaces/Settings.md#~Config) | Settings configuration for method verification. |
| `method` | [Kraken~Method](https://github.com/jpcx/node-kraken-api/blob/develop/docs/namespaces/Kraken.md#~Method) | Method being called. |
| `options` | [Kraken~Options](https://github.com/jpcx/node-kraken-api/blob/develop/docs/namespaces/Kraken.md#~Options) | Method-specific options. |
| `listener` | [API\~Syncing~EventListener](https://github.com/jpcx/node-kraken-api/blob/develop/docs/namespaces/API/Syncing.md#~EventListener) | Listener for error and data events. |


Source:

*   [node-kraken-api/api/syncing/loadSync.js](https://github.com/jpcx/node-kraken-api/blob/develop/api/syncing/loadSync.js), [line 96](https://github.com/jpcx/node-kraken-api/blob/develop/api/syncing/loadSync.js#L96)

##### Throws:

Will throw 'Invalid Method' if method is not valid.

##### Returns:

Object containing correct arguments.

Type

Object

### Type Definitions

<a name="~addListener"></a>
#### addListener(listener) → \{boolean}

Adds an [API\~Syncing~EventListener](https://github.com/jpcx/node-kraken-api/blob/develop/docs/namespaces/API/Syncing.md#~EventListener) to the instance's request listeners.

##### Parameters:

| Name | Type | Description |
| --- | --- | --- |
| `listener` | [API\~Syncing~EventListener](https://github.com/jpcx/node-kraken-api/blob/develop/docs/namespaces/API/Syncing.md#~EventListener) | Listener function to add. |


Source:

*   [node-kraken-api/api/syncing/loadSync.js](https://github.com/jpcx/node-kraken-api/blob/develop/api/syncing/loadSync.js), [line 286](https://github.com/jpcx/node-kraken-api/blob/develop/api/syncing/loadSync.js#L286)

##### Returns:

True if added successfully.

Type

boolean

<a name="~close"></a>
#### close() → \{boolean}

Closes the instance if opened.

Source:

*   [node-kraken-api/api/syncing/loadSync.js](https://github.com/jpcx/node-kraken-api/blob/develop/api/syncing/loadSync.js), [line 279](https://github.com/jpcx/node-kraken-api/blob/develop/api/syncing/loadSync.js#L279)

##### Returns:

True if closed or already closed.

Type

boolean

<a name="~ClosingRequests"></a>
#### ClosingRequests

Set of all sync requests which have been instructed to close.

##### Type:

*   Set.<[API\~Syncing~Request](https://github.com/jpcx/node-kraken-api/blob/develop/docs/namespaces/API/Syncing.md#~Request)>

Source:

*   [node-kraken-api/api/syncing/syncing.jsdoc](https://github.com/jpcx/node-kraken-api/blob/develop/api/syncing/syncing.jsdoc), [line 26](https://github.com/jpcx/node-kraken-api/blob/develop/api/syncing/syncing.jsdoc#L26)

<a name="~Error"></a>
#### Error

Timestamped [API\~Calls~CallError](https://github.com/jpcx/node-kraken-api/blob/develop/docs/namespaces/API/Calls.md#~CallError) (or other execution error) which is added to the instance error array and sent to any available listeners.

##### Type:

*   Error

##### Properties:

| Name | Type | Description |
| --- | --- | --- |
| `time` | number | Time of the error. |


Source:

*   [node-kraken-api/api/syncing/syncing.jsdoc](https://github.com/jpcx/node-kraken-api/blob/develop/api/syncing/syncing.jsdoc), [line 48](https://github.com/jpcx/node-kraken-api/blob/develop/api/syncing/syncing.jsdoc#L48)

<a name="~EventListener"></a>
#### EventListener(err, data, instanceopt) → \{boolean|undefined}

Callback function that is executed upon sync errors or data events. Returning a truthy value from this function will instruct the sync operation to not assign the 'data' property of the [API\~Syncing~Instance](https://github.com/jpcx/node-kraken-api/blob/develop/docs/namespaces/API/Syncing.md#~Instance). In other words, returning a truthy value will inform the sync process that data will either be reassigned from within this event listener manually or does not need to be set.

##### Parameters:

| Name | Type | Attributes | Description |
| --- | --- | --- | --- |
| `err` | [API\~Syncing~Error](https://github.com/jpcx/node-kraken-api/blob/develop/docs/namespaces/API/Syncing.md#~Error) |  | Sync error. |
| `data` | [API\~Calls~CallData](https://github.com/jpcx/node-kraken-api/blob/develop/docs/namespaces/API/Calls.md#~CallData) |  | Data received from call. |
| `instance` | [API\~Syncing~Instance](https://github.com/jpcx/node-kraken-api/blob/develop/docs/namespaces/API/Syncing.md#~Instance) | \<optional> | Reference to the current instance, if necessary. |


Source:

*   [node-kraken-api/api/syncing/syncing.jsdoc](https://github.com/jpcx/node-kraken-api/blob/develop/api/syncing/syncing.jsdoc), [line 38](https://github.com/jpcx/node-kraken-api/blob/develop/api/syncing/syncing.jsdoc#L38)

##### Returns:

Returns truthy value if data does not need to be assigned by the sync operation internally; returns a falsy value if data does need to be assigned automatically.

Type

boolean | undefined

<a name="~getMethod"></a>
#### getMethod() → \{[Kraken~Method](https://github.com/jpcx/node-kraken-api/blob/develop/docs/namespaces/Kraken.md#~Method)}

Gets the current [Kraken~Method](https://github.com/jpcx/node-kraken-api/blob/develop/docs/namespaces/Kraken.md#~Method) associated with a sync instance.

Source:

*   [node-kraken-api/api/syncing/loadSync.js](https://github.com/jpcx/node-kraken-api/blob/develop/api/syncing/loadSync.js), [line 223](https://github.com/jpcx/node-kraken-api/blob/develop/api/syncing/loadSync.js#L223)

##### Returns:

Method associated with the instance.

Type

[Kraken~Method](https://github.com/jpcx/node-kraken-api/blob/develop/docs/namespaces/Kraken.md#~Method)

<a name="~getState"></a>
#### getState() → \{[API\~Syncing~State](https://github.com/jpcx/node-kraken-api/blob/develop/docs/namespaces/API/Syncing.md#~State)}

Gets the current state of the instance from the internal request.

Source:

*   [node-kraken-api/api/syncing/loadSync.js](https://github.com/jpcx/node-kraken-api/blob/develop/api/syncing/loadSync.js), [line 216](https://github.com/jpcx/node-kraken-api/blob/develop/api/syncing/loadSync.js#L216)

##### Returns:

Current state of the request.

Type

[API\~Syncing~State](https://github.com/jpcx/node-kraken-api/blob/develop/docs/namespaces/API/Syncing.md#~State)

<a name="~Info"></a>
#### Info

Contains runtime information to be passed around within sync operations.

##### Type:

*   Object

##### Properties:

| Name | Type | Description |
| --- | --- | --- |
| `tier` | [Kraken~Tier](https://github.com/jpcx/node-kraken-api/blob/develop/docs/namespaces/Kraken.md#~Tier) | Kraken verification tier. |
| `rateLimiter` | [Settings~RateLimiter](https://github.com/jpcx/node-kraken-api/blob/develop/docs/namespaces/Settings.md#~RateLimiter) | RateLimiter configuration. |
| `call` | [API\~Calls~Call](https://github.com/jpcx/node-kraken-api/blob/develop/docs/namespaces/API/Calls.md#~Call) | Stateful call function. |
| `requesting` | boolean | Whether or not a queue processing operation is in progress. |
| `open` | [API\~Syncing~OpenRequests](https://github.com/jpcx/node-kraken-api/blob/develop/docs/namespaces/API/Syncing.md#~OpenRequests) | Set of all open requests. |
| `closing` | [API\~Syncing~ClosingRequests](https://github.com/jpcx/node-kraken-api/blob/develop/docs/namespaces/API/Syncing.md#~ClosingRequests) | Set of all requests which should be closed. |


Source:

*   [node-kraken-api/api/syncing/loadSync.js](https://github.com/jpcx/node-kraken-api/blob/develop/api/syncing/loadSync.js), [line 132](https://github.com/jpcx/node-kraken-api/blob/develop/api/syncing/loadSync.js#L132)

<a name="~Instance"></a>
#### Instance

Sync instance used for behavior manipulation and data retrieval.

##### Type:

*   Object

##### Properties:

| Name | Type | Description |
| --- | --- | --- |
| `data` | [API\~Syncing~InstanceData](https://github.com/jpcx/node-kraken-api/blob/develop/docs/namespaces/API/Syncing.md#~InstanceData) | Defaults to Object that stores direct data from calls but may be reassigned within an [API\~Syncing~EventListener](https://github.com/jpcx/node-kraken-api/blob/develop/docs/namespaces/API/Syncing.md#~EventListener) or otherwise. |
| `time` | number | Time (in ms) since last successful [API\~Syncing~InstanceData](https://github.com/jpcx/node-kraken-api/blob/develop/docs/namespaces/API/Syncing.md#~InstanceData) update. |
| `options` | [Kraken~Options](https://github.com/jpcx/node-kraken-api/blob/develop/docs/namespaces/Kraken.md#~Options) | Current method-specific options. |
| `errors` | Array.<[API\~Syncing~Error](https://github.com/jpcx/node-kraken-api/blob/develop/docs/namespaces/API/Syncing.md#~Error)> | Array of errors encountered during sync execution. |
| `getState` | [API\~Syncing~getState](https://github.com/jpcx/node-kraken-api/blob/develop/docs/namespaces/API/Syncing.md#~getState) | Gets the current request state. |
| `getMethod` | [API\~Syncing~getMethod](https://github.com/jpcx/node-kraken-api/blob/develop/docs/namespaces/API/Syncing.md#~getMethod) | Gets the current [Kraken~Method](https://github.com/jpcx/node-kraken-api/blob/develop/docs/namespaces/Kraken.md#~Method). |
| `setMethod` | [API\~Syncing~setMethod](https://github.com/jpcx/node-kraken-api/blob/develop/docs/namespaces/API/Syncing.md#~setMethod) | Sets a new [Kraken~Method](https://github.com/jpcx/node-kraken-api/blob/develop/docs/namespaces/Kraken.md#~Method). |
| `open` | [API\~Syncing~open](https://github.com/jpcx/node-kraken-api/blob/develop/docs/namespaces/API/Syncing.md#~open) | Opens the instance if closed. |
| `close` | [API\~Syncing~close](https://github.com/jpcx/node-kraken-api/blob/develop/docs/namespaces/API/Syncing.md#~close) | Closes the instance if open. |
| `addListener` | [API\~Syncing~addListener](https://github.com/jpcx/node-kraken-api/blob/develop/docs/namespaces/API/Syncing.md#~addListener) | Adds a new [API\~Syncing~EventListener](https://github.com/jpcx/node-kraken-api/blob/develop/docs/namespaces/API/Syncing.md#~EventListener) to the request. |
| `removeListener` | [API\~Syncing~removeListener](https://github.com/jpcx/node-kraken-api/blob/develop/docs/namespaces/API/Syncing.md#~removeListener) | Removes a [API\~Syncing~EventListener](https://github.com/jpcx/node-kraken-api/blob/develop/docs/namespaces/API/Syncing.md#~EventListener) from the request. |
| `once` | [API\~Syncing~once](https://github.com/jpcx/node-kraken-api/blob/develop/docs/namespaces/API/Syncing.md#~once) | Adds a one-time [API\~Syncing~EventListener](https://github.com/jpcx/node-kraken-api/blob/develop/docs/namespaces/API/Syncing.md#~EventListener) if provided; otherwise returns a promise which resolves/rejects on the next error/data event. |


Source:

*   [node-kraken-api/api/syncing/loadSync.js](https://github.com/jpcx/node-kraken-api/blob/develop/api/syncing/loadSync.js), [line 171](https://github.com/jpcx/node-kraken-api/blob/develop/api/syncing/loadSync.js#L171)

<a name="~InstanceData"></a>
#### InstanceData

Data value of the instance. Defaults to an object that is replaced with [API\~Calls~CallData](https://github.com/jpcx/node-kraken-api/blob/develop/docs/namespaces/API/Calls.md#~CallData) upon every successful call, but may be customized within an [API\~Syncing~EventListener](https://github.com/jpcx/node-kraken-api/blob/develop/docs/namespaces/API/Syncing.md#~EventListener) or otherwise.

##### Type:

*   Object | *

Source:

*   [node-kraken-api/api/syncing/syncing.jsdoc](https://github.com/jpcx/node-kraken-api/blob/develop/api/syncing/syncing.jsdoc), [line 14](https://github.com/jpcx/node-kraken-api/blob/develop/api/syncing/syncing.jsdoc#L14)

<a name="~once"></a>
#### once(listeneropt) → \{boolean|Promise}

Adds a one-time [API\~Syncing~EventListener](https://github.com/jpcx/node-kraken-api/blob/develop/docs/namespaces/API/Syncing.md#~EventListener) to the instance's request listeners. If no listener is provided as a parameter, returns a promise which resolves with the next update's error or data.

##### Parameters:

| Name | Type | Attributes | Description |
| --- | --- | --- | --- |
| `listener` | [API\~Syncing~EventListener](https://github.com/jpcx/node-kraken-api/blob/develop/docs/namespaces/API/Syncing.md#~EventListener) | \<optional> | Once listener function to add. |


Source:

*   [node-kraken-api/api/syncing/loadSync.js](https://github.com/jpcx/node-kraken-api/blob/develop/api/syncing/loadSync.js), [line 302](https://github.com/jpcx/node-kraken-api/blob/develop/api/syncing/loadSync.js#L302)

##### Returns:

Returns true if added successfully or a promise if a listener function is not provided.

Type

boolean | Promise

<a name="~open"></a>
#### open() → \{boolean}

Opens the instance if closed.

Source:

*   [node-kraken-api/api/syncing/loadSync.js](https://github.com/jpcx/node-kraken-api/blob/develop/api/syncing/loadSync.js), [line 264](https://github.com/jpcx/node-kraken-api/blob/develop/api/syncing/loadSync.js#L264)

##### Returns:

True if opened or already open.

Type

boolean

<a name="~OpenRequests"></a>
#### OpenRequests

Set of all open sync requests currently being processed.

##### Type:

*   Set.<[API\~Syncing~Request](https://github.com/jpcx/node-kraken-api/blob/develop/docs/namespaces/API/Syncing.md#~Request)>

Source:

*   [node-kraken-api/api/syncing/syncing.jsdoc](https://github.com/jpcx/node-kraken-api/blob/develop/api/syncing/syncing.jsdoc), [line 20](https://github.com/jpcx/node-kraken-api/blob/develop/api/syncing/syncing.jsdoc#L20)

<a name="~removeListener"></a>
#### removeListener(listener) → \{boolean}

Removes an [API\~Syncing~EventListener](https://github.com/jpcx/node-kraken-api/blob/develop/docs/namespaces/API/Syncing.md#~EventListener) from the instance's request listeners.

##### Parameters:

| Name | Type | Description |
| --- | --- | --- |
| `listener` | [API\~Syncing~EventListener](https://github.com/jpcx/node-kraken-api/blob/develop/docs/namespaces/API/Syncing.md#~EventListener) | Listener function to remove. |


Source:

*   [node-kraken-api/api/syncing/loadSync.js](https://github.com/jpcx/node-kraken-api/blob/develop/api/syncing/loadSync.js), [line 294](https://github.com/jpcx/node-kraken-api/blob/develop/api/syncing/loadSync.js#L294)

##### Returns:

True if not in the listeners set.

Type

boolean

<a name="~Request"></a>
#### Request

Internal sync instance data.

##### Type:

*   Object

##### Properties:

| Name | Type | Description |
| --- | --- | --- |
| `state` | [API\~Syncing~State](https://github.com/jpcx/node-kraken-api/blob/develop/docs/namespaces/API/Syncing.md#~State) | Current state of the request. |
| `method` | [Kraken~Method](https://github.com/jpcx/node-kraken-api/blob/develop/docs/namespaces/Kraken.md#~Method) | Current Kraken method. |
| `options` | [Kraken~Options](https://github.com/jpcx/node-kraken-api/blob/develop/docs/namespaces/Kraken.md#~Options) | Method-specific options. |
| `instance` | [API\~Syncing~Instance](https://github.com/jpcx/node-kraken-api/blob/develop/docs/namespaces/API/Syncing.md#~Instance) | Instance being tracked. |
| `listeners` | Set.<[API\~Syncing~EventListener](https://github.com/jpcx/node-kraken-api/blob/develop/docs/namespaces/API/Syncing.md#~EventListener)> | Set of all associated event listeners. |
| `errors` | Array.<[API\~Syncing~Error](https://github.com/jpcx/node-kraken-api/blob/develop/docs/namespaces/API/Syncing.md#~Error)> | Array of errors encountered during sync execution. |


Source:

*   [node-kraken-api/api/syncing/loadSync.js](https://github.com/jpcx/node-kraken-api/blob/develop/api/syncing/loadSync.js), [line 193](https://github.com/jpcx/node-kraken-api/blob/develop/api/syncing/loadSync.js#L193)

<a name="~setMethod"></a>
#### setMethod(method) → \{boolean}

Sets a new [Kraken~Method](https://github.com/jpcx/node-kraken-api/blob/develop/docs/namespaces/Kraken.md#~Method) to the instance. Ensures that a proper method is used by referencing the [Kraken~PublicMethods](https://github.com/jpcx/node-kraken-api/blob/develop/docs/namespaces/Kraken.md#~PublicMethods) and the [Kraken~PrivateMethods](https://github.com/jpcx/node-kraken-api/blob/develop/docs/namespaces/Kraken.md#~PrivateMethods) within the [Settings~Config](https://github.com/jpcx/node-kraken-api/blob/develop/docs/namespaces/Settings.md#~Config). Fixes capitalization errors.

##### Parameters:

| Name | Type | Description |
| --- | --- | --- |
| `method` | [Kraken~Method](https://github.com/jpcx/node-kraken-api/blob/develop/docs/namespaces/Kraken.md#~Method) | New method to set. |


Source:

*   [node-kraken-api/api/syncing/loadSync.js](https://github.com/jpcx/node-kraken-api/blob/develop/api/syncing/loadSync.js), [line 230](https://github.com/jpcx/node-kraken-api/blob/develop/api/syncing/loadSync.js#L230)

##### Throws:

Will throw 'Invalid Method' if method is not valid.

##### Returns:

True if successful.

Type

boolean

<a name="~State"></a>
#### State

Current state of the instance's request. 'init' if first [API\~Calls~CallData](https://github.com/jpcx/node-kraken-api/blob/develop/docs/namespaces/API/Calls.md#~CallData) has not been received; 'open' if queued; 'closed' if not queued.

##### Type:

*   'init' | 'open' | 'closed'

Source:

*   [node-kraken-api/api/syncing/syncing.jsdoc](https://github.com/jpcx/node-kraken-api/blob/develop/api/syncing/syncing.jsdoc), [line 32](https://github.com/jpcx/node-kraken-api/blob/develop/api/syncing/syncing.jsdoc#L32)

<a name="~Sync"></a>
#### Sync(method, optionsopt, listeneropt) → \{[API\~Syncing~Instance](https://github.com/jpcx/node-kraken-api/blob/develop/docs/namespaces/API/Syncing.md#~Instance)}

Stateful function which creates sync instances.

##### Parameters:

| Name | Type | Attributes | Default | Description |
| --- | --- | --- | --- | --- |
| `method` | [Kraken~Method](https://github.com/jpcx/node-kraken-api/blob/develop/docs/namespaces/Kraken.md#~Method) |  |  | Method being called. |
| `options` | [Kraken~Options](https://github.com/jpcx/node-kraken-api/blob/develop/docs/namespaces/Kraken.md#~Options) | \<optional> | {} | Method-specific options. |
| `listener` | [API\~Syncing~EventListener](https://github.com/jpcx/node-kraken-api/blob/develop/docs/namespaces/API/Syncing.md#~EventListener) | \<optional> |  | Listener for error and data events. |


Source:

*   [node-kraken-api/api/syncing/loadSync.js](https://github.com/jpcx/node-kraken-api/blob/develop/api/syncing/loadSync.js), [line 151](https://github.com/jpcx/node-kraken-api/blob/develop/api/syncing/loadSync.js#L151)

##### Returns:

Instance of sync operation.

Type

[API\~Syncing~Instance](https://github.com/jpcx/node-kraken-api/blob/develop/docs/namespaces/API/Syncing.md#~Instance)

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