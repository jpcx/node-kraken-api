# [API](https://github.com/jpcx/node-kraken-api/blob/0.4.1/docs/namespaces/API.md)~RateLimits

Types and methods specific to dynamically limiting call frequency in response to rate limit violations and according to the rate limit specifications listed in the [Kraken API docs](https://www.kraken.com/help/api#api-call-rate-limit)

__Properties:__

| Name | Type | Description |
| --- | --- | --- |
| `LoadLimiter` | [module:API/RateLimits/LoadLimiter](https://github.com/jpcx/node-kraken-api/blob/0.4.1/docs/modules/API/RateLimits/LoadLimiter.md) | Prepares rate-limiting promises according to the [Kraken~Tier](https://github.com/jpcx/node-kraken-api/blob/0.4.1/docs/namespaces/Kraken.md#~Tier), [Kraken~Method](https://github.com/jpcx/node-kraken-api/blob/0.4.1/docs/namespaces/Kraken.md#~Method), and [Settings~RateLimiter](https://github.com/jpcx/node-kraken-api/blob/0.4.1/docs/namespaces/Settings.md#~RateLimiter). |

Source:

* [node-kraken-api/api/rateLimits/rateLimits.jsdoc](https://github.com/jpcx/node-kraken-api/blob/0.4.1/api/rateLimits/rateLimits.jsdoc), [line 7](https://github.com/jpcx/node-kraken-api/blob/0.4.1/api/rateLimits/rateLimits.jsdoc#L7)

## Methods

<a name="~AddFail"></a>

### (inner) AddFail(method) → \{boolean}

Registers a new rate-limit violation and updates frequencies accordingly.

__Parameters:__

| Name | Type | Description |
| --- | --- | --- |
| `method` | [Kraken~Method](https://github.com/jpcx/node-kraken-api/blob/0.4.1/docs/namespaces/Kraken.md#~Method) | Method being called. |

Source:

* [node-kraken-api/api/rateLimits/loadLimiter.js](https://github.com/jpcx/node-kraken-api/blob/0.4.1/api/rateLimits/loadLimiter.js), [line 278](https://github.com/jpcx/node-kraken-api/blob/0.4.1/api/rateLimits/loadLimiter.js#L278)

__Returns:__

True if successfully updated.

___Type:___

* boolean

<a name="~AddLockout"></a>

### (inner) AddLockout(method) → \{boolean}

Registers a lockout state and forces a category pause.

__Parameters:__

| Name | Type | Description |
| --- | --- | --- |
| `method` | [Kraken~Method](https://github.com/jpcx/node-kraken-api/blob/0.4.1/docs/namespaces/Kraken.md#~Method) | Method being called. |

Source:

* [node-kraken-api/api/rateLimits/loadLimiter.js](https://github.com/jpcx/node-kraken-api/blob/0.4.1/api/rateLimits/loadLimiter.js), [line 289](https://github.com/jpcx/node-kraken-api/blob/0.4.1/api/rateLimits/loadLimiter.js#L289)

__Returns:__

True if successfully updated.

___Type:___

* boolean

<a name="~AddPass"></a>

### (inner) AddPass(method) → \{boolean}

Registers any response that is not a rate-limit violation and updates frequencies accordingly.

__Parameters:__

| Name | Type | Description |
| --- | --- | --- |
| `method` | [Kraken~Method](https://github.com/jpcx/node-kraken-api/blob/0.4.1/docs/namespaces/Kraken.md#~Method) | Method being called. |

Source:

* [node-kraken-api/api/rateLimits/loadLimiter.js](https://github.com/jpcx/node-kraken-api/blob/0.4.1/api/rateLimits/loadLimiter.js), [line 267](https://github.com/jpcx/node-kraken-api/blob/0.4.1/api/rateLimits/loadLimiter.js#L267)

__Returns:__

True if successfully updated.

___Type:___

* boolean

<a name="~Attempt"></a>

### (inner) Attempt(method) → \{Promise}

Registers a new call attempt and returns a promise that signifies that the call placement may be submitted.

__Parameters:__

| Name | Type | Description |
| --- | --- | --- |
| `method` | [Kraken~Method](https://github.com/jpcx/node-kraken-api/blob/0.4.1/docs/namespaces/Kraken.md#~Method) | Method being called. |

Source:

* [node-kraken-api/api/rateLimits/loadLimiter.js](https://github.com/jpcx/node-kraken-api/blob/0.4.1/api/rateLimits/loadLimiter.js), [line 214](https://github.com/jpcx/node-kraken-api/blob/0.4.1/api/rateLimits/loadLimiter.js#L214)

__Returns:__

Resolves when an adequate wait period has been completed.

___Type:___

* Promise

<a name="~CheckContext"></a>

### (inner) CheckContext(context, limitConfig, any, spec)

Checks the response context for [API\~RateLimits~Update](https://github.com/jpcx/node-kraken-api/blob/0.4.1/docs/namespaces/API/RateLimits.md#~Update) and adjusts call frequency accordingly.

__Parameters:__

| Name | Type | Description |
| --- | --- | --- |
| `context` | 'pass' \| 'fail' \| undefined | Reason for invocation; may be called in response to a successful call, a rate limit violation, or a pre-response call attempt. |
| `limitConfig` | [API\~RateLimits~LimitConfig](https://github.com/jpcx/node-kraken-api/blob/0.4.1/docs/namespaces/API/RateLimits.md#~LimitConfig) | Rate-limiter settings configuration. |
| `any` | [API\~RateLimits~CallInfo](https://github.com/jpcx/node-kraken-api/blob/0.4.1/docs/namespaces/API/RateLimits.md#~CallInfo) | Rate information for all calls. |
| `spec` | [API\~RateLimits~CatInfo](https://github.com/jpcx/node-kraken-api/blob/0.4.1/docs/namespaces/API/RateLimits.md#~CatInfo) | Rate information for specific [API\~RateLimits~Category](https://github.com/jpcx/node-kraken-api/blob/0.4.1/docs/namespaces/API/RateLimits.md#~Category). |

Source:

* [node-kraken-api/api/rateLimits/loadLimiter.js](https://github.com/jpcx/node-kraken-api/blob/0.4.1/api/rateLimits/loadLimiter.js), [line 71](https://github.com/jpcx/node-kraken-api/blob/0.4.1/api/rateLimits/loadLimiter.js#L71)

<a name="~CheckPileUp"></a>

### (inner) CheckPileUp(limitConfig, any)

Checks for more calls being made than responses received and adjusts call frequency accordingly.

__Parameters:__

| Name | Type | Description |
| --- | --- | --- |
| `limitConfig` | [API\~RateLimits~LimitConfig](https://github.com/jpcx/node-kraken-api/blob/0.4.1/docs/namespaces/API/RateLimits.md#~LimitConfig) | Rate-limiter settings configuration. |
| `any` | [API\~RateLimits~CallInfo](https://github.com/jpcx/node-kraken-api/blob/0.4.1/docs/namespaces/API/RateLimits.md#~CallInfo) | Rate information for all calls. |

Source:

* [node-kraken-api/api/rateLimits/loadLimiter.js](https://github.com/jpcx/node-kraken-api/blob/0.4.1/api/rateLimits/loadLimiter.js), [line 55](https://github.com/jpcx/node-kraken-api/blob/0.4.1/api/rateLimits/loadLimiter.js#L55)

<a name="~GetAuthCounterLimit"></a>

### (inner) GetAuthCounterLimit(tier) → \{[Kraken~AuthCounterLimit](https://github.com/jpcx/node-kraken-api/blob/0.4.1/docs/namespaces/Kraken.md#~AuthCounterLimit)}

Returns the maximum counter value for authenticated methods.

__Parameters:__

| Name | Type | Description |
| --- | --- | --- |
| `tier` | [Kraken~Tier](https://github.com/jpcx/node-kraken-api/blob/0.4.1/docs/namespaces/Kraken.md#~Tier) | Kraken verification tier. |

Source:

* [node-kraken-api/api/rateLimits/loadLimiter.js](https://github.com/jpcx/node-kraken-api/blob/0.4.1/api/rateLimits/loadLimiter.js), [line 31](https://github.com/jpcx/node-kraken-api/blob/0.4.1/api/rateLimits/loadLimiter.js#L31)

__Returns:__

Maximum count for auth counter.

___Type:___

* [Kraken~AuthCounterLimit](https://github.com/jpcx/node-kraken-api/blob/0.4.1/docs/namespaces/Kraken.md#~AuthCounterLimit)

<a name="~GetAuthDecrementInterval"></a>

### (inner) GetAuthDecrementInterval(tier) → \{[Kraken~AuthDecrementInterval](https://github.com/jpcx/node-kraken-api/blob/0.4.1/docs/namespaces/Kraken.md#~AuthDecrementInterval)}

Returns the amount of time required to decrement the auth counter.

__Parameters:__

| Name | Type | Description |
| --- | --- | --- |
| `tier` | [Kraken~Tier](https://github.com/jpcx/node-kraken-api/blob/0.4.1/docs/namespaces/Kraken.md#~Tier) | Kraken verification tier. |

Source:

* [node-kraken-api/api/rateLimits/loadLimiter.js](https://github.com/jpcx/node-kraken-api/blob/0.4.1/api/rateLimits/loadLimiter.js), [line 21](https://github.com/jpcx/node-kraken-api/blob/0.4.1/api/rateLimits/loadLimiter.js#L21)

__Returns:__

Amount of time required to decrement the counter.

___Type:___

* [Kraken~AuthDecrementInterval](https://github.com/jpcx/node-kraken-api/blob/0.4.1/docs/namespaces/Kraken.md#~AuthDecrementInterval)

<a name="~GetAuthIncrementAmt"></a>

### (inner) GetAuthIncrementAmt(method) → \{[Kraken~AuthIncrementAmount](https://github.com/jpcx/node-kraken-api/blob/0.4.1/docs/namespaces/Kraken.md#~AuthIncrementAmount)}

Returns the amount of counter incrementation based on the method.

__Parameters:__

| Name | Type | Description |
| --- | --- | --- |
| `method` | [Kraken~Method](https://github.com/jpcx/node-kraken-api/blob/0.4.1/docs/namespaces/Kraken.md#~Method) | Method being called. |

Source:

* [node-kraken-api/api/rateLimits/loadLimiter.js](https://github.com/jpcx/node-kraken-api/blob/0.4.1/api/rateLimits/loadLimiter.js), [line 9](https://github.com/jpcx/node-kraken-api/blob/0.4.1/api/rateLimits/loadLimiter.js#L9)

__Returns:__

Amount to increment the auth counter.

___Type:___

* [Kraken~AuthIncrementAmount](https://github.com/jpcx/node-kraken-api/blob/0.4.1/docs/namespaces/Kraken.md#~AuthIncrementAmount)

<a name="~GetAuthRegenIntvl"></a>

### (inner) GetAuthRegenIntvl(method, tier) → \{number}

Gets the frequency required for sustainable execution of a private method.

__Parameters:__

| Name | Type | Description |
| --- | --- | --- |
| `method` | [Kraken~Method](https://github.com/jpcx/node-kraken-api/blob/0.4.1/docs/namespaces/Kraken.md#~Method) | Method being called. |
| `tier` | [Kraken~Tier](https://github.com/jpcx/node-kraken-api/blob/0.4.1/docs/namespaces/Kraken.md#~Tier) | Current verification tier. |

Source:

* [node-kraken-api/api/rateLimits/loadLimiter.js](https://github.com/jpcx/node-kraken-api/blob/0.4.1/api/rateLimits/loadLimiter.js), [line 308](https://github.com/jpcx/node-kraken-api/blob/0.4.1/api/rateLimits/loadLimiter.js#L308)

__Returns:__

Optimal interval.

___Type:___

* number

<a name="~GetCategory"></a>

### (inner) GetCategory(method) → \{[API\~RateLimits~Category](https://github.com/jpcx/node-kraken-api/blob/0.4.1/docs/namespaces/API/RateLimits.md#~Category)}

Gets the type of server-side rate-limiter category based on the method. Wrapper for [API\~RateLimits~GetRLCategory](https://github.com/jpcx/node-kraken-api/blob/0.4.1/docs/namespaces/API/RateLimits.md#~GetRLCategory).

__Parameters:__

| Name | Type | Description |
| --- | --- | --- |
| `method` | [Kraken~Method](https://github.com/jpcx/node-kraken-api/blob/0.4.1/docs/namespaces/Kraken.md#~Method) | Method being called. |

Source:

* [node-kraken-api/api/rateLimits/loadLimiter.js](https://github.com/jpcx/node-kraken-api/blob/0.4.1/api/rateLimits/loadLimiter.js), [line 300](https://github.com/jpcx/node-kraken-api/blob/0.4.1/api/rateLimits/loadLimiter.js#L300)

__Returns:__

Type of rate-limiter category.

___Type:___

* [API\~RateLimits~Category](https://github.com/jpcx/node-kraken-api/blob/0.4.1/docs/namespaces/API/RateLimits.md#~Category)

<a name="~GetRLCategory"></a>

### (inner) GetRLCategory(privMethods, method) → \{[API\~RateLimits~Category](https://github.com/jpcx/node-kraken-api/blob/0.4.1/docs/namespaces/API/RateLimits.md#~Category)}

Returns the rate-limit category for a given method. Different categories follow different server-side limiting behavior.

__Parameters:__

| Name | Type | Description |
| --- | --- | --- |
| `privMethods` | [Kraken~PrivateMethods](https://github.com/jpcx/node-kraken-api/blob/0.4.1/docs/namespaces/Kraken.md#~PrivateMethods) | List of all available private methods. |
| `method` | [Kraken~Method](https://github.com/jpcx/node-kraken-api/blob/0.4.1/docs/namespaces/Kraken.md#~Method) | Method being called. |

Source:

* [node-kraken-api/api/rateLimits/loadLimiter.js](https://github.com/jpcx/node-kraken-api/blob/0.4.1/api/rateLimits/loadLimiter.js), [line 40](https://github.com/jpcx/node-kraken-api/blob/0.4.1/api/rateLimits/loadLimiter.js#L40)

__Returns:__

Rate-limiting category.

___Type:___

* [API\~RateLimits~Category](https://github.com/jpcx/node-kraken-api/blob/0.4.1/docs/namespaces/API/RateLimits.md#~Category)

<a name="~Update"></a>

### (inner) Update(state, method, contextopt)

Updates [API\~RateLimits~CallInfo](https://github.com/jpcx/node-kraken-api/blob/0.4.1/docs/namespaces/API/RateLimits.md#~CallInfo) and [API\~RateLimits~CatInfo](https://github.com/jpcx/node-kraken-api/blob/0.4.1/docs/namespaces/API/RateLimits.md#~CatInfo) intervals in response to server response behavior.

__Parameters:__

| Name | Type | Attributes | Description |
| --- | --- | --- | --- |
| `state` | [API\~RateLimits~State](https://github.com/jpcx/node-kraken-api/blob/0.4.1/docs/namespaces/API/RateLimits.md#~State) |  | Stateful registry of limiter information. |
| `method` | [Kraken~Method](https://github.com/jpcx/node-kraken-api/blob/0.4.1/docs/namespaces/Kraken.md#~Method) |  | Method being called. |
| `context` | 'pass' \| 'fail' | \<optional> | Reason for invocation; may be called in response to a successful call, a rate limit violation, or a pre-response call attempt. |

Source:

* [node-kraken-api/api/rateLimits/loadLimiter.js](https://github.com/jpcx/node-kraken-api/blob/0.4.1/api/rateLimits/loadLimiter.js), [line 100](https://github.com/jpcx/node-kraken-api/blob/0.4.1/api/rateLimits/loadLimiter.js#L100)

## Type Definitions

<a name="~CallInfo"></a>

### CallInfo

Contains rate information for all calls.

__Type:__

* Object

__Properties:__

| Name | Type | Description |
| --- | --- | --- |
| `intvl` | number | Current calculated safe interval. |
| `attmp` | Array.<number> | Array of call times (in ms) for attempted calls. |
| `compl` | Array.<number> | Array of call times (in ms) for responses. |

Source:

* [node-kraken-api/api/rateLimits/rateLimits.jsdoc](https://github.com/jpcx/node-kraken-api/blob/0.4.1/api/rateLimits/rateLimits.jsdoc), [line 20](https://github.com/jpcx/node-kraken-api/blob/0.4.1/api/rateLimits/rateLimits.jsdoc#L20)

<a name="~Category"></a>

### Category

Separates calls into four categories that are known to have different server-side rate-limiting behavior.

__Type:__

* 'ohlc' | 'trades' | 'other' | 'auth'

Source:

* [node-kraken-api/api/rateLimits/rateLimits.jsdoc](https://github.com/jpcx/node-kraken-api/blob/0.4.1/api/rateLimits/rateLimits.jsdoc), [line 14](https://github.com/jpcx/node-kraken-api/blob/0.4.1/api/rateLimits/rateLimits.jsdoc#L14)

<a name="~CatInfo"></a>

### CatInfo

Holds information for category-specific frequencies.

__Type:__

* Object

__Properties:__

| Name | Type | Description |
| --- | --- | --- |
| `intvl` | number | Current calculated safe interval. |
| `last` | number | Time (in ms) of last call attempt. |

Source:

* [node-kraken-api/api/rateLimits/rateLimits.jsdoc](https://github.com/jpcx/node-kraken-api/blob/0.4.1/api/rateLimits/rateLimits.jsdoc), [line 35](https://github.com/jpcx/node-kraken-api/blob/0.4.1/api/rateLimits/rateLimits.jsdoc#L35)

<a name="~Functions"></a>

### Functions

Contains functions for working with rate-limits.

__Type:__

* Object

__Properties:__

| Name | Type | Description |
| --- | --- | --- |
| `attempt` | [API\~RateLimits~Attempt](https://github.com/jpcx/node-kraken-api/blob/0.4.1/docs/namespaces/API/RateLimits.md#~Attempt) | Register a new call attempt. |
| `addPass` | [API\~RateLimits~AddPass](https://github.com/jpcx/node-kraken-api/blob/0.4.1/docs/namespaces/API/RateLimits.md#~AddPass) | Register a new successful call response. |
| `addFail` | [API\~RateLimits~AddFail](https://github.com/jpcx/node-kraken-api/blob/0.4.1/docs/namespaces/API/RateLimits.md#~AddFail) | Register a new rate-limit violation. |
| `getCategory` | [API\~RateLimits~GetCategory](https://github.com/jpcx/node-kraken-api/blob/0.4.1/docs/namespaces/API/RateLimits.md#~GetCategory) | Gets the type of rate-limiting behavior based on the method. |
| `getAuthRegenIntvl` | [API\~RateLimits~GetAuthRegenIntvl](https://github.com/jpcx/node-kraken-api/blob/0.4.1/docs/namespaces/API/RateLimits.md#~GetAuthRegenIntvl) | Gets the amount of time necessary for a given private method to be called sustainably. |

Source:

* [node-kraken-api/api/rateLimits/loadLimiter.js](https://github.com/jpcx/node-kraken-api/blob/0.4.1/api/rateLimits/loadLimiter.js), [line 203](https://github.com/jpcx/node-kraken-api/blob/0.4.1/api/rateLimits/loadLimiter.js#L203)

<a name="~LimitConfig"></a>

### LimitConfig

Rules for limiting call frequency and responding to violations. Frequencies are split into two main categories: all calls and specific calls. All calls frequency determines the request rate for any kind of call. Specific call frequencies are split into several categories of distinct server-side rate-limiting behavior. Pile-up refers to more calls being made than responses received.

__Type:__

* Object

__Properties:__

| Name | Type | Description |
| --- | --- | --- |
| `baseIntvl` | number | Default call interval. |
| `minIntvl` | number | Minimum call interval. |
| `pileUpWindow` | number | Moving window of call logs to determine whether or not more calls are being made than received. |
| `pileUpThreshold` | number | Number of unanswered calls necessary to trigger frequency decrease. |
| `pileUpResetIntvl` | number | Interval to reset all calls to in response to more calls made than received. |
| `pileUpMultiplier` | number | Amount to multiply by call interval in response to excessive calling. |
| `lockoutResetIntvl` | number | Interval to reset a call type to in response to a rate limit lockout. Interval is multiplied by the number of failed resume attempts plus one. |
| `violationResetIntvl` | number | Interval to reset a call type to in response to a rate limit violation |
| `violationMultiplier` | number | Multiplies call type interval in response to rate limit violations (if greater than violationResetIntvl). |
| `authCounterReductionTimeout` | number | Rate limit violations during authenticated calling should only happen when multiple sources are utilizing the private API, or if node-kraken-api instance is reset before the authenticated counter expires. As such, maximum count is reduced by one for every violation, and is increased by one (restored) after this many milliseconds. |
| `anyPassDecay` | number | Amount to multiply all calls interval in response to a successful call. |
| `specificPassDecay` | number | Amount to multiply call type interval in response to a successful call. |

Source:

* [node-kraken-api/api/rateLimits/rateLimits.jsdoc](https://github.com/jpcx/node-kraken-api/blob/0.4.1/api/rateLimits/rateLimits.jsdoc), [line 43](https://github.com/jpcx/node-kraken-api/blob/0.4.1/api/rateLimits/rateLimits.jsdoc#L43)

<a name="~State"></a>

### State

Holds data relevant to current execution state.

__Properties:__

| Name | Type | Description |
| --- | --- | --- |
| `settings` | [Settings~Config](https://github.com/jpcx/node-kraken-api/blob/0.4.1/docs/namespaces/Settings.md#~Config) | Current settings configuration. |
| `limitConfig` | [API\~RateLimits~LimitConfig](https://github.com/jpcx/node-kraken-api/blob/0.4.1/docs/namespaces/API/RateLimits.md#~LimitConfig) | Rate limter behavior configuration. |
| `calls` | [API\~RateLimits~CallInfo](https://github.com/jpcx/node-kraken-api/blob/0.4.1/docs/namespaces/API/RateLimits.md#~CallInfo) | Rate info for all calls. |
| `catInfo` | [API\~RateLimits~CatInfo](https://github.com/jpcx/node-kraken-api/blob/0.4.1/docs/namespaces/API/RateLimits.md#~CatInfo) | Map of category to object containing category-specific rate information. |

Source:

* [node-kraken-api/api/rateLimits/loadLimiter.js](https://github.com/jpcx/node-kraken-api/blob/0.4.1/api/rateLimits/loadLimiter.js), [line 167](https://github.com/jpcx/node-kraken-api/blob/0.4.1/api/rateLimits/loadLimiter.js#L167)

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