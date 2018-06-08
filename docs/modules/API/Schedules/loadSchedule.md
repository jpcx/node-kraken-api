Module: API/Schedules/loadSchedule
==================================

Loads settings and call function and returns schedule operation functions.

##### Parameters:

| Name | Type | Description |
| --- | --- | --- |
| `tier` | [Kraken~Tier](https://github.com/jpcx/node-kraken-api/blob/0.1.0/docs/namespaces/Kraken.md#~Tier) | Kraken verification tier. |
| `rateLimiter` | [Settings~RateLimiter](https://github.com/jpcx/node-kraken-api/blob/0.1.0/docs/namespaces/Settings.md#~RateLimiter) | Rate limiter logic defined in [Settings~Config](https://github.com/jpcx/node-kraken-api/blob/0.1.0/docs/namespaces/Settings.md#~Config). |
| `call` | [API\~Calls~Call](https://github.com/jpcx/node-kraken-api/blob/0.1.0/docs/namespaces/API/Calls.md#~Call) | Call function. |

Source:

*   [node-kraken-api/api/schedules/loadSchedule.js](https://github.com/jpcx/node-kraken-api/blob/0.1.0/api/schedules/loadSchedule.js), [line 56](https://github.com/jpcx/node-kraken-api/blob/0.1.0/api/schedules/loadSchedule.js#L56)

##### Returns:

Provides schedule operation functions.

Type

[API\~Schedules~Schedule](https://github.com/jpcx/node-kraken-api/blob/0.1.0/docs/namespaces/API/Schedules.md#~Schedule)

<hr>

## [Home](https://github.com/jpcx/node-kraken-api/blob/0.1.0/README.md)