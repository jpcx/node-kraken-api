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

*   [node-kraken-api/api/syncing/loadSync.js](https://github.com/jpcx/node-kraken-api/blob/develop/api/syncing/loadSync.js), [line 38](https://github.com/jpcx/node-kraken-api/blob/develop/api/syncing/loadSync.js#L38)

##### Returns:

Promise which resolves when there are no more requests to process and rejects when an error has been thrown.

Type

Promise

<a name="~AddListener"></a>
#### (inner) AddListener(listener) → \{boolean}

Adds a listening callback to for sync operation events.

##### Parameters:

| Name | Type | Description |
| --- | --- | --- |
| `listener` | [API\~Syncing~EventListener](https://github.com/jpcx/node-kraken-api/blob/develop/docs/namespaces/API/Syncing.md#~EventListener) | Callback for instance-specific events. |


Source:

*   [node-kraken-api/api/syncing/loadSync.js](https://github.com/jpcx/node-kraken-api/blob/develop/api/syncing/loadSync.js), [line 232](https://github.com/jpcx/node-kraken-api/blob/develop/api/syncing/loadSync.js#L232)

##### Returns:

True if listener has been registered or is already registered.

Type

boolean

<a name="~Close"></a>
#### (inner) Close() → \{boolean}

Closes the sync instance by removing it from the request queue.

Source:

*   [node-kraken-api/api/syncing/loadSync.js](https://github.com/jpcx/node-kraken-api/blob/develop/api/syncing/loadSync.js), [line 221](https://github.com/jpcx/node-kraken-api/blob/develop/api/syncing/loadSync.js#L221)

##### Returns:

True if instance has been closed or is already closed.

Type

boolean

<a name="~Open"></a>
#### (inner) Open() → \{boolean}

Opens the sync instance by adding it to the request queue (if not already added).

Source:

*   [node-kraken-api/api/syncing/loadSync.js](https://github.com/jpcx/node-kraken-api/blob/develop/api/syncing/loadSync.js), [line 204](https://github.com/jpcx/node-kraken-api/blob/develop/api/syncing/loadSync.js#L204)

##### Returns:

True if instance has been opened or is already open.

Type

boolean

<a name="~RemoveListener"></a>
#### (inner) RemoveListener(listener) → \{boolean}

Removes a listening callback from the set of listeners.

##### Parameters:

| Name | Type | Description |
| --- | --- | --- |
| `listener` | [API\~Syncing~EventListener](https://github.com/jpcx/node-kraken-api/blob/develop/docs/namespaces/API/Syncing.md#~EventListener) | Callback for instance-specific events. |


Source:

*   [node-kraken-api/api/syncing/loadSync.js](https://github.com/jpcx/node-kraken-api/blob/develop/api/syncing/loadSync.js), [line 244](https://github.com/jpcx/node-kraken-api/blob/develop/api/syncing/loadSync.js#L244)

##### Returns:

True if listener has been unregistered or is not registered.

Type

boolean

### Type Definitions

<a name="~DataBuilder"></a>
#### DataBuilder(instanceData, data) → \{[API\~Syncing~InstanceData](https://github.com/jpcx/node-kraken-api/blob/develop/docs/namespaces/API/Syncing.md#~InstanceData)}

A function which returns an object to set as the 'data' property of an [API\~Syncing~Instance](https://github.com/jpcx/node-kraken-api/blob/develop/docs/namespaces/API/Syncing.md#~Instance).

##### Parameters:

| Name | Type | Description |
| --- | --- | --- |
| `instanceData` | [API\~Syncing~InstanceData](https://github.com/jpcx/node-kraken-api/blob/develop/docs/namespaces/API/Syncing.md#~InstanceData) | Instance data. |
| `data` | [API\~Calls~CallData](https://github.com/jpcx/node-kraken-api/blob/develop/docs/namespaces/API/Calls.md#~CallData) | Current data. |


Source:

*   [node-kraken-api/api/syncing/syncing.jsdoc](https://github.com/jpcx/node-kraken-api/blob/develop/api/syncing/syncing.jsdoc), [line 81](https://github.com/jpcx/node-kraken-api/blob/develop/api/syncing/syncing.jsdoc#L81)

##### Returns:

Data to set as the instance.data property.

Type

[API\~Syncing~InstanceData](https://github.com/jpcx/node-kraken-api/blob/develop/docs/namespaces/API/Syncing.md#~InstanceData)

<a name="~DynamicKrakenOptions"></a>
#### DynamicKrakenOptions

An object which may contain functions that return [Kraken~Option](https://github.com/jpcx/node-kraken-api/blob/develop/docs/namespaces/Kraken.md#~Option)s for dynamic syncing.

##### Type:

*   Object

##### Properties:

| Name | Type | Description |
| --- | --- | --- |
| `*` | [Kraken~Option](https://github.com/jpcx/node-kraken-api/blob/develop/docs/namespaces/Kraken.md#~Option) \| [API\~Syncing~DynamicOption](https://github.com/jpcx/node-kraken-api/blob/develop/docs/namespaces/API/Syncing.md#~DynamicOption) | May contain standard options or dynamic options. |


Source:

*   [node-kraken-api/api/syncing/syncing.jsdoc](https://github.com/jpcx/node-kraken-api/blob/develop/api/syncing/syncing.jsdoc), [line 68](https://github.com/jpcx/node-kraken-api/blob/develop/api/syncing/syncing.jsdoc#L68)

<a name="~DynamicOption"></a>
#### DynamicOption(instanceData) → \{[Kraken~Option](https://github.com/jpcx/node-kraken-api/blob/develop/docs/namespaces/Kraken.md#~Option)}

A function which dynamically generates Kraken options based on previously received data.

##### Parameters:

| Name | Type | Description |
| --- | --- | --- |
| `instanceData` | [API\~Syncing~InstanceData](https://github.com/jpcx/node-kraken-api/blob/develop/docs/namespaces/API/Syncing.md#~InstanceData) | Current instance data. |


Source:

*   [node-kraken-api/api/syncing/syncing.jsdoc](https://github.com/jpcx/node-kraken-api/blob/develop/api/syncing/syncing.jsdoc), [line 60](https://github.com/jpcx/node-kraken-api/blob/develop/api/syncing/syncing.jsdoc#L60)

##### Returns:

Option to send to the server.

Type

[Kraken~Option](https://github.com/jpcx/node-kraken-api/blob/develop/docs/namespaces/Kraken.md#~Option)

<a name="~EventListener"></a>
#### EventListener(err, data, state)

Callback for instance-specific events.

##### Parameters:

| Name | Type | Description |
| --- | --- | --- |
| `err` | [API\~Syncing~SyncError](https://github.com/jpcx/node-kraken-api/blob/develop/docs/namespaces/API/Syncing.md#~SyncError) | Response error. |
| `data` | [API\~Calls~CallData](https://github.com/jpcx/node-kraken-api/blob/develop/docs/namespaces/API/Calls.md#~CallData) | Response data. |
| `state` | 'error' \| 'data' \| 'open' \| 'close' | Type of event that triggered the callback. |


Source:

*   [node-kraken-api/api/syncing/syncing.jsdoc](https://github.com/jpcx/node-kraken-api/blob/develop/api/syncing/syncing.jsdoc), [line 51](https://github.com/jpcx/node-kraken-api/blob/develop/api/syncing/syncing.jsdoc#L51)

<a name="~EventListeners"></a>
#### EventListeners

Maps [API\~Syncing~ID](https://github.com/jpcx/node-kraken-api/blob/develop/docs/namespaces/API/Syncing.md#~ID)s to [API\~Syncing~EventListener](https://github.com/jpcx/node-kraken-api/blob/develop/docs/namespaces/API/Syncing.md#~EventListener)s.

##### Type:

*   Map

Source:

*   [node-kraken-api/api/syncing/syncing.jsdoc](https://github.com/jpcx/node-kraken-api/blob/develop/api/syncing/syncing.jsdoc), [line 45](https://github.com/jpcx/node-kraken-api/blob/develop/api/syncing/syncing.jsdoc#L45)

<a name="~ID"></a>
#### ID

Unique incrementing ID used for sync request identification.

##### Type:

*   number

Source:

*   [node-kraken-api/api/syncing/syncing.jsdoc](https://github.com/jpcx/node-kraken-api/blob/develop/api/syncing/syncing.jsdoc), [line 14](https://github.com/jpcx/node-kraken-api/blob/develop/api/syncing/syncing.jsdoc#L14)

<a name="~Info"></a>
#### Info

Contains instance information used during sync process.

##### Type:

*   Object

##### Properties:

| Name | Type | Description |
| --- | --- | --- |
| `call` | [API\~Calls~Call](https://github.com/jpcx/node-kraken-api/blob/develop/docs/namespaces/API/Calls.md#~Call) | Call function. |
| `requests` | [API\~Syncing~Requests](https://github.com/jpcx/node-kraken-api/blob/develop/docs/namespaces/API/Syncing.md#~Requests) | Maps API\~Syncing~ID to request parameters. |
| `id` | [API\~Syncing~ID](https://github.com/jpcx/node-kraken-api/blob/develop/docs/namespaces/API/Syncing.md#~ID) | Incrementing ID used for sync assignment. |
| `requesting` | boolean | Whether or not there are currently active schedule operations. |
| `listeners` | [API\~Syncing~EventListeners](https://github.com/jpcx/node-kraken-api/blob/develop/docs/namespaces/API/Syncing.md#~EventListeners) | Event listeners for sync instances. |


Source:

*   [node-kraken-api/api/syncing/loadSync.js](https://github.com/jpcx/node-kraken-api/blob/develop/api/syncing/loadSync.js), [line 125](https://github.com/jpcx/node-kraken-api/blob/develop/api/syncing/loadSync.js#L125)

<a name="~Instance"></a>
#### Instance

Instance of sync operation.

##### Type:

*   Object

##### Properties:

| Name | Type | Description |
| --- | --- | --- |
| `state` | 'init' \| 'open' \| 'closed' | State is 'init' when initializing; 'open' when data has first been received and will continue to be received; 'closed' when data will no longer be received (one update may occur if it is in progress). |
| `data` | [API\~Calls~CallData](https://github.com/jpcx/node-kraken-api/blob/develop/docs/namespaces/API/Calls.md#~CallData) | Data received from last call. |
| `time` | number | Time (in ms) of last data update. |
| `errors` | Array.<[API\~Syncing~SyncError](https://github.com/jpcx/node-kraken-api/blob/develop/docs/namespaces/API/Syncing.md#~SyncError)> | List of errors with attached time (in ms). |
| `open` | [API\~Syncing~Open](https://github.com/jpcx/node-kraken-api/blob/develop/docs/namespaces/API/Syncing.md#~Open) | Function that opens the sync instance. |
| `close` | [API\~Syncing~Close](https://github.com/jpcx/node-kraken-api/blob/develop/docs/namespaces/API/Syncing.md#~Close) | Function that closes the sync instance. |
| `addListener` | [API\~Syncing~AddListener](https://github.com/jpcx/node-kraken-api/blob/develop/docs/namespaces/API/Syncing.md#~AddListener) | Adds a listener callback for instance-specific events. |
| `removeListener` | [API\~Syncing~RemoveListener](https://github.com/jpcx/node-kraken-api/blob/develop/docs/namespaces/API/Syncing.md#~RemoveListener) | Removes a callback from the listeners Set. |
| `next` | [API\~Syncing~Next](https://github.com/jpcx/node-kraken-api/blob/develop/docs/namespaces/API/Syncing.md#~Next) | Creates a promise which resolves on next data update and rejects if an error has occurred. |


Source:

*   [node-kraken-api/api/syncing/loadSync.js](https://github.com/jpcx/node-kraken-api/blob/develop/api/syncing/loadSync.js), [line 185](https://github.com/jpcx/node-kraken-api/blob/develop/api/syncing/loadSync.js#L185)

<a name="~InstanceData"></a>
#### InstanceData

The 'data' property for an [API\~Syncing~Instance](https://github.com/jpcx/node-kraken-api/blob/develop/docs/namespaces/API/Syncing.md#~Instance). Starts as `{}` and is, by default, replaced by any errorless call data received during each update. Replacements may be configured using an [API\~Syncing~DataBuilder](https://github.com/jpcx/node-kraken-api/blob/develop/docs/namespaces/API/Syncing.md#~DataBuilder) function.

##### Type:

*   Object

Source:

*   [node-kraken-api/api/syncing/syncing.jsdoc](https://github.com/jpcx/node-kraken-api/blob/develop/api/syncing/syncing.jsdoc), [line 75](https://github.com/jpcx/node-kraken-api/blob/develop/api/syncing/syncing.jsdoc#L75)

<a name="~Next"></a>
#### Next

Creates a promise that resolves upon new data and rejects upon an error. Creates a self-destructing listener for errors and data.

Source:

*   [node-kraken-api/api/syncing/loadSync.js](https://github.com/jpcx/node-kraken-api/blob/develop/api/syncing/loadSync.js), [line 260](https://github.com/jpcx/node-kraken-api/blob/develop/api/syncing/loadSync.js#L260)

<a name="~Request"></a>
#### Request

Request information used during sync process.

##### Type:

*   Object

##### Properties:

| Name | Type | Description |
| --- | --- | --- |
| `method` | [Kraken~Method](https://github.com/jpcx/node-kraken-api/blob/develop/docs/namespaces/Kraken.md#~Method) | Method being called. |
| `options` | [API\~Syncing~DynamicKrakenOptions](https://github.com/jpcx/node-kraken-api/blob/develop/docs/namespaces/API/Syncing.md#~DynamicKrakenOptions) | Dynamic options for sync operation. |
| `instance` | [API\~Syncing~Instance](https://github.com/jpcx/node-kraken-api/blob/develop/docs/namespaces/API/Syncing.md#~Instance) | Sync instance. |
| `dataBuilder` | [API\~Syncing~DataBuilder](https://github.com/jpcx/node-kraken-api/blob/develop/docs/namespaces/API/Syncing.md#~DataBuilder) \| undefined | Data building function. |


Source:

*   [node-kraken-api/api/syncing/syncing.jsdoc](https://github.com/jpcx/node-kraken-api/blob/develop/api/syncing/syncing.jsdoc), [line 20](https://github.com/jpcx/node-kraken-api/blob/develop/api/syncing/syncing.jsdoc#L20)

<a name="~Requests"></a>
#### Requests

Maps [API\~Syncing~ID](https://github.com/jpcx/node-kraken-api/blob/develop/docs/namespaces/API/Syncing.md#~ID) to request parameters. Requests are processed in insertion order and repeated until all requests are dequeued.

##### Type:

*   Map

##### Properties:

| Name | Type | Description |
| --- | --- | --- |
| `*` | [API\~Syncing~Request](https://github.com/jpcx/node-kraken-api/blob/develop/docs/namespaces/API/Syncing.md#~Request) | Request information. |


Source:

*   [node-kraken-api/api/syncing/syncing.jsdoc](https://github.com/jpcx/node-kraken-api/blob/develop/api/syncing/syncing.jsdoc), [line 30](https://github.com/jpcx/node-kraken-api/blob/develop/api/syncing/syncing.jsdoc#L30)

<a name="~Sync"></a>
#### Sync(method, optionsopt, listeneropt, dataBuilder) → \{[API\~Syncing~Instance](https://github.com/jpcx/node-kraken-api/blob/develop/docs/namespaces/API/Syncing.md#~Instance)}

Creates a sync instance.

##### Parameters:

| Name | Type | Attributes | Description |
| --- | --- | --- | --- |
| `method` | [Kraken~Method](https://github.com/jpcx/node-kraken-api/blob/develop/docs/namespaces/Kraken.md#~Method) |  | Kraken method to sync. |
| `options` | [API\~Syncing~DynamicKrakenOptions](https://github.com/jpcx/node-kraken-api/blob/develop/docs/namespaces/API/Syncing.md#~DynamicKrakenOptions) | \<optional> | Method-specific options that may contain functions. |
| `listener` | [API\~Syncing~EventListener](https://github.com/jpcx/node-kraken-api/blob/develop/docs/namespaces/API/Syncing.md#~EventListener) | \<optional> | Callback for instance-specific events. |
| `dataBuilder` | [API\~Syncing~DataBuilder](https://github.com/jpcx/node-kraken-api/blob/develop/docs/namespaces/API/Syncing.md#~DataBuilder) |  | Builds instance.data given current instance.data and new data. |


Source:

*   [node-kraken-api/api/syncing/loadSync.js](https://github.com/jpcx/node-kraken-api/blob/develop/api/syncing/loadSync.js), [line 147](https://github.com/jpcx/node-kraken-api/blob/develop/api/syncing/loadSync.js#L147)

##### Returns:

Sync instance that holds data and manipulation functions.

Type

[API\~Syncing~Instance](https://github.com/jpcx/node-kraken-api/blob/develop/docs/namespaces/API/Syncing.md#~Instance)

<a name="~SyncError"></a>
#### SyncError

Timestamped [API\~Calls~CallError](https://github.com/jpcx/node-kraken-api/blob/develop/docs/namespaces/API/Calls.md#~CallError).

##### Type:

*   Error

##### Properties:

| Name | Type | Attributes | Description |
| --- | --- | --- | --- |
| `time` | number |  | Time of error (in ms). |
| `action` | string | \<optional> | Action taken in response to the error. Errors that will not resolve over time will close the sync instance. |


Source:

*   [node-kraken-api/api/syncing/syncing.jsdoc](https://github.com/jpcx/node-kraken-api/blob/develop/api/syncing/syncing.jsdoc), [line 37](https://github.com/jpcx/node-kraken-api/blob/develop/api/syncing/syncing.jsdoc#L37)

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