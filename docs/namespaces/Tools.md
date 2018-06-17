# Tools

Contains methods and types for various client-side tools.

##### Properties:

| Name | Type | Description |
| --- | --- | --- |
| `ms` | [module:Tools/ms](https://github.com/jpcx/node-kraken-api/blob/develop/docs/modules/Tools/ms.md) | Returns a promise which resolves after a given number of milliseconds. |
| `parseNested` | [module:Tools/parseNested](https://github.com/jpcx/node-kraken-api/blob/develop/docs/modules/Tools/parseNested.md) | Parses a nested Object, Array, Map, or Set according to the rules defined in [Settings~Parse](https://github.com/jpcx/node-kraken-api/blob/develop/docs/namespaces/Settings.md#~Parse) |
| `tryDirectory` | [module:Tools/tryDirectory](https://github.com/jpcx/node-kraken-api/blob/develop/docs/modules/Tools/tryDirectory.md) | Attempts to access a directory structure and creates it if not found. |
| `readFileJSON` | [module:Tools/readFileJSON](https://github.com/jpcx/node-kraken-api/blob/develop/docs/modules/Tools/readFileJSON.md) | Attempts to read JSON from a file given a path; creates file and directory structure with default data if not found. |
| `writeFileJSON` | [module:Tools/writeFileJSON](https://github.com/jpcx/node-kraken-api/blob/develop/docs/modules/Tools/writeFileJSON.md) | Attempts to write JSON data to a file given a path. |


Source:

*   [node-kraken-api/tools/tools.jsdoc](https://github.com/jpcx/node-kraken-api/blob/develop/tools/tools.jsdoc), [line 7](https://github.com/jpcx/node-kraken-api/blob/develop/tools/tools.jsdoc#L7)

### Methods

<a name=".tryFileJSON"></a>
#### (static) tryFileJSON(path, data) → \{Object|Array}

Reads JSON in a file given a path. Creates file with supplied default data if not found.

##### Parameters:

| Name | Type | Description |
| --- | --- | --- |
| `path` | string | Path to file (prepended by `process.cwd()`). |
| `data` | Object \| Array | Default data to create if not found. |


Source:

*   [node-kraken-api/tools/readFileJSON.js](https://github.com/jpcx/node-kraken-api/blob/develop/tools/readFileJSON.js), [line 20](https://github.com/jpcx/node-kraken-api/blob/develop/tools/readFileJSON.js#L20)

##### Returns:

Parsed JSON.

Type

Object | Array

<a name=".writeJSON"></a>
#### (static) writeJSON(path, data)

Writes JSON in a file given a path. Creates file with supplied default data if not found.

##### Parameters:

| Name | Type | Description |
| --- | --- | --- |
| `path` | string | Path to file. |
| `data` | Object \| Array | Data to write as JSON. |


Source:

*   [node-kraken-api/tools/writeFileJSON.js](https://github.com/jpcx/node-kraken-api/blob/develop/tools/writeFileJSON.js), [line 19](https://github.com/jpcx/node-kraken-api/blob/develop/tools/writeFileJSON.js#L19)

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
  + [Tools](https://github.com/jpcx/node-kraken-api/blob/develop/docs/namespaces/Tools.md)
    + [ms](https://github.com/jpcx/node-kraken-api/blob/develop/docs/modules/Tools/ms.md)
    + [parseNested](https://github.com/jpcx/node-kraken-api/blob/develop/docs/modules/Tools/parseNested.md)
    + [readFileJSON](https://github.com/jpcx/node-kraken-api/blob/develop/docs/modules/Tools/readFileJSON.md)
    + [tryDirectory](https://github.com/jpcx/node-kraken-api/blob/develop/docs/modules/Tools/tryDirectory.md)
    + [writeFileJSON](https://github.com/jpcx/node-kraken-api/blob/develop/docs/modules/Tools/writeFileJSON.md)
  + [Kraken](https://github.com/jpcx/node-kraken-api/blob/develop/docs/namespaces/Kraken.md)