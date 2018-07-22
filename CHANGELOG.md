# Changelog

<a name="0.4.1"></a>

## [0.4.1](https://github.com/jpcx/node-kraken-api/tree/0.4.1) (2018-07-21)

| __[Changes since 0.4.0](https://github.com/jpcx/node-kraken-api/compare/0.4.0...0.4.1)__ | [Release Notes](https://github.com/jpcx/node-kraken-api/releases/tag/0.4.1) | [README](https://github.com/jpcx/node-kraken-api/tree/0.4.1/README.md) |
| --- | --- | --- |

| [Source Code (zip)](https://github.com/jpcx/node-kraken-api/archive/0.4.1.zip) | [Source Code (tar.gz)](https://github.com/jpcx/node-kraken-api/archive/0.4.1.tar.gz) |
| --- | --- |

__Bugfixes:__

+ __API/RateLimits:__ Increased limitConfig.authCounterReductionTimeout to 300000.

<a name="0.4.0"></a>

## [0.4.0](https://github.com/jpcx/node-kraken-api/tree/0.4.0) (2018-07-21)

| __[Changes since 0.3.1](https://github.com/jpcx/node-kraken-api/compare/0.3.1...0.4.0)__ | [Release Notes](https://github.com/jpcx/node-kraken-api/releases/tag/0.4.0) | [README](https://github.com/jpcx/node-kraken-api/tree/0.4.0/README.md) |
| --- | --- | --- |

| [Source Code (zip)](https://github.com/jpcx/node-kraken-api/archive/0.4.0.zip) | [Source Code (tar.gz)](https://github.com/jpcx/node-kraken-api/archive/0.4.0.tar.gz) |
| --- | --- |

__Features:__

+ __API/RateLimits:__       Added logic for handling temporary lockouts.
+ __API/RateLimits:__       Added logic for private call rate-limit violations.
+ __Tests/API/RateLimits:__ Added tests for new rate-limiting logic.

__Bugfixes:__

+ __Docs:__         Applied linting rules to markdown.
+ __CHANGELOG:__    Changed naming scheme for information entries.
+ __package.json:__ Removed 'crypto' from dependencies.
+ __package.json:__ Removed eslint* from devDependencies.

<a name="0.3.1"></a>

## [0.3.1](https://github.com/jpcx/node-kraken-api/tree/0.3.1) (2018-07-20)

| __[Changes since 0.3.0](https://github.com/jpcx/node-kraken-api/compare/0.3.0...0.3.1)__ | [Release Notes](https://github.com/jpcx/node-kraken-api/releases/tag/0.3.1) | [README](https://github.com/jpcx/node-kraken-api/tree/0.3.1/README.md) |
| --- | --- | --- |

| [Source Code (zip)](https://github.com/jpcx/node-kraken-api/archive/0.3.1.zip) | [Source Code (tar.gz)](https://github.com/jpcx/node-kraken-api/archive/0.3.1.tar.gz) |
| --- | --- |

__Bugfixes:__

+ __CHANGELOG:__ Fixed new feature language and added more information to 0.3.0 bugfixes.

<a name="0.3.0"></a>

## [0.3.0](https://github.com/jpcx/node-kraken-api/tree/0.3.0) (2018-07-20)

| __[Changes since 0.2.0](https://github.com/jpcx/node-kraken-api/compare/0.2.0...0.3.0)__ | [Release Notes](https://github.com/jpcx/node-kraken-api/releases/tag/0.3.0) | [README](https://github.com/jpcx/node-kraken-api/tree/0.3.0/README.md) |
| --- | --- | --- |

| [Source Code (zip)](https://github.com/jpcx/node-kraken-api/archive/0.3.0.zip) | [Source Code (tar.gz)](https://github.com/jpcx/node-kraken-api/archive/0.3.0.tar.gz) |
| --- | --- |

__Features:__

+ __API/RateLimits:__   Implemented authenticated call rate-limiting using a counter as defined in the Kraken API Docs.

__Bugfixes:__

+ __README:__               Reduced donation qr size.
+ __Tests/API/RateLimits:__ Fixed 'Limits public categories correctly' test.

<a name="0.2.0"></a>

## [0.2.0](https://github.com/jpcx/node-kraken-api/tree/0.2.0) (2018-06-26)

| __[Changes since 0.1.3](https://github.com/jpcx/node-kraken-api/compare/0.1.3...0.2.0)__ | [Release Notes](https://github.com/jpcx/node-kraken-api/releases/tag/0.2.0) | [README](https://github.com/jpcx/node-kraken-api/tree/0.2.0/README.md) |
| --- | --- | --- |

| [Source Code (zip)](https://github.com/jpcx/node-kraken-api/archive/0.2.0.zip) | [Source Code (tar.gz)](https://github.com/jpcx/node-kraken-api/archive/0.2.0.tar.gz) |
| --- | --- |

__BREAKING CHANGES:__

+ __Settings:__    Rate Limiter settings have been reduced to only baseIntvl and minIntvl.
+ __API/Syncing:__ Sync instance data is no longer non-writable and non-configurable.
+ __API/Syncing:__ Sync instance time property is now directly below the data property.
+ __API/Syncing:__ RemoveAllListeners has been removed.

__Features:__

+ __Settings:__ DataFormatter functionality added.

__Bugfixes:__

+ __node-kraken-api:__ SetOTP now returns true.
+ __Docs:__            API\~Syncing\~EventListener documentation has been updated to reflect new behavior.

<a name="0.1.3"></a>

## [0.1.3](https://github.com/jpcx/node-kraken-api/tree/0.1.3) (2018-06-24)

| __[Changes since 0.1.2](https://github.com/jpcx/node-kraken-api/compare/0.1.2...0.1.3)__ | [Release Notes](https://github.com/jpcx/node-kraken-api/releases/tag/0.1.3) | [README](https://github.com/jpcx/node-kraken-api/tree/0.1.3/README.md) |
| --- | --- | --- |

| [Source Code (zip)](https://github.com/jpcx/node-kraken-api/archive/0.1.3.zip) | [Source Code (tar.gz)](https://github.com/jpcx/node-kraken-api/archive/0.1.3.tar.gz) |
| --- | --- |

__Bugfixes:__

+ __Settings:__    Changed default sync interval settings to 2000ms.
+ __Settings:__    Improved settings and defaults combination logic.
+ __API/Syncing:__ Improved authenticated call interval logic.

<a name="0.1.2"></a>

## [0.1.2](https://github.com/jpcx/node-kraken-api/tree/0.1.2) (2018-06-24)

| __[Changes since 0.1.1](https://github.com/jpcx/node-kraken-api/compare/0.1.1...0.1.2)__ | [Release Notes](https://github.com/jpcx/node-kraken-api/releases/tag/0.1.2) | [README](https://github.com/jpcx/node-kraken-api/tree/0.1.2/README.md) |
| --- | --- | --- |

| [Source Code (zip)](https://github.com/jpcx/node-kraken-api/archive/0.1.2.zip) | [Source Code (tar.gz)](https://github.com/jpcx/node-kraken-api/archive/0.1.2.tar.gz) |
| --- | --- |

__Bugfixes:__

+ __CHANGELOG:__ Added CHANGELOG entries for 0.1.1 and 0.1.2.

<a name="0.1.1"></a>

## [0.1.1](https://github.com/jpcx/node-kraken-api/tree/0.1.1) (2018-06-24)

| __[Changes since 0.1.0](https://github.com/jpcx/node-kraken-api/compare/0.1.0...0.1.1)__ | [Release Notes](https://github.com/jpcx/node-kraken-api/releases/tag/0.1.1) | [README](https://github.com/jpcx/node-kraken-api/tree/0.1.1/README.md) |
| --- | --- | --- |

| [Source Code (zip)](https://github.com/jpcx/node-kraken-api/archive/0.1.1.zip) | [Source Code (tar.gz)](https://github.com/jpcx/node-kraken-api/archive/0.1.1.tar.gz) |
| --- | --- |

__Bugfixes:__

+ __README:__ Fixed formatting for mobile devices.
+ __README:__ Fixed BTC donation address.

<a name="0.1.0"></a>

## [0.1.0](https://github.com/jpcx/node-kraken-api/tree/0.1.0) (2018-06-24)

| [Release Notes](https://github.com/jpcx/node-kraken-api/releases/tag/0.1.0) | [README](https://github.com/jpcx/node-kraken-api/blob/0.1.0/README.md) |
| --- | --- |

| [Source Code (zip)](https://github.com/jpcx/node-kraken-api/archive/0.1.0.zip) | [Source Code (tar.gz)](https://github.com/jpcx/node-kraken-api/archive/0.1.0.tar.gz) |
| --- | --- |

__Features:__

+ __node-kraken-api:__ Module created.