# API

Contains methods and types for the client-side API.

Source:

* [node-kraken-api/api/api.jsdoc](https://github.com/jpcx/node-kraken-api/blob/0.4.1/api/api.jsdoc), [line 7](https://github.com/jpcx/node-kraken-api/blob/0.4.1/api/api.jsdoc#L7)

## Namespaces

[Calls](https://github.com/jpcx/node-kraken-api/blob/0.4.1/docs/namespaces/API/Calls.md)

[RateLimits](https://github.com/jpcx/node-kraken-api/blob/0.4.1/docs/namespaces/API/RateLimits.md)

[Syncing](https://github.com/jpcx/node-kraken-api/blob/0.4.1/docs/namespaces/API/Syncing.md)

## Methods

<a name="~SetLimiter"></a>

### (inner) SetLimiter(limiter) → \{boolean}

Sets new limiter settings to the execution settings

__Parameters:__

| Name | Type | Description |
| --- | --- | --- |
| `limiter` | [Settings~RateLimiter](https://github.com/jpcx/node-kraken-api/blob/0.4.1/docs/namespaces/Settings.md#~RateLimiter) | New limiter settings. |

Source:

* [node-kraken-api/index.js](https://github.com/jpcx/node-kraken-api/blob/0.4.1/index.js), [line 87](https://github.com/jpcx/node-kraken-api/blob/0.4.1/index.js#L87)

__Throws:__

Throws a TypeError if limiter does not match specifications; throws a RangeError if settings are not >= 0.

___Type:___

* TypeError | RangeError

__Returns:__

True if successful.

___Type:___

* boolean

<a name="~SetOTP"></a>

### (inner) SetOTP(otp) → \{boolean}

Sets a new two-factor password to the execution settings

__Parameters:__

| Name | Type | Description |
| --- | --- | --- |
| `otp` | [Kraken~OTP](https://github.com/jpcx/node-kraken-api/blob/0.4.1/docs/namespaces/Kraken.md#~OTP) | New two-factor password. |

Source:

* [node-kraken-api/index.js](https://github.com/jpcx/node-kraken-api/blob/0.4.1/index.js), [line 28](https://github.com/jpcx/node-kraken-api/blob/0.4.1/index.js#L28)

__Throws:__

Throws a TypeError if otp is a not string or a number.

___Type:___

* TypeError

__Returns:__

True if successful.

___Type:___

* boolean

<a name="~SetRetryCt"></a>

### (inner) SetRetryCt(retryCt) → \{boolean}

Sets a new RetryCount to the execution settings

__Parameters:__

| Name | Type | Description |
| --- | --- | --- |
| `retryCt` | [API\~Calls~RetryCount](https://github.com/jpcx/node-kraken-api/blob/0.4.1/docs/namespaces/API/Calls.md#~RetryCount) | New retryCt. |

Source:

* [node-kraken-api/index.js](https://github.com/jpcx/node-kraken-api/blob/0.4.1/index.js), [line 66](https://github.com/jpcx/node-kraken-api/blob/0.4.1/index.js#L66)

__Throws:__

Throws a TypeError if retryCt is a not equivalent to a number; throws a RangeError if retryCt is not >= 0.

___Type:___

* TypeError | RangeError

__Returns:__

True if successful.

___Type:___

* boolean

<a name="~SetTimeout"></a>

### (inner) SetTimeout(timeout) → \{boolean}

Sets a new timeout to the execution settings

__Parameters:__

| Name | Type | Description |
| --- | --- | --- |
| `timeout` | [API\~Calls~Timeout](https://github.com/jpcx/node-kraken-api/blob/0.4.1/docs/namespaces/API/Calls.md#~Timeout) | New timeout. |

Source:

* [node-kraken-api/index.js](https://github.com/jpcx/node-kraken-api/blob/0.4.1/index.js), [line 45](https://github.com/jpcx/node-kraken-api/blob/0.4.1/index.js#L45)

__Throws:__

Throws a TypeError if timeout is a not equivalent to a number; throws a RangeError if timeout is not greater than 0.

___Type:___

* TypeError | RangeError

__Returns:__

True if successful.

___Type:___

* boolean

## Type Definitions

<a name="~Callback"></a>

### Callback(err, data)

Function which handles errors and data.

__Parameters:__

| Name | Type | Description |
| --- | --- | --- |
| `err` | [API\~Calls~CallError](https://github.com/jpcx/node-kraken-api/blob/0.4.1/docs/namespaces/API/Calls.md#~CallError) | Request errors. |
| `data` | [API\~Calls~CallData](https://github.com/jpcx/node-kraken-api/blob/0.4.1/docs/namespaces/API/Calls.md#~CallData) | Response data. |

Source:

* [node-kraken-api/api/api.jsdoc](https://github.com/jpcx/node-kraken-api/blob/0.4.1/api/api.jsdoc), [line 13](https://github.com/jpcx/node-kraken-api/blob/0.4.1/api/api.jsdoc#L13)

<a name="~Functions"></a>

### Functions

Provides functions which can be used to interact with the API.

__Type:__

* Object

__Properties:__

| Name | Type | Description |
| --- | --- | --- |
| `call` | [API\~Calls~Call](https://github.com/jpcx/node-kraken-api/blob/0.4.1/docs/namespaces/API/Calls.md#~Call) | Call a single method. |
| `sync` | [API\~Syncing~Sync](https://github.com/jpcx/node-kraken-api/blob/0.4.1/docs/namespaces/API/Syncing.md#~Sync) | Create a sync instance. |
| `setOTP` | [API~SetOTP](https://github.com/jpcx/node-kraken-api/blob/0.4.1/docs/namespaces/API.md#~SetOTP) | Sets new two-factor password. |
| `setTimeout` | [API~SetTimeout](https://github.com/jpcx/node-kraken-api/blob/0.4.1/docs/namespaces/API.md#~SetTimeout) | Sets a new timeout. |
| `setRetryCt` | [API~SetRetryCt](https://github.com/jpcx/node-kraken-api/blob/0.4.1/docs/namespaces/API.md#~SetRetryCt) | Sets a new retryCt. |
| `setLimiter` | [API~SetLimiter](https://github.com/jpcx/node-kraken-api/blob/0.4.1/docs/namespaces/API.md#~SetLimiter) | Sets new limiter settings. |

Source:

* [node-kraken-api/index.js](https://github.com/jpcx/node-kraken-api/blob/0.4.1/index.js), [line 131](https://github.com/jpcx/node-kraken-api/blob/0.4.1/index.js#L131)

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