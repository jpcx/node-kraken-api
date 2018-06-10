# API

Contains methods and types for the client-side API.

Source:

*   [node-kraken-api/api/api.jsdoc](https://github.com/jpcx/node-kraken-api/blob/develop/api/api.jsdoc), [line 7](https://github.com/jpcx/node-kraken-api/blob/develop/api/api.jsdoc#L7)

### Namespaces

[Calls](https://github.com/jpcx/node-kraken-api/blob/develop/docs/namespaces/API/Calls.md)

[RateLimits](https://github.com/jpcx/node-kraken-api/blob/develop/docs/namespaces/API/RateLimits.md)

[Syncing](https://github.com/jpcx/node-kraken-api/blob/develop/docs/namespaces/API/Syncing.md)

### Type Definitions

<a name="~Callback"></a>
#### Callback(err, data)

Function which handles errors and data.

##### Parameters:

| Name | Type | Description |
| --- | --- | --- |
| `err` | [API\~Calls~CallError](https://github.com/jpcx/node-kraken-api/blob/develop/docs/namespaces/API/Calls.md#~CallError) | Request errors. |
| `data` | [API\~Calls~CallData](https://github.com/jpcx/node-kraken-api/blob/develop/docs/namespaces/API/Calls.md#~CallData) | Response data. |

Source:

*   [node-kraken-api/api/api.jsdoc](https://github.com/jpcx/node-kraken-api/blob/develop/api/api.jsdoc), [line 13](https://github.com/jpcx/node-kraken-api/blob/develop/api/api.jsdoc#L13)

<a name="~Functions"></a>
#### Functions

Provides functions which can be used to interact with the API.

##### Type:

*   Object

##### Properties:

| Name | Type | Description |
| --- | --- | --- |
| `call` | [API\~Calls~Call](https://github.com/jpcx/node-kraken-api/blob/develop/docs/namespaces/API/Calls.md#~Call) | Call a single method. |
| `sync` | [API\~Syncing~Sync](https://github.com/jpcx/node-kraken-api/blob/develop/docs/namespaces/API/Syncing.md#~Sync) | Create a sync instance. |

Source:

*   [node-kraken-api/api/api.jsdoc](https://github.com/jpcx/node-kraken-api/blob/develop/api/api.jsdoc), [line 22](https://github.com/jpcx/node-kraken-api/blob/develop/api/api.jsdoc#L22)

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