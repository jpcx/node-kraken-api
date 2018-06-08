Module: Tools/readFileJSON
==========================

Reads JSON in a file given a path. Creates directory structure if not found. Creates file with supplied default data if not found.

##### Parameters:

| Name | Type | Description |
| --- | --- | --- |
| `path` | string | Path to file (prepended by `process.cwd()`). |
| `data` | Object | Array | Default data to create if not found. |

Source:

*   [node-kraken-api/tools/readFileJSON.js](https://github.com/jpcx/node-kraken-api/blob/0.1.0/tools/readFileJSON.js), [line 33](https://github.com/jpcx/node-kraken-api/blob/0.1.0/tools/readFileJSON.js#L33)

##### Returns:

Resolves with read data (or written default data); rejects with failures.

Type

Promise

<hr>

## [Home](https://github.com/jpcx/node-kraken-api/blob/0.1.0/README.md)