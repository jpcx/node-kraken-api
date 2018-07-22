# [API](https://github.com/jpcx/node-kraken-api/blob/0.4.1/docs/namespaces/API.md)~Syncing

Types and methods specific to scheduling persistent [API\~Calls~Call](https://github.com/jpcx/node-kraken-api/blob/0.4.1/docs/namespaces/API/Calls.md#~Call) operations.

__Properties:__

| Name | Type | Description |
| --- | --- | --- |
| `LoadSync` | [module:API/Syncing/LoadSync](https://github.com/jpcx/node-kraken-api/blob/0.4.1/docs/modules/API/Syncing/LoadSync.md) | Loads settings and loaded call function and returns stateful sync creation function. |

Source:

* [node-kraken-api/api/syncing/syncing.jsdoc](https://github.com/jpcx/node-kraken-api/blob/0.4.1/api/syncing/syncing.jsdoc), [line 7](https://github.com/jpcx/node-kraken-api/blob/0.4.1/api/syncing/syncing.jsdoc#L7)

## Methods

<a name="~AddListener"></a>

### (inner) AddListener(listener) → \{boolean}

Associates a new [API\~Syncing~EventListener](https://github.com/jpcx/node-kraken-api/blob/0.4.1/docs/namespaces/API/Syncing.md#~EventListener) with the instance.

__Parameters:__

| Name | Type | Description |
| --- | --- | --- |
| `listener` | [API\~Syncing~EventListener](https://github.com/jpcx/node-kraken-api/blob/0.4.1/docs/namespaces/API/Syncing.md#~EventListener) | Listener function to add. |

Source:

* [node-kraken-api/api/syncing/loadSync.js](https://github.com/jpcx/node-kraken-api/blob/0.4.1/api/syncing/loadSync.js), [line 443](https://github.com/jpcx/node-kraken-api/blob/0.4.1/api/syncing/loadSync.js#L443)

__Returns:__

True if added successfully.

___Type:___

* boolean

<a name="~Close"></a>

### (inner) Close() → \{boolean}

Closes the instance if opened.

Source:

* [node-kraken-api/api/syncing/loadSync.js](https://github.com/jpcx/node-kraken-api/blob/0.4.1/api/syncing/loadSync.js), [line 416](https://github.com/jpcx/node-kraken-api/blob/0.4.1/api/syncing/loadSync.js#L416)

__Returns:__

True if closed or already closed.

___Type:___

* boolean

<a name="~HandleRequests"></a>

### (inner) HandleRequests(state, cat) → \{Promise}

Handles request queue and sends data to associated [API\~Syncing~EventListener](https://github.com/jpcx/node-kraken-api/blob/0.4.1/docs/namespaces/API/Syncing.md#~EventListener)s.

__Parameters:__

| Name | Type | Description |
| --- | --- | --- |
| `state` | [API\~Syncing~State](https://github.com/jpcx/node-kraken-api/blob/0.4.1/docs/namespaces/API/Syncing.md#~State) | Object containing runtime data. |
| `cat` | [API\~RateLimits~Category](https://github.com/jpcx/node-kraken-api/blob/0.4.1/docs/namespaces/API/RateLimits.md#~Category) | Current rate-limit category. |

Source:

* [node-kraken-api/api/syncing/loadSync.js](https://github.com/jpcx/node-kraken-api/blob/0.4.1/api/syncing/loadSync.js), [line 132](https://github.com/jpcx/node-kraken-api/blob/0.4.1/api/syncing/loadSync.js#L132)

__Returns:__

Promise which resolves when there are no more requests to process and rejects upon any operational errors.

___Type:___

* Promise

<a name="~Once"></a>

### (inner) Once(listeneropt) → \{boolean|Promise}

Adds a one-time [API\~Syncing~EventListener](https://github.com/jpcx/node-kraken-api/blob/0.4.1/docs/namespaces/API/Syncing.md#~EventListener) to the instance. If no listener is provided as a parameter, returns a promise which resolves with the next update's error or data.

__Parameters:__

| Name | Type | Attributes | Description |
| --- | --- | --- | --- |
| `listener` | [API\~Syncing~EventListener](https://github.com/jpcx/node-kraken-api/blob/0.4.1/docs/namespaces/API/Syncing.md#~EventListener) | \<optional> | Once listener function to add. |

Source:

* [node-kraken-api/api/syncing/loadSync.js](https://github.com/jpcx/node-kraken-api/blob/0.4.1/api/syncing/loadSync.js), [line 459](https://github.com/jpcx/node-kraken-api/blob/0.4.1/api/syncing/loadSync.js#L459)

__Returns:__

Returns true if added successfully or a promise if a listener function is not provided.

___Type:___

* boolean | Promise

<a name="~Open"></a>

### (inner) Open() → \{boolean}

Opens the instance if closed.

Source:

* [node-kraken-api/api/syncing/loadSync.js](https://github.com/jpcx/node-kraken-api/blob/0.4.1/api/syncing/loadSync.js), [line 372](https://github.com/jpcx/node-kraken-api/blob/0.4.1/api/syncing/loadSync.js#L372)

__Returns:__

True if opened or already open.

___Type:___

* boolean

<a name="~ParseArgs"></a>

### (inner) ParseArgs(settings, method, options, interval, listener) → \{[API\~Syncing~Arguments](https://github.com/jpcx/node-kraken-api/blob/0.4.1/docs/namespaces/API/Syncing.md#~Arguments)}

Parses inputted arguments and reassigns them based on their type. Arguments will be successfully recognized regardless of omissions.

__Parameters:__

| Name | Type | Description |
| --- | --- | --- |
| `settings` | [Settings~Config](https://github.com/jpcx/node-kraken-api/blob/0.4.1/docs/namespaces/Settings.md#~Config) | Current settings configuration. |
| `method` | [Kraken~Method](https://github.com/jpcx/node-kraken-api/blob/0.4.1/docs/namespaces/Kraken.md#~Method) | Method being called. |
| `options` | [Kraken~Options](https://github.com/jpcx/node-kraken-api/blob/0.4.1/docs/namespaces/Kraken.md#~Options) | Method-specific options. |
| `interval` | [API\~Syncing~Interval](https://github.com/jpcx/node-kraken-api/blob/0.4.1/docs/namespaces/API/Syncing.md#~Interval) | Minimum sync update interval. |
| `listener` | [API\~Syncing~EventListener](https://github.com/jpcx/node-kraken-api/blob/0.4.1/docs/namespaces/API/Syncing.md#~EventListener) | Listener for errors and data. |

Source:

* [node-kraken-api/api/syncing/loadSync.js](https://github.com/jpcx/node-kraken-api/blob/0.4.1/api/syncing/loadSync.js), [line 209](https://github.com/jpcx/node-kraken-api/blob/0.4.1/api/syncing/loadSync.js#L209)

__Throws:__

Throws 'Bad arguments' or 'Bad method' errors if arguments are invalid.

___Type:___

* Error

__Returns:__

Parsed sync arguments.

___Type:___

* [API\~Syncing~Arguments](https://github.com/jpcx/node-kraken-api/blob/0.4.1/docs/namespaces/API/Syncing.md#~Arguments)

<a name="~RemoveListener"></a>

### (inner) RemoveListener(listener) → \{boolean}

Disassociates an [API\~Syncing~EventListener](https://github.com/jpcx/node-kraken-api/blob/0.4.1/docs/namespaces/API/Syncing.md#~EventListener) from the instance.

__Parameters:__

| Name | Type | Description |
| --- | --- | --- |
| `listener` | [API\~Syncing~EventListener](https://github.com/jpcx/node-kraken-api/blob/0.4.1/docs/namespaces/API/Syncing.md#~EventListener) | Listener function to remove. |

Source:

* [node-kraken-api/api/syncing/loadSync.js](https://github.com/jpcx/node-kraken-api/blob/0.4.1/api/syncing/loadSync.js), [line 451](https://github.com/jpcx/node-kraken-api/blob/0.4.1/api/syncing/loadSync.js#L451)

__Returns:__

True if not in the listeners set.

___Type:___

* boolean

<a name="~Sync"></a>

### (inner) Sync(method, optionsopt, intervalopt, listeneropt) → \{[API\~Syncing~Instance](https://github.com/jpcx/node-kraken-api/blob/0.4.1/docs/namespaces/API/Syncing.md#~Instance)}

Stateful function which creates sync instances. Any argument (except method) may be omitted and replaced with another, as long as the order \[options, interval, listener\] is preserved.

__Parameters:__

| Name | Type | Attributes | Description |
| --- | --- | --- | --- |
| `method` | [Kraken~Method](https://github.com/jpcx/node-kraken-api/blob/0.4.1/docs/namespaces/Kraken.md#~Method) |  | Method being called. |
| `options` | [Kraken~Options](https://github.com/jpcx/node-kraken-api/blob/0.4.1/docs/namespaces/Kraken.md#~Options) | \<optional> | Method-specific options. |
| `interval` | [API\~Syncing~Interval](https://github.com/jpcx/node-kraken-api/blob/0.4.1/docs/namespaces/API/Syncing.md#~Interval) | \<optional> | Minimum update interval for sync operation. |
| `listener` | [API\~Syncing~EventListener](https://github.com/jpcx/node-kraken-api/blob/0.4.1/docs/namespaces/API/Syncing.md#~EventListener) | \<optional> | Listener for error and data events. |

Source:

* [node-kraken-api/api/syncing/loadSync.js](https://github.com/jpcx/node-kraken-api/blob/0.4.1/api/syncing/loadSync.js), [line 307](https://github.com/jpcx/node-kraken-api/blob/0.4.1/api/syncing/loadSync.js#L307)

__Throws:__

Throws 'Bad arguments' or 'Bad method' errors if arguments are invalid.

___Type:___

* Error

__Returns:__

Instance of sync operation.

___Type:___

* [API\~Syncing~Instance](https://github.com/jpcx/node-kraken-api/blob/0.4.1/docs/namespaces/API/Syncing.md#~Instance)

<a name="~VerifyInternals"></a>

### (inner) VerifyInternals(state, cat, serial, internals)

Responds to changes to changes within the instances associated with the current thread. Pushes out errors if the params are invalid and reverts changes.

__Parameters:__

| Name | Type | Description |
| --- | --- | --- |
| `state` | [API\~Syncing~State](https://github.com/jpcx/node-kraken-api/blob/0.4.1/docs/namespaces/API/Syncing.md#~State) | Object containing runtime data. |
| `cat` | [API\~RateLimits~Category](https://github.com/jpcx/node-kraken-api/blob/0.4.1/docs/namespaces/API/RateLimits.md#~Category) | Rate limiting category of the current thread. |
| `serial` | [API\~Calls~SerialParams](https://github.com/jpcx/node-kraken-api/blob/0.4.1/docs/namespaces/API/Calls.md#~SerialParams) | Serial currently associated with the call that triggered verifyInternals. |
| `internals` | [API\~Syncing~InternalSet](https://github.com/jpcx/node-kraken-api/blob/0.4.1/docs/namespaces/API/Syncing.md#~InternalSet) | Set of all internals associated with the current thread. |

Source:

* [node-kraken-api/api/syncing/loadSync.js](https://github.com/jpcx/node-kraken-api/blob/0.4.1/api/syncing/loadSync.js), [line 11](https://github.com/jpcx/node-kraken-api/blob/0.4.1/api/syncing/loadSync.js#L11)

## Type Definitions

<a name="~Arguments"></a>

### Arguments

Contains parsed and assigned arguments from initial call of the sync operation.

__Type:__

* Object

__Properties:__

| Name | Type | Description |
| --- | --- | --- |
| `options` | [Kraken~Options](https://github.com/jpcx/node-kraken-api/blob/0.4.1/docs/namespaces/Kraken.md#~Options) | Method-specific options. |
| `interval` | [API\~Syncing~Interval](https://github.com/jpcx/node-kraken-api/blob/0.4.1/docs/namespaces/API/Syncing.md#~Interval) | Minimum sync update interval. |
| `listener` | [API\~Syncing~EventListener](https://github.com/jpcx/node-kraken-api/blob/0.4.1/docs/namespaces/API/Syncing.md#~EventListener) | Event listener for sync error and data events. |

Source:

* [node-kraken-api/api/syncing/syncing.jsdoc](https://github.com/jpcx/node-kraken-api/blob/0.4.1/api/syncing/syncing.jsdoc), [line 14](https://github.com/jpcx/node-kraken-api/blob/0.4.1/api/syncing/syncing.jsdoc#L14)

<a name="~CatThreads"></a>

### CatThreads

Holds maps of [API\~Calls~Params](https://github.com/jpcx/node-kraken-api/blob/0.4.1/docs/namespaces/API/Calls.md#~Params) to internal instances by rate-limit category. Different categories are executed in parallel.

__Type:__

* Map.<[API\~RateLimits~Category](https://github.com/jpcx/node-kraken-api/blob/0.4.1/docs/namespaces/API/RateLimits.md#~Category), [API\~Syncing~Thread](https://github.com/jpcx/node-kraken-api/blob/0.4.1/docs/namespaces/API/Syncing.md#~Thread)>

Source:

* [node-kraken-api/api/syncing/syncing.jsdoc](https://github.com/jpcx/node-kraken-api/blob/0.4.1/api/syncing/syncing.jsdoc), [line 57](https://github.com/jpcx/node-kraken-api/blob/0.4.1/api/syncing/syncing.jsdoc#L57)

<a name="~Error"></a>

### Error

Timestamped [API\~Calls~CallError](https://github.com/jpcx/node-kraken-api/blob/0.4.1/docs/namespaces/API/Calls.md#~CallError) (or other execution error) which is added to the instance error array and sent to any available listeners.

__Type:__

* Error

__Properties:__

| Name | Type | Description |
| --- | --- | --- |
| `time` | number | Time of the error. |

Source:

* [node-kraken-api/api/syncing/syncing.jsdoc](https://github.com/jpcx/node-kraken-api/blob/0.4.1/api/syncing/syncing.jsdoc), [line 50](https://github.com/jpcx/node-kraken-api/blob/0.4.1/api/syncing/syncing.jsdoc#L50)

<a name="~EventListener"></a>

### EventListener(err, data, instanceopt)

Callback function that is executed upon sync errors or data events.

__Parameters:__

| Name | Type | Attributes | Description |
| --- | --- | --- | --- |
| `err` | [API\~Syncing~Error](https://github.com/jpcx/node-kraken-api/blob/0.4.1/docs/namespaces/API/Syncing.md#~Error) |  | Sync error. |
| `data` | [API\~Calls~CallData](https://github.com/jpcx/node-kraken-api/blob/0.4.1/docs/namespaces/API/Calls.md#~CallData) |  | Data received from call. |
| `instance` | [API\~Syncing~Instance](https://github.com/jpcx/node-kraken-api/blob/0.4.1/docs/namespaces/API/Syncing.md#~Instance) | \<optional> | Reference to the current instance, if necessary. |

Source:

* [node-kraken-api/api/syncing/syncing.jsdoc](https://github.com/jpcx/node-kraken-api/blob/0.4.1/api/syncing/syncing.jsdoc), [line 41](https://github.com/jpcx/node-kraken-api/blob/0.4.1/api/syncing/syncing.jsdoc#L41)

<a name="~Instance"></a>

### Instance

Sync instance used for behavior manipulation and data retrieval.

__Type:__

* Object

__Properties:__

| Name | Type | Description |
| --- | --- | --- |
| `status` | [API\~Syncing~Status](https://github.com/jpcx/node-kraken-api/blob/0.4.1/docs/namespaces/API/Syncing.md#~Status) | Current status of the instance. Set to 'init' until request attempt, 'open' when active, and 'closed' when not. Note: changing this value during runtime will not change instance behaviors; use the associated 'open' and 'close' methods instead. |
| `interval` | [API\~Syncing~Interval](https://github.com/jpcx/node-kraken-api/blob/0.4.1/docs/namespaces/API/Syncing.md#~Interval) | Minimum sync update time. |
| `method` | [Kraken~Method](https://github.com/jpcx/node-kraken-api/blob/0.4.1/docs/namespaces/Kraken.md#~Method) | Current method associated with the instance. Changes to this value during runtime will result in thread reassignment if valid; if invalid, will be reverted and will notify the event listeners with an 'Invalid method' error. |
| `options` | [Kraken~Options](https://github.com/jpcx/node-kraken-api/blob/0.4.1/docs/namespaces/Kraken.md#~Options) | Current method-specific options. Changes to this value during runtime will result in map reassignment if valid; if invalid (not an object), will be reverted and will notify the event listeners with an 'Invalid options' error. |
| `data` | [API\~Syncing~InstanceData](https://github.com/jpcx/node-kraken-api/blob/0.4.1/docs/namespaces/API/Syncing.md#~InstanceData) | Object containing data from the last successful response. |
| `time` | number | Time (in ms) of last successful [API\~Syncing~InstanceData](https://github.com/jpcx/node-kraken-api/blob/0.4.1/docs/namespaces/API/Syncing.md#~InstanceData) update. |
| `open` | [API\~Syncing~Open](https://github.com/jpcx/node-kraken-api/blob/0.4.1/docs/namespaces/API/Syncing.md#~Open) | Opens the instance if closed. |
| `close` | [API\~Syncing~Close](https://github.com/jpcx/node-kraken-api/blob/0.4.1/docs/namespaces/API/Syncing.md#~Close) | Closes the instance if open. |
| `addListener` | [API\~Syncing~AddListener](https://github.com/jpcx/node-kraken-api/blob/0.4.1/docs/namespaces/API/Syncing.md#~AddListener) | Associates a new [API\~Syncing~EventListener](https://github.com/jpcx/node-kraken-api/blob/0.4.1/docs/namespaces/API/Syncing.md#~EventListener). |
| `removeListener` | [API\~Syncing~RemoveListener](https://github.com/jpcx/node-kraken-api/blob/0.4.1/docs/namespaces/API/Syncing.md#~RemoveListener) | Disassociates a [API\~Syncing~EventListener](https://github.com/jpcx/node-kraken-api/blob/0.4.1/docs/namespaces/API/Syncing.md#~EventListener). |
| `once` | [API\~Syncing~Once](https://github.com/jpcx/node-kraken-api/blob/0.4.1/docs/namespaces/API/Syncing.md#~Once) | Adds a one-time [API\~Syncing~EventListener](https://github.com/jpcx/node-kraken-api/blob/0.4.1/docs/namespaces/API/Syncing.md#~EventListener) if provided; otherwise returns a promise which resolves/rejects on the next error/data event. |

Source:

* [node-kraken-api/api/syncing/loadSync.js](https://github.com/jpcx/node-kraken-api/blob/0.4.1/api/syncing/loadSync.js), [line 328](https://github.com/jpcx/node-kraken-api/blob/0.4.1/api/syncing/loadSync.js#L328)

<a name="~InstanceData"></a>

### InstanceData

Data value of the instance. Defaults to an object that is replaced with [API\~Calls~CallData](https://github.com/jpcx/node-kraken-api/blob/0.4.1/docs/namespaces/API/Calls.md#~CallData) upon every successful call, but may be customized within an [API\~Syncing~EventListener](https://github.com/jpcx/node-kraken-api/blob/0.4.1/docs/namespaces/API/Syncing.md#~EventListener) or otherwise.

__Type:__

* Object | *

Source:

* [node-kraken-api/api/syncing/syncing.jsdoc](https://github.com/jpcx/node-kraken-api/blob/0.4.1/api/syncing/syncing.jsdoc), [line 23](https://github.com/jpcx/node-kraken-api/blob/0.4.1/api/syncing/syncing.jsdoc#L23)

<a name="~Internal"></a>

### Internal

Internal sync instance data.

__Type:__

* Object

__Properties:__

| Name | Type | Description |
| --- | --- | --- |
| `status` | [API\~Syncing~Status](https://github.com/jpcx/node-kraken-api/blob/0.4.1/docs/namespaces/API/Syncing.md#~Status) | Current status of the request. |
| `paused` | boolean | Whether or not sync updates are paused due to interval. |
| `interval` | [API\~Syncing~Interval](https://github.com/jpcx/node-kraken-api/blob/0.4.1/docs/namespaces/API/Syncing.md#~Interval) | Minimum sync update interval. |
| `params` | [API\~Calls~Params](https://github.com/jpcx/node-kraken-api/blob/0.4.1/docs/namespaces/API/Calls.md#~Params) | Object containing method and options. |
| `instance` | [API\~Syncing~Instance](https://github.com/jpcx/node-kraken-api/blob/0.4.1/docs/namespaces/API/Syncing.md#~Instance) | Instance being tracked. |
| `listeners` | Set.<[API\~Syncing~EventListener](https://github.com/jpcx/node-kraken-api/blob/0.4.1/docs/namespaces/API/Syncing.md#~EventListener)> | Set of all associated event listeners. |

Source:

* [node-kraken-api/api/syncing/loadSync.js](https://github.com/jpcx/node-kraken-api/blob/0.4.1/api/syncing/loadSync.js), [line 348](https://github.com/jpcx/node-kraken-api/blob/0.4.1/api/syncing/loadSync.js#L348)

<a name="~InternalSet"></a>

### InternalSet

Set of all internal instances associated with a call.

__Type:__

* Set.<[API\~Syncing~Internal](https://github.com/jpcx/node-kraken-api/blob/0.4.1/docs/namespaces/API/Syncing.md#~Internal)>

Source:

* [node-kraken-api/api/syncing/syncing.jsdoc](https://github.com/jpcx/node-kraken-api/blob/0.4.1/api/syncing/syncing.jsdoc), [line 69](https://github.com/jpcx/node-kraken-api/blob/0.4.1/api/syncing/syncing.jsdoc#L69)

<a name="~Interval"></a>

### Interval

Interval for sync updates. Triggers a removal of the instance from the update queue and spawns a timeout for re-integration.

__Type:__

* number

Source:

* [node-kraken-api/api/syncing/syncing.jsdoc](https://github.com/jpcx/node-kraken-api/blob/0.4.1/api/syncing/syncing.jsdoc), [line 35](https://github.com/jpcx/node-kraken-api/blob/0.4.1/api/syncing/syncing.jsdoc#L35)

<a name="~State"></a>

### State

Contains runtime information to be passed around within sync operations.

__Type:__

* Object

__Properties:__

| Name | Type | Description |
| --- | --- | --- |
| `settings` | [Settings~Config](https://github.com/jpcx/node-kraken-api/blob/0.4.1/docs/namespaces/Settings.md#~Config) | Settings configuration. |
| `limiter` | [API\~RateLimits~Functions](https://github.com/jpcx/node-kraken-api/blob/0.4.1/docs/namespaces/API/RateLimits.md#~Functions) | Limiter instance. |
| `call` | [API\~Calls~Call](https://github.com/jpcx/node-kraken-api/blob/0.4.1/docs/namespaces/API/Calls.md#~Call) | Stateful call function. |
| `catThreads` | [API\~Syncing~CatThreads](https://github.com/jpcx/node-kraken-api/blob/0.4.1/docs/namespaces/API/Syncing.md#~CatThreads) | Map of category to map of serials to internals set. |
| `serialReg` | [API\~Calls~SerialRegistry](https://github.com/jpcx/node-kraken-api/blob/0.4.1/docs/namespaces/API/Calls.md#~SerialRegistry) | Maps serialized params to actual params. |

Source:

* [node-kraken-api/api/syncing/loadSync.js](https://github.com/jpcx/node-kraken-api/blob/0.4.1/api/syncing/loadSync.js), [line 290](https://github.com/jpcx/node-kraken-api/blob/0.4.1/api/syncing/loadSync.js#L290)

<a name="~Status"></a>

### Status

Current state of the instance's request. 'init' if first [API\~Calls~CallData](https://github.com/jpcx/node-kraken-api/blob/0.4.1/docs/namespaces/API/Calls.md#~CallData) has not been received; 'open' if queued; 'closed' if not queued.

__Type:__

* 'init' | 'open' | 'closed'

Source:

* [node-kraken-api/api/syncing/syncing.jsdoc](https://github.com/jpcx/node-kraken-api/blob/0.4.1/api/syncing/syncing.jsdoc), [line 29](https://github.com/jpcx/node-kraken-api/blob/0.4.1/api/syncing/syncing.jsdoc#L29)

<a name="~Thread"></a>

### Thread

Maps serial params to internal instances.

__Type:__

* Map.<[API\~Calls~SerialParams](https://github.com/jpcx/node-kraken-api/blob/0.4.1/docs/namespaces/API/Calls.md#~SerialParams), [API\~Syncing~InternalSet](https://github.com/jpcx/node-kraken-api/blob/0.4.1/docs/namespaces/API/Syncing.md#~InternalSet)>

Source:

* [node-kraken-api/api/syncing/syncing.jsdoc](https://github.com/jpcx/node-kraken-api/blob/0.4.1/api/syncing/syncing.jsdoc), [line 63](https://github.com/jpcx/node-kraken-api/blob/0.4.1/api/syncing/syncing.jsdoc#L63)

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