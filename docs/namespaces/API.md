# API

Contains methods and types for the client-side API.

Source:

*   [api/api.jsdoc](api_api.jsdoc.html), [line 7](api_api.jsdoc.html#line7)

### Namespaces

[Calls](https://github.com/jpcx/node-kraken-api/blob/0.1.0/docs/namespaces/API/Calls.md)

[RateLimits](https://github.com/jpcx/node-kraken-api/blob/0.1.0/docs/namespaces/API/RateLimits.md)

[Schedules](https://github.com/jpcx/node-kraken-api/blob/0.1.0/docs/namespaces/API/Schedules.md)

### Type Definitions

<a name="~Callback"></a>
#### Callback(err, data)

Function which handles errors and data.

##### Parameters:

| Name | Type | Description |
| --- | --- | --- |
| `err` | Error | Request errors. |
| `data` | Object | Response data. |

Source:

*   [api/api.jsdoc](api_api.jsdoc.html), [line 13](api_api.jsdoc.html#line13)

<a name="~Functions"></a>
#### Functions

Provides functions which can be used to interact with the API.

##### Type:

*   Object

##### Properties:

| Name | Type | Description |
| --- | --- | --- |
| `call` | [API\~Calls~Call](https://github.com/jpcx/node-kraken-api/blob/0.1.0/docs/namespaces/API/Calls.md#~Call) | Call a single method. |
| `schedule` | [API\~Schedules~Schedule](https://github.com/jpcx/node-kraken-api/blob/0.1.0/docs/namespaces/API/Schedules.md#~Schedule) | Add or delete a continuous call schedule operation. |

Source:

*   [api/api.jsdoc](api_api.jsdoc.html), [line 22](api_api.jsdoc.html#line22)

<hr>

## [Home](https://github.com/jpcx/node-kraken-api/blob/0.1.0/README.md)