Module: Tools/tryDirectory
==========================

Attempts to access a given directory. Creates structure if not found.

##### Parameters:

| Name | Type | Description |
| --- | --- | --- |
| `path` | string | Path to file (prepended by `process.cwd()`). |

Source:

*   [node-kraken-api/tools/tryDirectory.js](https://github.com/jpcx/node-kraken-api/blob/0.1.0/tools/tryDirectory.js), [line 11](https://github.com/jpcx/node-kraken-api/blob/0.1.0/tools/tryDirectory.js#L11)

##### Returns:

Resolves if directory structure exists or has been created; rejects if unsuccessful.

Type

Promise

<hr>

## [Home](https://github.com/jpcx/node-kraken-api/blob/0.1.0/README.md)