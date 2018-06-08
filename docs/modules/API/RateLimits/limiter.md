Module: API/RateLimits/limiter
==============================

Prepares a rate-limiting promise according to the [Kraken~Tier](https://github.com/jpcx/node-kraken-api/blob/0.1.0/docs/namespaces/Kraken.md#~Tier), [Kraken~Method](https://github.com/jpcx/node-kraken-api/blob/0.1.0/docs/namespaces/Kraken.md#~Method), and [Settings~RateLimiter](https://github.com/jpcx/node-kraken-api/blob/0.1.0/docs/namespaces/Settings.md#~RateLimiter).

##### Parameters:

| Name | Type | Description |
| --- | --- | --- |
| `tier` | [Kraken~Tier](https://github.com/jpcx/node-kraken-api/blob/0.1.0/docs/namespaces/Kraken.md#~Tier) | Verification tier. |
| `rateLimiter` | [Settings~RateLimiter](https://github.com/jpcx/node-kraken-api/blob/0.1.0/docs/namespaces/Settings.md#~RateLimiter) | Rate limiter logic specified in settings configuration. |
| `method` | [Kraken~Method](https://github.com/jpcx/node-kraken-api/blob/0.1.0/docs/namespaces/Kraken.md#~Method) | Method being called. |

Source:

*   [node-kraken-api/api/rateLimits/limiter.js](https://github.com/jpcx/node-kraken-api/blob/0.1.0/api/rateLimits/limiter.js), [line 13](https://github.com/jpcx/node-kraken-api/blob/0.1.0/api/rateLimits/limiter.js#L13)

<hr>

## [Home](https://github.com/jpcx/node-kraken-api/blob/0.1.0/README.md)