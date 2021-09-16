[![](https://github.com/jpcx/node-kraken-api/blob/2.0.0/assets/logo.png)](#)

![](https://img.shields.io/github/issues/jpcx/node-kraken-api)
![](https://img.shields.io/github/forks/jpcx/node-kraken-api)
![](https://img.shields.io/github/stars/jpcx/node-kraken-api)
![](https://img.shields.io/npm/dm/node-kraken-api)  
![](https://img.shields.io/librariesio/dependents/npm/node-kraken-api)
![](https://img.shields.io/github/license/jpcx/node-kraken-api)
![](https://img.shields.io/librariesio/github/jpcx/node-kraken-api?label=dev-dependencies)

[![](https://nodei.co/npm/node-kraken-api.png?mini=true)](https://www.npmjs.com/package/node-kraken-api)

## About

node-kraken-api is a typed REST/WS Node.JS client for the Kraken cryptocurrency exchange.  
This is an unofficial API. Please refer to the official documentation for up-to-date information.

REST API Docs: [kraken.com/features/api](https://www.kraken.com/features/api)  
WebSocket API Docs: [docs.kraken.com/websockets](https://docs.kraken.com/websockets/)

### Features

- Fully typed REST and WS responses and options.
  - REST methods/comments are generated from the official OpenAPI specifications file.
  - WS methods/comments are sourced from the official WebSockets 1.8.3 documentation.
  - Note:
    - All named response properties are optional and nullable unless explicitly marked required in the documentation.
- `RetrieveExport` (binary endpoint); see the [example](#RetrieveExport).
- Full WS orderbook mirroring and checksum validation.

[CHANGELOG](https://github.com/jpcx/node-kraken-api/blob/2.0.0/CHANGELOG.md) | [Synopsis](#synopsis) | [Usage](#usage) | [Code](https://github.com/jpcx/node-kraken-api/blob/2.0.0/index.ts) |
| --- | --- | --- | --- |

### 0.4.1 MIGRATION NOTICE:

The entire project has been completely rewritten using TypeScript and many features have changed.

If you're upgrading, please review the changes and upgrade guide below.

<details>

#### Added

- Complete WS 1.8.3 functionality
- Typings
- New REST methods

#### Removed

- Custom response parsing
  - _To ensure type consistency, it is best to leave parsing to the user._
- Ratelimiting
  - _The aim of this API is to maximize clear and accurate communication with the server._
- retryCt setting
  - _This was originally included due to the occasional nonce and timeout error._
    - _To reduce this possibility, increase your API key nonce window and the `.timeout` setting._
- REST syncing
  - _With the introduction of the WebSocket connection, REST syncing is no longer required for many data sources._
    - _For all other sources, simply use an asynchronous loop._
- Method name settings
  - _Previously, settings were used to differentiate between public and private methods rather than requiring the user to specify for each call._
  - _Instead, named requests are provided to hard-code these differences._
- Direct construction using `module.exports()`
  - _Changed to class export for modern standards._

#### Changed

- `.call()`: replaced by `.request()`
  - _`.request()` now accepts four arguments: `endpoint`, `options`, `public`|`private`, `utf8`|`binary`._
- `.setOTP()`: replaced by the `.genotp` setting.
- Errors have changed to named classes. Please review [the synopsis](https://github.com/jpcx/node-kraken-api/blob/2.0.0/README.md#synopsis).

#### Upgrade Guide

1. Replace all calls to `.call()` with the corresponding named method.
    - _Make sure to view the expected response types; they have changed since 0.4.1._
    - _Alternatively, use `.request()`:_
        - _`.call("Assets", { pair: "XXBTZUSD" }, (response) => ...);` -> `.request("Assets", { pair: "XXBTZUSD" }).then(...);`_
        - _`.call("Balance").then(...);` -> `.request("Balance", "private").then(...);`_
2. Replace all sync instances with an async loop that requests every few seconds.
    - _If you are syncing one of the endpoints provided by WS, use that instead._
3. Ensure that your REST calls are not being made too quickly.
    - _Ratelimiting has been removed; you may encounter server errors if you were relying on the limiter._
    - _See the rate limits [documentation](https://docs.kraken.com/rest/#section/Rate-Limits)._
4. Increase your api key nonce window if you're getting invalid nonce errors.
    - _Calls may now be performed concurrently; 0.4.1 queued calls to guarantee nonce order._
5. Remove calls to `.setOTP()`; provide `.genotp` in the settings.
6. Review the error classes; if you were parsing errors you will need to update your catch statements.
    - _Note: calls are no longer automatically retried `retryCt` times._
7. If you're constructing using module.exports (e.g. `const kraken = require('node-kraken-api')({...})`), you will need to use the `module.exports.Kraken` class instead: `import { Kraken } from "node-kraken-api"; const kraken = new Kraken({...});`

</details>

### 1.0.0 MIGRATION NOTICE:

Minor changes to the Emitter class.

<details>

#### Changed

- Kraken.Emitter moved to its [own package](https://github.com/jpcx/ts-ev) and improved; filters now pass on type assertion result to listeners.
  - _This changed the signature for event filtering:_
    - _`(...args: <type>[]) => boolean` -> `(args: [<type>, <type>, ...]) => args is [<subtype>, <subtype>, ...]`_

#### Removed
  
- Kraken.Emitter
  
</details>

## Synopsis <a name=synopsis />

### Methods

- [`.request()`](https://github.com/jpcx/node-kraken-api/blob/2.0.0/index.ts#L178)
- [`.time()`](https://github.com/jpcx/node-kraken-api/blob/2.0.0/index.ts#L194)
- [`.systemStatus()`](https://github.com/jpcx/node-kraken-api/blob/2.0.0/index.ts#L201)
- [`.assets()`](https://github.com/jpcx/node-kraken-api/blob/2.0.0/index.ts#L208)
- [`.assetPairs()`](https://github.com/jpcx/node-kraken-api/blob/2.0.0/index.ts#L230)
- [`.ticker()`](https://github.com/jpcx/node-kraken-api/blob/2.0.0/index.ts#L256)
- [`.ohlc()`](https://github.com/jpcx/node-kraken-api/blob/2.0.0/index.ts#L273)
- [`.depth()`](https://github.com/jpcx/node-kraken-api/blob/2.0.0/index.ts#L301)
- [`.trades()`](https://github.com/jpcx/node-kraken-api/blob/2.0.0/index.ts#L324)
- [`.spread()`](https://github.com/jpcx/node-kraken-api/blob/2.0.0/index.ts#L346)
- [`.getWebSocketsToken()`](https://github.com/jpcx/node-kraken-api/blob/2.0.0/index.ts#L369)
- [`.balance()`](https://github.com/jpcx/node-kraken-api/blob/2.0.0/index.ts#L376)
- [`.tradeBalance()`](https://github.com/jpcx/node-kraken-api/blob/2.0.0/index.ts#L383)
- [`.openOrders()`](https://github.com/jpcx/node-kraken-api/blob/2.0.0/index.ts#L400)
- [`.closedOrders()`](https://github.com/jpcx/node-kraken-api/blob/2.0.0/index.ts#L421)
- [`.queryOrders()`](https://github.com/jpcx/node-kraken-api/blob/2.0.0/index.ts#L458)
- [`.tradesHistory()`](https://github.com/jpcx/node-kraken-api/blob/2.0.0/index.ts#L483)
- [`.queryTrades()`](https://github.com/jpcx/node-kraken-api/blob/2.0.0/index.ts#L516)
- [`.openPositions()`](https://github.com/jpcx/node-kraken-api/blob/2.0.0/index.ts#L536)
- [`.ledgers()`](https://github.com/jpcx/node-kraken-api/blob/2.0.0/index.ts#L560)
- [`.queryLedgers()`](https://github.com/jpcx/node-kraken-api/blob/2.0.0/index.ts#L599)
- [`.tradeVolume()`](https://github.com/jpcx/node-kraken-api/blob/2.0.0/index.ts#L619)
- [`.addExport()`](https://github.com/jpcx/node-kraken-api/blob/2.0.0/index.ts#L639)
- [`.exportStatus()`](https://github.com/jpcx/node-kraken-api/blob/2.0.0/index.ts#L679)
- [`.retrieveExport()`](https://github.com/jpcx/node-kraken-api/blob/2.0.0/index.ts#L695)
- [`.removeExport()`](https://github.com/jpcx/node-kraken-api/blob/2.0.0/index.ts#L711)
- [`.addOrder()`](https://github.com/jpcx/node-kraken-api/blob/2.0.0/index.ts#L732)
- [`.cancelOrder()`](https://github.com/jpcx/node-kraken-api/blob/2.0.0/index.ts#L826)
- [`.cancelAll()`](https://github.com/jpcx/node-kraken-api/blob/2.0.0/index.ts#L842)
- [`.cancelAllOrdersAfter()`](https://github.com/jpcx/node-kraken-api/blob/2.0.0/index.ts#L850)
- [`.depositMethods()`](https://github.com/jpcx/node-kraken-api/blob/2.0.0/index.ts#L866)
- [`.depositAddresses()`](https://github.com/jpcx/node-kraken-api/blob/2.0.0/index.ts#L882)
- [`.depositStatus()`](https://github.com/jpcx/node-kraken-api/blob/2.0.0/index.ts#L906)
- [`.withdrawInfo()`](https://github.com/jpcx/node-kraken-api/blob/2.0.0/index.ts#L926)
- [`.withdrawStatus()`](https://github.com/jpcx/node-kraken-api/blob/2.0.0/index.ts#L974)
- [`.withdrawCancel()`](https://github.com/jpcx/node-kraken-api/blob/2.0.0/index.ts#L994)
- [`.walletTransfer()`](https://github.com/jpcx/node-kraken-api/blob/2.0.0/index.ts#L1014)
- [`.stake()`](https://github.com/jpcx/node-kraken-api/blob/2.0.0/index.ts#L1043)
- [`.unstake()`](https://github.com/jpcx/node-kraken-api/blob/2.0.0/index.ts#L1068)
- [`.stakingAssets()`](https://github.com/jpcx/node-kraken-api/blob/2.0.0/index.ts#L1090)
- [`.stakingPending()`](https://github.com/jpcx/node-kraken-api/blob/2.0.0/index.ts#L1099)
- [`.stakingTransactions()`](https://github.com/jpcx/node-kraken-api/blob/2.0.0/index.ts#L1108)
- [`.ws.ticker()`](https://github.com/jpcx/node-kraken-api/blob/2.0.0/index.ts#L1133)
- [`.ws.ohlc()`](https://github.com/jpcx/node-kraken-api/blob/2.0.0/index.ts#L1156)
- [`.ws.trade()`](https://github.com/jpcx/node-kraken-api/blob/2.0.0/index.ts#L1179)
- [`.ws.spread()`](https://github.com/jpcx/node-kraken-api/blob/2.0.0/index.ts#L1198)
- [`.ws.book()`](https://github.com/jpcx/node-kraken-api/blob/2.0.0/index.ts#L1217)
- [`.ws.ownTrades()`](https://github.com/jpcx/node-kraken-api/blob/2.0.0/index.ts#L1292)
- [`.ws.openOrders()`](https://github.com/jpcx/node-kraken-api/blob/2.0.0/index.ts#L1317)
- [`.ws.addOrder()`](https://github.com/jpcx/node-kraken-api/blob/2.0.0/index.ts#L1342)
- [`.ws.cancelOrder()`](https://github.com/jpcx/node-kraken-api/blob/2.0.0/index.ts#L1396)
- [`.ws.cancelAll()`](https://github.com/jpcx/node-kraken-api/blob/2.0.0/index.ts#L1412)
- [`.ws.cancelAllOrdersAfter()`](https://github.com/jpcx/node-kraken-api/blob/2.0.0/index.ts#L1432)

### Properties

- [`.ws`](https://github.com/jpcx/node-kraken-api/blob/2.0.0/index.ts#L1115)
- [`.ws.pub`](https://github.com/jpcx/node-kraken-api/blob/2.0.0/index.ts#L1119)
- [`.ws.priv`](https://github.com/jpcx/node-kraken-api/blob/2.0.0/index.ts#L1121)

### Classes

- [`Kraken`](https://github.com/jpcx/node-kraken-api/blob/2.0.0/index.ts#L122)
- [`Kraken.InternalError`](https://github.com/jpcx/node-kraken-api/blob/2.0.0/index.ts#L1455)
- [`Kraken.UnknownError`](https://github.com/jpcx/node-kraken-api/blob/2.0.0/index.ts#L1462)
- [`Kraken.ArgumentError`](https://github.com/jpcx/node-kraken-api/blob/2.0.0/index.ts#L1472)
- [`Kraken.SettingsError`](https://github.com/jpcx/node-kraken-api/blob/2.0.0/index.ts#L1479)
- [`Kraken.JSONParseError`](https://github.com/jpcx/node-kraken-api/blob/2.0.0/index.ts#L1486)
- [`Kraken.BufferParseError`](https://github.com/jpcx/node-kraken-api/blob/2.0.0/index.ts#L1496)
- [`Kraken.HTTPRequestError`](https://github.com/jpcx/node-kraken-api/blob/2.0.0/index.ts#L1506)
- [`Kraken.RESTAPIError`](https://github.com/jpcx/node-kraken-api/blob/2.0.0/index.ts#L1522)
- [`Kraken.TimeoutError`](https://github.com/jpcx/node-kraken-api/blob/2.0.0/index.ts#L1532)
- [`Kraken.WSAPIError`](https://github.com/jpcx/node-kraken-api/blob/2.0.0/index.ts#L1539)
- [`Kraken.WS.Connection`](https://github.com/jpcx/node-kraken-api/blob/2.0.0/index.ts#L4335)
- [`Kraken.WS.Subscriber`](https://github.com/jpcx/node-kraken-api/blob/2.0.0/index.ts#L4636)
- [`Kraken.WS.Subscription`](https://github.com/jpcx/node-kraken-api/blob/2.0.0/index.ts#L4798)

## Usage <a name=usage />

### Integration

```shell
npm i --save node-kraken-api
```

```ts
import { Kraken } from "node-kraken-api";
```

### Settings

```ts
{
  /** REST API key. */
  key?: string;
  /** REST API secret. */
  secret?: string;
  /** REST API OTP generator. */
  genotp?: () => string;
  /** Nonce generator (the default is ms time with an incrementation guarantee). */
  gennonce?: () => number;
  /** Connection timeout. */
  timeout?: number;
}
```

### REST API

#### Public

```ts
const kraken = new Kraken();

const { unixtime } = await kraken.time();
const { XXBT }     = await kraken.assets();
const ticker       = await kraken.ticker({ pair: "XXBTZUSD" })
```

#### Private

```ts
const kraken = new Kraken({ key: "...", secret: "..." });

const { txid } = await kraken.addOrder({
  pair:      "XXBTZUSD",
  type:      "buy",
  ordertype: "limit",
  price:     "65432.1",
  volume:    "1",
});
```

If your key requires an OTP, provide a generator:

```ts
const kraken = new Kraken({ key: "...", secret: "...", genotp: () => "..." });
```

<a name="RetrieveExport"></a>
RetrieveExport is the only method that promises a buffer:

```ts
const kraken = new Kraken({ key: "...", secret: "..." });

const buf = await kraken.retrieveExport({ id: "FOOB" })
fs.writeFileSync("report.zip", buf)
```

### WebSockets

- All WebSocket subscriptions and requests are located within `.ws`.
  - `.ws.pub` and `.ws.priv` provides ping, heartbeat, systemStatus, and general error monitoring.
- Automatically connects to the socket when server data is requested.
  - See `Kraken.WS.Connection.open()` and `Kraken.WS.Connection.close()` for manual connection management.
- Subscription methods return a `Kraken.Subscriber` object that manages subscriptions for a given name and options.

#### Public

```ts
const kraken = new Kraken();

const trade = await kraken.ws.trade()
  .on('update', (update, pair)  => console.log(update, pair))
  .on('status', (status)        => console.log(status))
  .on('error',  (error, pair)   => console.log(error, pair))
  // .subscribe() never rejects! rely on the 'error' and 'status' events
  .subscribe('XBT/USD')

const book100 = await kraken.ws.book({depth: 100})
  // live book construction from "snapshot", "ask", and "bid" events.
  .on("mirror", (mirror, pair) => console.log(mirror, pair))
  .on("error",  (error,  pair) => console.log(error,  pair))
  // resubscribes if there is a checksum validation issue (emits statuses).
  .on("status", (status)       => console.log(status)
  .subscribe("XBT/USD", "ETH/USD"); // subscribe to multiple pairs at once

// unsubscribe from one or more subscriptions
// .unsubscribe() never rejects! rely on the 'error' and 'status' events
await book100.unsubscribe('XBT/ETH');

```

#### Private

```ts
const kraken = new Kraken({ key: "...", secret: "..." });

const { token } = await kraken.getWebSocketsToken();

const orders = kraken.ws.openOrders({ token: token! })
  .on("update", (update, sequence) => console.log(update, sequence))
  .subscribe();

await orders.unsubscribe();

// The token does not expire while the subscription is active, but if you wish
// to resubscribe after unsubscribing you may need to call .ws.openOrders() again.
```

### Testing

Testing is performed by [@jpcx/testts](https://github.com/jpcx/testts).

To run tests:
- Save an `auth.json` file with your key and secret: `{ key: string, secret: string }`
  - Please ensure that this key has **readonly** permissions.
- Run `npm test` in the main directory.

## Development

Contribution is welcome!
Given the amount of typings in this project, there may be discrepancies so please raise an issue or create a pull request.

Also, I am US-based and can't access the futures API; if you have access and want to contribute let me know!

## Author

**Justin Collier** - [jpcx](https://github.com/jpcx)
<a name=donate />
| [![](https://github.com/jpcx/node-kraken-api/blob/2.0.0/assets/xbt.png)](#donate) | [![](https://github.com/jpcx/node-kraken-api/blob/2.0.0/assets/ltc.png)](#donate) | [![](https://github.com/jpcx/node-kraken-api/blob/2.0.0/assets/eth.png)](#donate) | [![](https://github.com/jpcx/node-kraken-api/blob/2.0.0/assets/zec.png)](#donate) | [![](https://github.com/jpcx/node-kraken-api/blob/2.0.0/assets/xmr.png)](#donate)
| --- | --- | --- | --- | --- |
| <sup><sub>`XBT:`&nbsp;`bc1qnkturlnv4yufkc40k4ysxz4maak5mug7l820my`</sub></sup> | <sup><sub>`LTC:`&nbsp;`ltc1q9jnvesyffgysel7h4cttg7fscenaje2ka08qvc`</sub></sup> | <sup><sub>`ETH:`&nbsp;`0xD03c9c3027C6bBDDad31d183Ba07DA9db34ee641`</sub></sup> | <sup><sub>`ZEC:`&nbsp;`t1S9TJAa4uxtXdh8NJWJu8HKZ1MkCddp5sH`</sub></sup> | <sup><sub>`XMR:`&nbsp;`49UydqpjBjfPcYEV26jrruQwkCkW9VVFxXdmBwmarAVUPz6FSK2nLsRCdtQTMrFZ3NBy9aGrgGGhKZKCpApy5xBWA3GiBsn`</sub></sup> |

Inspired by [npm-kraken-api](https://github.com/nothingisdead/npm-kraken-api) ([_nothingisdead_](https://github.com/nothingisdead)).

## License

This project is licensed under the MIT License - see the [LICENSE](https://github.com/jpcx/node-kraken-api/blob/2.0.0/LICENSE) file for details
