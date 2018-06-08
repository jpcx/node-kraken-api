# Tools

Contains methods and types for various client-side tools.

##### Properties:

| Name | Type | Description |
| --- | --- | --- |
| `ms` | [module:Tools/ms](https://github.com/jpcx/node-kraken-api/blob/0.1.0/docs/modules/Tools/ms.md) | Returns a promise which resolves after a given number of milliseconds. |
| `parseNested` | [module:Tools/parseNested](https://github.com/jpcx/node-kraken-api/blob/0.1.0/docs/modules/Tools/parseNested.md) | Parses a nested Object, Array, Map, or Set according to the rules defined in [Settings~Parse](https://github.com/jpcx/node-kraken-api/blob/0.1.0/docs/namespaces/Settings.md#~Parse) |
| `tryDirectory` | [module:Tools/tryDirectory](https://github.com/jpcx/node-kraken-api/blob/0.1.0/docs/modules/Tools/tryDirectory.md) | Attempts to access a directory structure and creates it if not found. |
| `readFileJSON` | [module:Tools/readFileJSON](https://github.com/jpcx/node-kraken-api/blob/0.1.0/docs/modules/Tools/readFileJSON.md) | Attempts to read JSON from a file given a path; creates file and directory structure with default data if not found. |
| `writeFileJSON` | [module:Tools/writeFileJSON](https://github.com/jpcx/node-kraken-api/blob/0.1.0/docs/modules/Tools/writeFileJSON.md) | Attempts to write JSON data to a file given a path. |

Source:

*   [tools/tools.jsdoc](tools_tools.jsdoc.html), [line 7](tools_tools.jsdoc.html#line7)

### Methods

<a name=".tryFileJSON"></a>
#### (static) tryFileJSON(path, data) → \{Object|Array}

Reads JSON in a file given a path. Creates file with supplied default data if not found.

##### Parameters:

| Name | Type | Description |
| --- | --- | --- |
| `path` | string | Path to file (prepended by `process.cwd()`). |
| `data` | Object | Array | Default data to create if not found. |

Source:

*   [node-kraken-api/tools/readFileJSON.js](https://github.com/jpcx/node-kraken-api/blob/0.1.0/tools/readFileJSON.js), [line 20](https://github.com/jpcx/node-kraken-api/blob/0.1.0/tools/readFileJSON.js#L20)

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
| `data` | Object | Array | Data to write as JSON. |

Source:

*   [node-kraken-api/tools/writeFileJSON.js](https://github.com/jpcx/node-kraken-api/blob/0.1.0/tools/writeFileJSON.js), [line 19](https://github.com/jpcx/node-kraken-api/blob/0.1.0/tools/writeFileJSON.js#L19)

<hr>

## [Home](https://github.com/jpcx/node-kraken-api/blob/0.1.0/README.md)