# [API](https://github.com/jpcx/node-kraken-api/blob/develop/docs/namespaces/API.md)~Schedules

Types and methods specific to scheduling persistent API~Caller operations.

##### Properties:

| Name | Type | Description |
| --- | --- | --- |
| `loadSchedule` | [module:API/Schedules/loadSchedule](https://github.com/jpcx/node-kraken-api/blob/develop/docs/modules/API/Schedules/loadSchedule.md) | Loads settings and loaded call function and returns stateful scheduler function. |

Source:

*   [node-kraken-api/api/schedules/schedules.jsdoc](https://github.com/jpcx/node-kraken-api/blob/develop/api/schedules/schedules.jsdoc), [line 7](https://github.com/jpcx/node-kraken-api/blob/develop/api/schedules/schedules.jsdoc#L7)

### Methods

<a name=".calcAverageWait"></a>
#### (static) calcAverageWait(info) → \{number}

Calculates average wait time.

##### Parameters:

| Name | Type | Description |
| --- | --- | --- |
| `info` | [API\~Schedules~Info](https://github.com/jpcx/node-kraken-api/blob/develop/docs/namespaces/API/Schedules.md#~Info) | Object containing runtime data. |

Source:

*   [node-kraken-api/api/schedules/loadSchedule.js](https://github.com/jpcx/node-kraken-api/blob/develop/api/schedules/loadSchedule.js), [line 18](https://github.com/jpcx/node-kraken-api/blob/develop/api/schedules/loadSchedule.js#L18)

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
| `info` | [API\~Schedules~Info](https://github.com/jpcx/node-kraken-api/blob/develop/docs/namespaces/API/Schedules.md#~Info) | Object containing runtime data. |

Source:

*   [node-kraken-api/api/schedules/loadSchedule.js](https://github.com/jpcx/node-kraken-api/blob/develop/api/schedules/loadSchedule.js), [line 38](https://github.com/jpcx/node-kraken-api/blob/develop/api/schedules/loadSchedule.js#L38)

##### Returns:

Promise which resolves when there are no more requests to process and rejects when an error has been thrown.

Type

Promise

<a name="~Add"></a>
#### (inner) Add(method, options, cb) → \{[API\~Schedules~ID](https://github.com/jpcx/node-kraken-api/blob/develop/docs/namespaces/API/Schedules.md#~ID)}

Adds a request to the schedule.

##### Parameters:

| Name | Type | Description |
| --- | --- | --- |
| `method` | [Kraken~Method](https://github.com/jpcx/node-kraken-api/blob/develop/docs/namespaces/Kraken.md#~Method) | Kraken method being called. |
| `options` | [Kraken~Options](https://github.com/jpcx/node-kraken-api/blob/develop/docs/namespaces/Kraken.md#~Options) | Method-specific options. |
| `cb` | [API~Callback](https://github.com/jpcx/node-kraken-api/blob/develop/docs/namespaces/API.md#~Callback) | Callback for errors and data. |

Source:

*   [node-kraken-api/api/schedules/loadSchedule.js](https://github.com/jpcx/node-kraken-api/blob/develop/api/schedules/loadSchedule.js), [line 94](https://github.com/jpcx/node-kraken-api/blob/develop/api/schedules/loadSchedule.js#L94)

##### Returns:

ID used for schedule removal.

Type

[API\~Schedules~ID](https://github.com/jpcx/node-kraken-api/blob/develop/docs/namespaces/API/Schedules.md#~ID)

<a name="~Delete"></a>
#### (inner) Delete(id) → \{boolean}

Removes a request from the schedule.

##### Parameters:

| Name | Type | Description |
| --- | --- | --- |
| `id` | [API\~Schedules~ID](https://github.com/jpcx/node-kraken-api/blob/develop/docs/namespaces/API/Schedules.md#~ID) | Schedule ID given by API~Schedule function. |

Source:

*   [node-kraken-api/api/schedules/loadSchedule.js](https://github.com/jpcx/node-kraken-api/blob/develop/api/schedules/loadSchedule.js), [line 113](https://github.com/jpcx/node-kraken-api/blob/develop/api/schedules/loadSchedule.js#L113)

##### Returns:

True if successful, false if not.

Type

boolean

### Type Definitions

<a name="~ID"></a>
#### ID

Unique incrementing ID used for canceling scheduled calls.

##### Type:

*   number

Source:

*   [node-kraken-api/api/schedules/schedules.jsdoc](https://github.com/jpcx/node-kraken-api/blob/develop/api/schedules/schedules.jsdoc), [line 14](https://github.com/jpcx/node-kraken-api/blob/develop/api/schedules/schedules.jsdoc#L14)

<a name="~Info"></a>
#### Info

Contains instance information used during schedule process.

##### Type:

*   Object

##### Properties:

| Name | Type | Description |
| --- | --- | --- |
| `call` | [API\~Calls~Call](https://github.com/jpcx/node-kraken-api/blob/develop/docs/namespaces/API/Calls.md#~Call) | Call function. |
| `requests` | [API\~Schedules~Requests](https://github.com/jpcx/node-kraken-api/blob/develop/docs/namespaces/API/Schedules.md#~Requests) | Maps API\~Schedules~ID to request parameters. |
| `id` | [API\~Schedules~ID](https://github.com/jpcx/node-kraken-api/blob/develop/docs/namespaces/API/Schedules.md#~ID) | Incrementing ID used for schedule assignment. |
| `requesting` | boolean | Whether or not there are currently active schedule operations. |

Source:

*   [node-kraken-api/api/schedules/loadSchedule.js](https://github.com/jpcx/node-kraken-api/blob/develop/api/schedules/loadSchedule.js), [line 66](https://github.com/jpcx/node-kraken-api/blob/develop/api/schedules/loadSchedule.js#L66)

<a name="~Requests"></a>
#### Requests

Maps [API\~Schedules~ID](https://github.com/jpcx/node-kraken-api/blob/develop/docs/namespaces/API/Schedules.md#~ID) to request parameters. Requests are processed in insertion order and repeated until all requests are dequeued.

##### Type:

*   Map

Source:

*   [node-kraken-api/api/schedules/schedules.jsdoc](https://github.com/jpcx/node-kraken-api/blob/develop/api/schedules/schedules.jsdoc), [line 20](https://github.com/jpcx/node-kraken-api/blob/develop/api/schedules/schedules.jsdoc#L20)

<a name="~Schedule"></a>
#### Schedule

Contains methods for working with schedules.

##### Type:

*   Object

##### Properties:

| Name | Type | Description |
| --- | --- | --- |
| `add` | [API\~Schedules~Add](https://github.com/jpcx/node-kraken-api/blob/develop/docs/namespaces/API/Schedules.md#~Add) | Adds a request to the schedule. |
| `delete` | [API\~Schedules~Delete](https://github.com/jpcx/node-kraken-api/blob/develop/docs/namespaces/API/Schedules.md#~Delete) | Removes a request from the schedule. |

Source:

*   [node-kraken-api/api/schedules/loadSchedule.js](https://github.com/jpcx/node-kraken-api/blob/develop/api/schedules/loadSchedule.js), [line 86](https://github.com/jpcx/node-kraken-api/blob/develop/api/schedules/loadSchedule.js#L86)

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