[![](https://github.com/jpcx/node-kraken-api/blob/2.2.2/logo.png)](#)

[![](https://img.shields.io/github/issues/jpcx/node-kraken-api)](#)
[![](https://img.shields.io/github/forks/jpcx/node-kraken-api)](#)
[![](https://img.shields.io/github/stars/jpcx/node-kraken-api)](#)
[![](https://img.shields.io/npm/dm/node-kraken-api)](#)
[![](https://img.shields.io/librariesio/dependents/npm/node-kraken-api)](#)
[![](https://img.shields.io/github/license/jpcx/node-kraken-api)](#)

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

[CHANGELOG](https://github.com/jpcx/node-kraken-api/blob/2.2.2/CHANGELOG.md) | [Synopsis](#synopsis) | [Usage](#usage) | [Code](https://github.com/jpcx/node-kraken-api/blob/2.2.2/index.ts) |
| --- | --- | --- | --- |

### MIGRATION FROM 0.4.1:

The entire project has been completely rewritten using TypeScript and many features have changed.

If you're upgrading, please review the changes and upgrade guide below.

<details>

#### Added

- Complete WS 1.8.3 functionality
- Typings
- New REST methods

#### Deprecated

- Custom response parsing (`Settings.parse`, `Settings.dataFormatter`)
  - _To ensure type consistency, it is best to leave parsing to the user._
  - _Used only for the deprecated `.call()` function._
- Method name settings (`Settings.pubMethods`, `Settings.privMethods`)
  - _Previously, settings were used to differentiate between public and private methods rather than requiring the user to specify for each call._
  - _Instead, named requests are provided to hard-code these differences._
  - _Used only for the deprecated `.call()` function._
- `.call()`
  - _Replaced by `.request()` and the named REST methods._

#### Removed

- Ratelimiting (`Settings.limiter` and `Settings.tier`)
  - _The aim of this API is to maximize clear and accurate communication with the server; ratelimiting makes assumptions about the client setup and should be left to the user._
- REST retries (`Settings.retryCt`)
  - _This was originally included due to the occasional nonce and timeout error._
    - _To reduce this possibility, increase your API key nonce window and the `.timeout` setting._
- REST syncing (`Settings.syncIntervals`)
  - _With the introduction of the WebSocket connection, REST syncing is no longer required for many data sources._
    - _For all other sources, simply use an asynchronous loop._
- Server Settings (`Settings.hostname`, `Settings.version`)
  - _These values should be constants._
- OTP value setting (`Settings.otp` and `.setOTP()`)
  - _Replaced by `Settings.genotp`_
- Direct construction using `module.exports()`
  - _Changed to class export for modern standards._

#### Changed

- Errors have changed to named classes. Please review [the synopsis](https://github.com/jpcx/node-kraken-api/blob/2.2.2/README.md#synopsis).

#### Upgrade Guide

1. Replace all calls to `.call()` with the corresponding named method or `.request()`.
    - _Make sure to view the expected response types; they have changed since 0.4.1._
2. Replace all sync instances with an async loop that requests every few seconds.
    - _If you are syncing one of the endpoints provided by WS, use that instead._
3. Ensure that your REST calls are not being made too quickly.
    - _Ratelimiting has been removed; you may encounter server errors if you were relying on the limiter._
    - _See the rate limits [documentation](https://docs.kraken.com/rest/#section/Rate-Limits)._
4. Increase your api key nonce window if you're getting invalid nonce errors.
    - _Calls may now be performed concurrently (global queueing is removed)._
5. Remove calls to `.setOTP()` and `Settings.otp`; provide `.genotp` in the settings.
6. Review the error classes; if you were parsing errors you will need to update your catch statements.
    - _Note: calls are no longer automatically retried `retryCt` times._
7. If you're constructing using module.exports (e.g. `const kraken = require('node-kraken-api')({...})`), you will need to use the `module.exports.Kraken` class instead: `import { Kraken } from "node-kraken-api"; const kraken = new Kraken({...});`

</details>

### MIGRATION FROM 1.0.0:

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

<details>

### Methods

- [`.request()`](https://github.com/jpcx/node-kraken-api/blob/2.2.2/index.ts#L201)
- [`.time()`](https://github.com/jpcx/node-kraken-api/blob/2.2.2/index.ts#L255)
- [`.systemStatus()`](https://github.com/jpcx/node-kraken-api/blob/2.2.2/index.ts#L262)
- [`.assets()`](https://github.com/jpcx/node-kraken-api/blob/2.2.2/index.ts#L269)
- [`.assetPairs()`](https://github.com/jpcx/node-kraken-api/blob/2.2.2/index.ts#L291)
- [`.ticker()`](https://github.com/jpcx/node-kraken-api/blob/2.2.2/index.ts#L317)
- [`.ohlc()`](https://github.com/jpcx/node-kraken-api/blob/2.2.2/index.ts#L334)
- [`.depth()`](https://github.com/jpcx/node-kraken-api/blob/2.2.2/index.ts#L362)
- [`.trades()`](https://github.com/jpcx/node-kraken-api/blob/2.2.2/index.ts#L385)
- [`.spread()`](https://github.com/jpcx/node-kraken-api/blob/2.2.2/index.ts#L407)
- [`.getWebSocketsToken()`](https://github.com/jpcx/node-kraken-api/blob/2.2.2/index.ts#L430)
- [`.balance()`](https://github.com/jpcx/node-kraken-api/blob/2.2.2/index.ts#L437)
- [`.tradeBalance()`](https://github.com/jpcx/node-kraken-api/blob/2.2.2/index.ts#L444)
- [`.openOrders()`](https://github.com/jpcx/node-kraken-api/blob/2.2.2/index.ts#L461)
- [`.closedOrders()`](https://github.com/jpcx/node-kraken-api/blob/2.2.2/index.ts#L482)
- [`.queryOrders()`](https://github.com/jpcx/node-kraken-api/blob/2.2.2/index.ts#L519)
- [`.tradesHistory()`](https://github.com/jpcx/node-kraken-api/blob/2.2.2/index.ts#L544)
- [`.queryTrades()`](https://github.com/jpcx/node-kraken-api/blob/2.2.2/index.ts#L577)
- [`.openPositions()`](https://github.com/jpcx/node-kraken-api/blob/2.2.2/index.ts#L597)
- [`.ledgers()`](https://github.com/jpcx/node-kraken-api/blob/2.2.2/index.ts#L621)
- [`.queryLedgers()`](https://github.com/jpcx/node-kraken-api/blob/2.2.2/index.ts#L660)
- [`.tradeVolume()`](https://github.com/jpcx/node-kraken-api/blob/2.2.2/index.ts#L680)
- [`.addExport()`](https://github.com/jpcx/node-kraken-api/blob/2.2.2/index.ts#L700)
- [`.exportStatus()`](https://github.com/jpcx/node-kraken-api/blob/2.2.2/index.ts#L740)
- [`.retrieveExport()`](https://github.com/jpcx/node-kraken-api/blob/2.2.2/index.ts#L756)
- [`.removeExport()`](https://github.com/jpcx/node-kraken-api/blob/2.2.2/index.ts#L772)
- [`.addOrder()`](https://github.com/jpcx/node-kraken-api/blob/2.2.2/index.ts#L793)
- [`.cancelOrder()`](https://github.com/jpcx/node-kraken-api/blob/2.2.2/index.ts#L887)
- [`.cancelAll()`](https://github.com/jpcx/node-kraken-api/blob/2.2.2/index.ts#L903)
- [`.cancelAllOrdersAfter()`](https://github.com/jpcx/node-kraken-api/blob/2.2.2/index.ts#L911)
- [`.depositMethods()`](https://github.com/jpcx/node-kraken-api/blob/2.2.2/index.ts#L927)
- [`.depositAddresses()`](https://github.com/jpcx/node-kraken-api/blob/2.2.2/index.ts#L943)
- [`.depositStatus()`](https://github.com/jpcx/node-kraken-api/blob/2.2.2/index.ts#L967)
- [`.withdrawInfo()`](https://github.com/jpcx/node-kraken-api/blob/2.2.2/index.ts#L987)
- [`.withdrawStatus()`](https://github.com/jpcx/node-kraken-api/blob/2.2.2/index.ts#L1035)
- [`.withdrawCancel()`](https://github.com/jpcx/node-kraken-api/blob/2.2.2/index.ts#L1055)
- [`.walletTransfer()`](https://github.com/jpcx/node-kraken-api/blob/2.2.2/index.ts#L1075)
- [`.stake()`](https://github.com/jpcx/node-kraken-api/blob/2.2.2/index.ts#L1104)
- [`.unstake()`](https://github.com/jpcx/node-kraken-api/blob/2.2.2/index.ts#L1129)
- [`.stakingAssets()`](https://github.com/jpcx/node-kraken-api/blob/2.2.2/index.ts#L1151)
- [`.stakingPending()`](https://github.com/jpcx/node-kraken-api/blob/2.2.2/index.ts#L1160)
- [`.stakingTransactions()`](https://github.com/jpcx/node-kraken-api/blob/2.2.2/index.ts#L1169)
- [`.ws.ticker()`](https://github.com/jpcx/node-kraken-api/blob/2.2.2/index.ts#L1194)
- [`.ws.ohlc()`](https://github.com/jpcx/node-kraken-api/blob/2.2.2/index.ts#L1217)
- [`.ws.trade()`](https://github.com/jpcx/node-kraken-api/blob/2.2.2/index.ts#L1240)
- [`.ws.spread()`](https://github.com/jpcx/node-kraken-api/blob/2.2.2/index.ts#L1259)
- [`.ws.book()`](https://github.com/jpcx/node-kraken-api/blob/2.2.2/index.ts#L1278)
- [`.ws.ownTrades()`](https://github.com/jpcx/node-kraken-api/blob/2.2.2/index.ts#L1353)
- [`.ws.openOrders()`](https://github.com/jpcx/node-kraken-api/blob/2.2.2/index.ts#L1378)
- [`.ws.addOrder()`](https://github.com/jpcx/node-kraken-api/blob/2.2.2/index.ts#L1403)
- [`.ws.cancelOrder()`](https://github.com/jpcx/node-kraken-api/blob/2.2.2/index.ts#L1457)
- [`.ws.cancelAll()`](https://github.com/jpcx/node-kraken-api/blob/2.2.2/index.ts#L1473)
- [`.ws.cancelAllOrdersAfter()`](https://github.com/jpcx/node-kraken-api/blob/2.2.2/index.ts#L1493)

### Properties

- [`.ws`](https://github.com/jpcx/node-kraken-api/blob/2.2.2/index.ts#L1176)
- [`.ws.pub`](https://github.com/jpcx/node-kraken-api/blob/2.2.2/index.ts#L1180)
- [`.ws.priv`](https://github.com/jpcx/node-kraken-api/blob/2.2.2/index.ts#L1182)

### Classes

- [`Kraken`](https://github.com/jpcx/node-kraken-api/blob/2.2.2/index.ts#L122)
- [`Kraken.InternalError`](https://github.com/jpcx/node-kraken-api/blob/2.2.2/index.ts#L1516)
- [`Kraken.UnknownError`](https://github.com/jpcx/node-kraken-api/blob/2.2.2/index.ts#L1526)
- [`Kraken.ArgumentError`](https://github.com/jpcx/node-kraken-api/blob/2.2.2/index.ts#L1536)
- [`Kraken.SettingsError`](https://github.com/jpcx/node-kraken-api/blob/2.2.2/index.ts#L1550)
- [`Kraken.JSONParseError`](https://github.com/jpcx/node-kraken-api/blob/2.2.2/index.ts#L1557)
- [`Kraken.BufferParseError`](https://github.com/jpcx/node-kraken-api/blob/2.2.2/index.ts#L1567)
- [`Kraken.HTTPRequestError`](https://github.com/jpcx/node-kraken-api/blob/2.2.2/index.ts#L1577)
- [`Kraken.RESTAPIError`](https://github.com/jpcx/node-kraken-api/blob/2.2.2/index.ts#L1593)
- [`Kraken.TimeoutError`](https://github.com/jpcx/node-kraken-api/blob/2.2.2/index.ts#L1603)
- [`Kraken.WSAPIError`](https://github.com/jpcx/node-kraken-api/blob/2.2.2/index.ts#L1610)
- [`Kraken.WS.Connection`](https://github.com/jpcx/node-kraken-api/blob/2.2.2/index.ts#L4406)
- [`Kraken.WS.Subscriber`](https://github.com/jpcx/node-kraken-api/blob/2.2.2/index.ts#L4725)
- [`Kraken.WS.Subscription`](https://github.com/jpcx/node-kraken-api/blob/2.2.2/index.ts#L4914)

</details>

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
new Kraken({
  /** REST API key. */
  key?: string;
  /** REST API secret. */
  secret?: string;
  /** REST API OTP generator. */
  genotp?: () => string;
  /**
   * Nonce generator (the default is ms time with an incrementation guarantee).
   * Note: Some other APIs use a spoofed microsecond time. If you are using an
   *       API key used by one of those APIs then you will need to use a custom
   *       nonce generator (e.g. () => Date.now() * 1000). See _GENNONCE for the
   *       default generation logic.
   */
  gennonce?: () => number;
  /** Connection timeout (default 1000). */
  timeout?: number;
});
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

```
msg: node-kraken-api
btc: bc1q3asl6wjnmarx4r9qcc04gkcld9q2qaqk42dvh6
sig: J4p7GsyX/2wQLk32Zfi/AmubUzGM66I6ah+mEn8Vpqf4EpfPuWYGaLcu2J8tdcsRGMAsmavbz/SJnw7yr3c0Duw=
```

Inspired by [npm-kraken-api](https://github.com/nothingisdead/npm-kraken-api) ([_nothingisdead_](https://github.com/nothingisdead)).

## License

This project is licensed under the MIT License - see the [LICENSE](https://github.com/jpcx/node-kraken-api/blob/2.2.2/LICENSE) file for details
