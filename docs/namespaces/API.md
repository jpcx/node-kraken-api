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
      + [GenRequestData](https://github.com/jpcx/node-kraken-api/blob/develop/docs/modules/API/Calls/GenRequestData.md)
      + [LoadCall](https://github.com/jpcx/node-kraken-api/blob/develop/docs/modules/API/Calls/LoadCall.md)
      + [SignRequest](https://github.com/jpcx/node-kraken-api/blob/develop/docs/modules/API/Calls/SignRequest.md)
    + [RateLimits](https://github.com/jpcx/node-kraken-api/blob/develop/docs/namespaces/API/RateLimits.md)
      + [LoadLimiter](https://github.com/jpcx/node-kraken-api/blob/develop/docs/modules/API/RateLimits/LoadLimiter.md)
    + [Syncing](https://github.com/jpcx/node-kraken-api/blob/develop/docs/namespaces/API/Syncing.md)
      + [LoadSync](https://github.com/jpcx/node-kraken-api/blob/develop/docs/modules/API/Syncing/LoadSync.md)
  + [Settings](https://github.com/jpcx/node-kraken-api/blob/develop/docs/namespaces/Settings.md)
  + [Tools](https://github.com/jpcx/node-kraken-api/blob/develop/docs/namespaces/Tools.md)
    + [AlphabetizeNested](https://github.com/jpcx/node-kraken-api/blob/develop/docs/modules/Tools/AlphabetizeNested.md)
    + [ParseNested](https://github.com/jpcx/node-kraken-api/blob/develop/docs/modules/Tools/ParseNested.md)
  + [Kraken](https://github.com/jpcx/node-kraken-api/blob/develop/docs/namespaces/Kraken.md)