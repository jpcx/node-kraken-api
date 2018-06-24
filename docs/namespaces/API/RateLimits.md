# [API](https://github.com/jpcx/node-kraken-api/blob/0.1.2/docs/namespaces/API.md)~RateLimits

Types and methods specific to dynamically limiting call frequency in response to rate limit violations and according to the rate limit specifications listed in the [Kraken API docs](https://www.kraken.com/help/api#api-call-rate-limit)

##### Properties:

| Name | Type | Description |
| --- | --- | --- |
| `LoadLimiter` | [module:API/RateLimits/LoadLimiter](https://github.com/jpcx/node-kraken-api/blob/0.1.2/docs/modules/API/RateLimits/LoadLimiter.md) | Prepares rate-limiting promises according to the [Kraken~Tier](https://github.com/jpcx/node-kraken-api/blob/0.1.2/docs/namespaces/Kraken.md#~Tier), [Kraken~Method](https://github.com/jpcx/node-kraken-api/blob/0.1.2/docs/namespaces/Kraken.md#~Method), and [Settings~RateLimiter](https://github.com/jpcx/node-kraken-api/blob/0.1.2/docs/namespaces/Settings.md#~RateLimiter). |


Source:

*   [node-kraken-api/api/rateLimits/rateLimits.jsdoc](https://github.com/jpcx/node-kraken-api/blob/0.1.2/api/rateLimits/rateLimits.jsdoc), [line 7](https://github.com/jpcx/node-kraken-api/blob/0.1.2/api/rateLimits/rateLimits.jsdoc#L7)

### Methods

<a name="~AddFail"></a>
#### (inner) AddFail(category) → \{boolean}

Registers a new rate-limit violation and updates frequencies accordingly.

##### Parameters:

| Name | Type | Description |
| --- | --- | --- |
| `category` | [API\~RateLimits~Category](https://github.com/jpcx/node-kraken-api/blob/0.1.2/docs/namespaces/API/RateLimits.md#~Category) | Type of category based on rate-limiting behavior. |


Source:

*   [node-kraken-api/api/rateLimits/loadLimiter.js](https://github.com/jpcx/node-kraken-api/blob/0.1.2/api/rateLimits/loadLimiter.js), [line 161](https://github.com/jpcx/node-kraken-api/blob/0.1.2/api/rateLimits/loadLimiter.js#L161)

##### Returns:

True if successfully updated.

Type

boolean

<a name="~AddPass"></a>
#### (inner) AddPass(category) → \{boolean}

Registers any response that is not a rate-limit violation and updates frequencies accordingly.

##### Parameters:

| Name | Type | Description |
| --- | --- | --- |
| `category` | [API\~RateLimits~Category](https://github.com/jpcx/node-kraken-api/blob/0.1.2/docs/namespaces/API/RateLimits.md#~Category) | Type of category based on rate-limiting behavior. |


Source:

*   [node-kraken-api/api/rateLimits/loadLimiter.js](https://github.com/jpcx/node-kraken-api/blob/0.1.2/api/rateLimits/loadLimiter.js), [line 150](https://github.com/jpcx/node-kraken-api/blob/0.1.2/api/rateLimits/loadLimiter.js#L150)

##### Returns:

True if successfully updated.

Type

boolean

<a name="~Attempt"></a>
#### (inner) Attempt(category) → \{Promise}

Registers a new call attempt and returns a promise that signifies that the call placement may be submitted.

##### Parameters:

| Name | Type | Description |
| --- | --- | --- |
| `category` | [API\~RateLimits~Category](https://github.com/jpcx/node-kraken-api/blob/0.1.2/docs/namespaces/API/RateLimits.md#~Category) | Type of category based on rate-limiting behavior. |


Source:

*   [node-kraken-api/api/rateLimits/loadLimiter.js](https://github.com/jpcx/node-kraken-api/blob/0.1.2/api/rateLimits/loadLimiter.js), [line 113](https://github.com/jpcx/node-kraken-api/blob/0.1.2/api/rateLimits/loadLimiter.js#L113)

##### Returns:

Resolves when an adequate wait period has been completed.

Type

Promise

<a name="~CheckContext"></a>
#### (inner) CheckContext(context, limitConfig, any, spec)

Checks the response context for [API\~RateLimits~Update](https://github.com/jpcx/node-kraken-api/blob/0.1.2/docs/namespaces/API/RateLimits.md#~Update) and adjusts call frequency accordingly.

##### Parameters:

| Name | Type | Description |
| --- | --- | --- |
| `context` | 'pass' \| 'fail' \| undefined | Reason for invocation; may be called in response to a successful call, a rate limit violation, or a pre-response call attempt. |
| `limitConfig` | [Settings~RateLimiter](https://github.com/jpcx/node-kraken-api/blob/0.1.2/docs/namespaces/Settings.md#~RateLimiter) | Rate-limiter settings configuration. |
| `any` | [API\~RateLimits~CallInfo](https://github.com/jpcx/node-kraken-api/blob/0.1.2/docs/namespaces/API/RateLimits.md#~CallInfo) | Rate information for all calls. |
| `spec` | [API\~RateLimits~CatInfo](https://github.com/jpcx/node-kraken-api/blob/0.1.2/docs/namespaces/API/RateLimits.md#~CatInfo) | Rate information for specific [API\~RateLimits~Category](https://github.com/jpcx/node-kraken-api/blob/0.1.2/docs/namespaces/API/RateLimits.md#~Category). |


Source:

*   [node-kraken-api/api/rateLimits/loadLimiter.js](https://github.com/jpcx/node-kraken-api/blob/0.1.2/api/rateLimits/loadLimiter.js), [line 25](https://github.com/jpcx/node-kraken-api/blob/0.1.2/api/rateLimits/loadLimiter.js#L25)

<a name="~CheckPileUp"></a>
#### (inner) CheckPileUp(limitConfig, any)

Checks for more calls being made than responses received and adjusts call frequency accordingly.

##### Parameters:

| Name | Type | Description |
| --- | --- | --- |
| `limitConfig` | [Settings~RateLimiter](https://github.com/jpcx/node-kraken-api/blob/0.1.2/docs/namespaces/Settings.md#~RateLimiter) | Current rate-limiter settings configuration. |
| `any` | [API\~RateLimits~CallInfo](https://github.com/jpcx/node-kraken-api/blob/0.1.2/docs/namespaces/API/RateLimits.md#~CallInfo) | Rate information for all calls. |


Source:

*   [node-kraken-api/api/rateLimits/loadLimiter.js](https://github.com/jpcx/node-kraken-api/blob/0.1.2/api/rateLimits/loadLimiter.js), [line 9](https://github.com/jpcx/node-kraken-api/blob/0.1.2/api/rateLimits/loadLimiter.js#L9)

<a name="~GetAuthRegenIntvl"></a>
#### (inner) GetAuthRegenIntvl(method, tier) → \{number}

Gets the frequency required for sustainable execution of a private method.

##### Parameters:

| Name | Type | Description |
| --- | --- | --- |
| `method` | [Kraken~Method](https://github.com/jpcx/node-kraken-api/blob/0.1.2/docs/namespaces/Kraken.md#~Method) | Method being called. |
| `tier` | [Kraken~Tier](https://github.com/jpcx/node-kraken-api/blob/0.1.2/docs/namespaces/Kraken.md#~Tier) | Current verification tier. |


Source:

*   [node-kraken-api/api/rateLimits/loadLimiter.js](https://github.com/jpcx/node-kraken-api/blob/0.1.2/api/rateLimits/loadLimiter.js), [line 188](https://github.com/jpcx/node-kraken-api/blob/0.1.2/api/rateLimits/loadLimiter.js#L188)

##### Returns:

Optimal interval.

Type

number

<a name="~GetCategory"></a>
#### (inner) GetCategory(method) → \{[API\~RateLimits~Category](https://github.com/jpcx/node-kraken-api/blob/0.1.2/docs/namespaces/API/RateLimits.md#~Category)}

Gets the type of server-side rate-limiter category based on the method.

##### Parameters:

| Name | Type | Description |
| --- | --- | --- |
| `method` | [Kraken~Method](https://github.com/jpcx/node-kraken-api/blob/0.1.2/docs/namespaces/Kraken.md#~Method) | Method being called. |


Source:

*   [node-kraken-api/api/rateLimits/loadLimiter.js](https://github.com/jpcx/node-kraken-api/blob/0.1.2/api/rateLimits/loadLimiter.js), [line 172](https://github.com/jpcx/node-kraken-api/blob/0.1.2/api/rateLimits/loadLimiter.js#L172)

##### Returns:

Type of rate-limiter category.

Type

[API\~RateLimits~Category](https://github.com/jpcx/node-kraken-api/blob/0.1.2/docs/namespaces/API/RateLimits.md#~Category)

<a name="~Update"></a>
#### (inner) Update(state, category, contextopt)

Updates [API\~RateLimits~CallInfo](https://github.com/jpcx/node-kraken-api/blob/0.1.2/docs/namespaces/API/RateLimits.md#~CallInfo) and [API\~RateLimits~CatInfo](https://github.com/jpcx/node-kraken-api/blob/0.1.2/docs/namespaces/API/RateLimits.md#~CatInfo) intervals in response to server response behavior.

##### Parameters:

| Name | Type | Attributes | Description |
| --- | --- | --- | --- |
| `state` | [API\~RateLimits~State](https://github.com/jpcx/node-kraken-api/blob/0.1.2/docs/namespaces/API/RateLimits.md#~State) |  | Stateful registry of limiter information. |
| `category` | [API\~RateLimits~Category](https://github.com/jpcx/node-kraken-api/blob/0.1.2/docs/namespaces/API/RateLimits.md#~Category) |  | Type of category based on rate-limiting behavior. |
| `context` | 'pass' \| 'fail' | \<optional> | Reason for invocation; may be called in response to a successful call, a rate limit violation, or a pre-response call attempt. |


Source:

*   [node-kraken-api/api/rateLimits/loadLimiter.js](https://github.com/jpcx/node-kraken-api/blob/0.1.2/api/rateLimits/loadLimiter.js), [line 46](https://github.com/jpcx/node-kraken-api/blob/0.1.2/api/rateLimits/loadLimiter.js#L46)

### Type Definitions

<a name="~CallInfo"></a>
#### CallInfo

Contains rate information for all calls.

##### Type:

*   Object

##### Properties:

| Name | Type | Description |
| --- | --- | --- |
| `intvl` | number | Current calculated safe interval. |
| `attmp` | Array.<number> | Array of call times (in ms) for attempted calls. |
| `compl` | Array.<number> | Array of call times (in ms) for responses. |


Source:

*   [node-kraken-api/api/rateLimits/rateLimits.jsdoc](https://github.com/jpcx/node-kraken-api/blob/0.1.2/api/rateLimits/rateLimits.jsdoc), [line 20](https://github.com/jpcx/node-kraken-api/blob/0.1.2/api/rateLimits/rateLimits.jsdoc#L20)

<a name="~Category"></a>
#### Category

Separates calls into four categories that are known to have different server-side rate-limiting behavior.

##### Type:

*   'ohlc' | 'trades' | 'other' | 'auth'

Source:

*   [node-kraken-api/api/rateLimits/rateLimits.jsdoc](https://github.com/jpcx/node-kraken-api/blob/0.1.2/api/rateLimits/rateLimits.jsdoc), [line 14](https://github.com/jpcx/node-kraken-api/blob/0.1.2/api/rateLimits/rateLimits.jsdoc#L14)

<a name="~CatInfo"></a>
#### CatInfo

Holds information for category-specific frequencies.

##### Type:

*   Object

##### Properties:

| Name | Type | Description |
| --- | --- | --- |
| `intvl` | number | Current calculated safe interval. |
| `last` | number | Time (in ms) of last call attempt. |


Source:

*   [node-kraken-api/api/rateLimits/rateLimits.jsdoc](https://github.com/jpcx/node-kraken-api/blob/0.1.2/api/rateLimits/rateLimits.jsdoc), [line 35](https://github.com/jpcx/node-kraken-api/blob/0.1.2/api/rateLimits/rateLimits.jsdoc#L35)

<a name="~Functions"></a>
#### Functions

Contains functions for working with rate-limits.

##### Type:

*   Object

##### Properties:

| Name | Type | Description |
| --- | --- | --- |
| `attempt` | [API\~RateLimits~Attempt](https://github.com/jpcx/node-kraken-api/blob/0.1.2/docs/namespaces/API/RateLimits.md#~Attempt) | Register a new call attempt. |
| `addPass` | [API\~RateLimits~AddPass](https://github.com/jpcx/node-kraken-api/blob/0.1.2/docs/namespaces/API/RateLimits.md#~AddPass) | Register a new successful call response. |
| `addFail` | [API\~RateLimits~AddFail](https://github.com/jpcx/node-kraken-api/blob/0.1.2/docs/namespaces/API/RateLimits.md#~AddFail) | Register a new rate-limit violation. |
| `getCategory` | [API\~RateLimits~GetCategory](https://github.com/jpcx/node-kraken-api/blob/0.1.2/docs/namespaces/API/RateLimits.md#~GetCategory) | Gets the type of rate-limiting behavior based on the method. |
| `getAuthRegenIntvl` | [API\~RateLimits~GetAuthRegenIntvl](https://github.com/jpcx/node-kraken-api/blob/0.1.2/docs/namespaces/API/RateLimits.md#~GetAuthRegenIntvl) | Gets the amount of time necessary for a given private method to be called sustainably. |


Source:

*   [node-kraken-api/api/rateLimits/loadLimiter.js](https://github.com/jpcx/node-kraken-api/blob/0.1.2/api/rateLimits/loadLimiter.js), [line 102](https://github.com/jpcx/node-kraken-api/blob/0.1.2/api/rateLimits/loadLimiter.js#L102)

<a name="~State"></a>
#### State

Holds data relevant to current execution state.

##### Properties:

| Name | Type | Description |
| --- | --- | --- |
| `settings` | [Settings~Config](https://github.com/jpcx/node-kraken-api/blob/0.1.2/docs/namespaces/Settings.md#~Config) | Current settings configuration. |
| `calls` | [API\~RateLimits~CallInfo](https://github.com/jpcx/node-kraken-api/blob/0.1.2/docs/namespaces/API/RateLimits.md#~CallInfo) | Rate info for all calls. |
| `catInfo` | [API\~RateLimits~CatInfo](https://github.com/jpcx/node-kraken-api/blob/0.1.2/docs/namespaces/API/RateLimits.md#~CatInfo) | Map of category to object containing category-specific rate information. |


Source:

*   [node-kraken-api/api/rateLimits/loadLimiter.js](https://github.com/jpcx/node-kraken-api/blob/0.1.2/api/rateLimits/loadLimiter.js), [line 85](https://github.com/jpcx/node-kraken-api/blob/0.1.2/api/rateLimits/loadLimiter.js#L85)

<hr>

## [Home](https://github.com/jpcx/node-kraken-api/blob/0.1.2/README.md)
  + [node-kraken-api](https://github.com/jpcx/node-kraken-api/blob/0.1.2/docs/modules/node-kraken-api.md)
  + [API](https://github.com/jpcx/node-kraken-api/blob/0.1.2/docs/namespaces/API.md)
    + [Calls](https://github.com/jpcx/node-kraken-api/blob/0.1.2/docs/namespaces/API/Calls.md)
      + [GenRequestData](https://github.com/jpcx/node-kraken-api/blob/0.1.2/docs/modules/API/Calls/GenRequestData.md)
      + [LoadCall](https://github.com/jpcx/node-kraken-api/blob/0.1.2/docs/modules/API/Calls/LoadCall.md)
      + [SignRequest](https://github.com/jpcx/node-kraken-api/blob/0.1.2/docs/modules/API/Calls/SignRequest.md)
    + [RateLimits](https://github.com/jpcx/node-kraken-api/blob/0.1.2/docs/namespaces/API/RateLimits.md)
      + [LoadLimiter](https://github.com/jpcx/node-kraken-api/blob/0.1.2/docs/modules/API/RateLimits/LoadLimiter.md)
    + [Syncing](https://github.com/jpcx/node-kraken-api/blob/0.1.2/docs/namespaces/API/Syncing.md)
      + [LoadSync](https://github.com/jpcx/node-kraken-api/blob/0.1.2/docs/modules/API/Syncing/LoadSync.md)
  + [Settings](https://github.com/jpcx/node-kraken-api/blob/0.1.2/docs/namespaces/Settings.md)
    + [ParseSettings](https://github.com/jpcx/node-kraken-api/blob/0.1.2/docs/modules/Settings/ParseSettings.md)
  + [Tools](https://github.com/jpcx/node-kraken-api/blob/0.1.2/docs/namespaces/Tools.md)
    + [AlphabetizeNested](https://github.com/jpcx/node-kraken-api/blob/0.1.2/docs/modules/Tools/AlphabetizeNested.md)
    + [ParseNested](https://github.com/jpcx/node-kraken-api/blob/0.1.2/docs/modules/Tools/ParseNested.md)
  + [Kraken](https://github.com/jpcx/node-kraken-api/blob/0.1.2/docs/namespaces/Kraken.md)