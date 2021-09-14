# node-kraken-api

[![NPM](https://nodei.co/npm/node-kraken-api.png)](https://nodei.co/npm/node-kraken-api/)

## About

node-kraken-api is a typed REST/WS Node.JS client for the Kraken cryptocurrency exchange.  
This is an unofficial API. Please refer to the official documentation for up-to-date information.

REST API Docs: [kraken.com/features/api](https://www.kraken.com/features/api)  
WebSocket API Docs: [docs.kraken.com/websockets](https://docs.kraken.com/websockets/)

### Features

- Fully typed REST and WS responses and options.
  - REST methods/comments are generated from the official OpenAPI specifications file.
  - WS methods/comments are copied from the official WebSockets 1.8.3 documentation.
  - Note:
    - All named response properties are optional and nullable unless explicitly marked required in the documentation.
- `RetrieveExport` (binary endpoint); see the [example](#RetrieveExport).
- Full WS orderbook mirroring and checksum validation.

### MIGRATION NOTICE 0.4.1 -> 1.0.0 [BREAKING]:

The entire project has been completely rewritten using TypeScript and many features have changed.

#### Added

- Complete WS 1.8.3 functionality
- Typings
- New REST methods

#### Removed

- Custom response parsing
- Ratelimiting
- REST syncing
- Method name settings
- Direct construction using `module.exports()`

#### Changed

- `.call()`: renamed to `.request()`.
- `.setOTP()`: removed; OTP is now provided using a user-supplied generator.

## Synopsis

### Methods

- [`.request()`](https://github.com/jpcx/node-kraken-api/blob/develop/index.ts#L177)
- [`.time()`](https://github.com/jpcx/node-kraken-api/blob/develop/index.ts#L193)
- [`.systemStatus()`](https://github.com/jpcx/node-kraken-api/blob/develop/index.ts#L200)
- [`.assets()`](https://github.com/jpcx/node-kraken-api/blob/develop/index.ts#L207)
- [`.assetPairs()`](https://github.com/jpcx/node-kraken-api/blob/develop/index.ts#L229)
- [`.ticker()`](https://github.com/jpcx/node-kraken-api/blob/develop/index.ts#L255)
- [`.ohlc()`](https://github.com/jpcx/node-kraken-api/blob/develop/index.ts#L272)
- [`.depth()`](https://github.com/jpcx/node-kraken-api/blob/develop/index.ts#L300)
- [`.trades()`](https://github.com/jpcx/node-kraken-api/blob/develop/index.ts#L323)
- [`.spread()`](https://github.com/jpcx/node-kraken-api/blob/develop/index.ts#L345)
- [`.getWebSocketsToken()`](https://github.com/jpcx/node-kraken-api/blob/develop/index.ts#L368)
- [`.balance()`](https://github.com/jpcx/node-kraken-api/blob/develop/index.ts#L375)
- [`.tradeBalance()`](https://github.com/jpcx/node-kraken-api/blob/develop/index.ts#L382)
- [`.openOrders()`](https://github.com/jpcx/node-kraken-api/blob/develop/index.ts#L399)
- [`.closedOrders()`](https://github.com/jpcx/node-kraken-api/blob/develop/index.ts#L420)
- [`.queryOrders()`](https://github.com/jpcx/node-kraken-api/blob/develop/index.ts#L457)
- [`.tradesHistory()`](https://github.com/jpcx/node-kraken-api/blob/develop/index.ts#L482)
- [`.queryTrades()`](https://github.com/jpcx/node-kraken-api/blob/develop/index.ts#L515)
- [`.openPositions()`](https://github.com/jpcx/node-kraken-api/blob/develop/index.ts#L535)
- [`.ledgers()`](https://github.com/jpcx/node-kraken-api/blob/develop/index.ts#L559)
- [`.queryLedgers()`](https://github.com/jpcx/node-kraken-api/blob/develop/index.ts#L598)
- [`.tradeVolume()`](https://github.com/jpcx/node-kraken-api/blob/develop/index.ts#L618)
- [`.addExport()`](https://github.com/jpcx/node-kraken-api/blob/develop/index.ts#L638)
- [`.exportStatus()`](https://github.com/jpcx/node-kraken-api/blob/develop/index.ts#L678)
- [`.retrieveExport()`](https://github.com/jpcx/node-kraken-api/blob/develop/index.ts#L694)
- [`.removeExport()`](https://github.com/jpcx/node-kraken-api/blob/develop/index.ts#L710)
- [`.addOrder()`](https://github.com/jpcx/node-kraken-api/blob/develop/index.ts#L731)
- [`.cancelOrder()`](https://github.com/jpcx/node-kraken-api/blob/develop/index.ts#L825)
- [`.cancelAll()`](https://github.com/jpcx/node-kraken-api/blob/develop/index.ts#L841)
- [`.cancelAllOrdersAfter()`](https://github.com/jpcx/node-kraken-api/blob/develop/index.ts#L849)
- [`.depositMethods()`](https://github.com/jpcx/node-kraken-api/blob/develop/index.ts#L865)
- [`.depositAddresses()`](https://github.com/jpcx/node-kraken-api/blob/develop/index.ts#L881)
- [`.depositStatus()`](https://github.com/jpcx/node-kraken-api/blob/develop/index.ts#L905)
- [`.withdrawInfo()`](https://github.com/jpcx/node-kraken-api/blob/develop/index.ts#L925)
- [`.withdrawStatus()`](https://github.com/jpcx/node-kraken-api/blob/develop/index.ts#L973)
- [`.withdrawCancel()`](https://github.com/jpcx/node-kraken-api/blob/develop/index.ts#L993)
- [`.walletTransfer()`](https://github.com/jpcx/node-kraken-api/blob/develop/index.ts#L1013)
- [`.stake()`](https://github.com/jpcx/node-kraken-api/blob/develop/index.ts#L1042)
- [`.unstake()`](https://github.com/jpcx/node-kraken-api/blob/develop/index.ts#L1067)
- [`.stakingAssets()`](https://github.com/jpcx/node-kraken-api/blob/develop/index.ts#L1089)
- [`.stakingPending()`](https://github.com/jpcx/node-kraken-api/blob/develop/index.ts#L1098)
- [`.stakingTransactions()`](https://github.com/jpcx/node-kraken-api/blob/develop/index.ts#L1107)
- [`.ws.ticker()`](https://github.com/jpcx/node-kraken-api/blob/develop/index.ts#L1132)
- [`.ws.ohlc()`](https://github.com/jpcx/node-kraken-api/blob/develop/index.ts#L1155)
- [`.ws.trade()`](https://github.com/jpcx/node-kraken-api/blob/develop/index.ts#L1178)
- [`.ws.spread()`](https://github.com/jpcx/node-kraken-api/blob/develop/index.ts#L1197)
- [`.ws.book()`](https://github.com/jpcx/node-kraken-api/blob/develop/index.ts#L1216)
- [`.ws.ownTrades()`](https://github.com/jpcx/node-kraken-api/blob/develop/index.ts#L1291)
- [`.ws.openOrders()`](https://github.com/jpcx/node-kraken-api/blob/develop/index.ts#L1316)
- [`.ws.addOrder()`](https://github.com/jpcx/node-kraken-api/blob/develop/index.ts#L1341)
- [`.ws.cancelOrder()`](https://github.com/jpcx/node-kraken-api/blob/develop/index.ts#L1395)
- [`.ws.cancelAll()`](https://github.com/jpcx/node-kraken-api/blob/develop/index.ts#L1411)
- [`.ws.cancelAllOrdersAfter()`](https://github.com/jpcx/node-kraken-api/blob/develop/index.ts#L1431)

### Properties

- [`.ws`](https://github.com/jpcx/node-kraken-api/blob/develop/index.ts#L1114)
- [`.ws.pub`](https://github.com/jpcx/node-kraken-api/blob/develop/index.ts#L1118)
- [`.ws.priv`](https://github.com/jpcx/node-kraken-api/blob/develop/index.ts#L1120)

### Classes

- [`Kraken`](https://github.com/jpcx/node-kraken-api/blob/develop/index.ts#L121)
- [`Kraken.InternalError`](https://github.com/jpcx/node-kraken-api/blob/develop/index.ts#L1454)
- [`Kraken.UnknownError`](https://github.com/jpcx/node-kraken-api/blob/develop/index.ts#L1461)
- [`Kraken.ArgumentError`](https://github.com/jpcx/node-kraken-api/blob/develop/index.ts#L1471)
- [`Kraken.SettingsError`](https://github.com/jpcx/node-kraken-api/blob/develop/index.ts#L1478)
- [`Kraken.JSONParseError`](https://github.com/jpcx/node-kraken-api/blob/develop/index.ts#L1485)
- [`Kraken.BufferParseError`](https://github.com/jpcx/node-kraken-api/blob/develop/index.ts#L1495)
- [`Kraken.HTTPRequestError`](https://github.com/jpcx/node-kraken-api/blob/develop/index.ts#L1505)
- [`Kraken.RESTAPIError`](https://github.com/jpcx/node-kraken-api/blob/develop/index.ts#L1521)
- [`Kraken.TimeoutError`](https://github.com/jpcx/node-kraken-api/blob/develop/index.ts#L1531)
- [`Kraken.WSAPIError`](https://github.com/jpcx/node-kraken-api/blob/develop/index.ts#L1538)
- [`Kraken.Emitter`](https://github.com/jpcx/node-kraken-api/blob/develop/index.ts#L1618)
- [`Kraken.WS.Connection`](https://github.com/jpcx/node-kraken-api/blob/develop/index.ts#L4658)
- [`Kraken.WS.Subscriber`](https://github.com/jpcx/node-kraken-api/blob/develop/index.ts#L4950)
- [`Kraken.WS.Subscription`](https://github.com/jpcx/node-kraken-api/blob/develop/index.ts#L5112)

## Usage

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

Testing is performed by `@jpcx/testts`.

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

![BTC](https://github.com/jpcx/node-kraken-api/blob/develop/assets/btc.png)&emsp;
![LTC](https://github.com/jpcx/node-kraken-api/blob/develop/assets/ltc.png)&emsp;
![ETH](https://github.com/jpcx/node-kraken-api/blob/develop/assets/eth.png)&emsp;
![XMR](https://github.com/jpcx/node-kraken-api/blob/develop/assets/xmr.png)

```
 bitcoin:bc1qnkturlnv4yufkc40k4ysxz4maak5mug7l820my
litecoin:ltc1q9jnvesyffgysel7h4cttg7fscenaje2ka08qvc
ethereum:0xD03c9c3027C6bBDDad31d183Ba07DA9db34ee641
  monero:49UydqpjBjfPcYEV26jrruQwkCkW9VVFxXdmBwmarAVUPz6FSK2nLsRCdtQTMrFZ3NBy9aGrgGGhKZKCpApy5xBWA3GiBsn
```

Inspired by [npm-kraken-api](https://github.com/nothingisdead/npm-kraken-api) ([_nothingisdead_](https://github.com/nothingisdead)).

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details
