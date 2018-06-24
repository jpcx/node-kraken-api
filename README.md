# node-kraken-api

[![NPM](https://nodei.co/npm/node-kraken-api.png)](https://nodei.co/npm/node-kraken-api/)

Interfaces with the Kraken cryptocurrency exchange API. Observes rate limits. Parses response JSON, converts stringed numbers, and normalizes timestamps. Facilitates persistent data syncing.

Use of the [syncing feature](#syncing) is advisable when concurrent realtime data is required. For public calls, data is repeatedly requested upon receipt of data; rate is limited automatically. For private calls, rate is managed (according to the rate limit specificiations listed in the [Kraken API docs](https://www.kraken.com/help/api#api-call-rate-limit)) such that calls may be performed continuously without triggering any rate limit violations.

Syncing is also useful for querying new updates only by modifying the call options upon each response. This can be done within a listener callback provided to the module. Some methods provide a 'since' parameter that can be used for querying only new data. [See below](#syncUpdates) for an example.

Additionally, sync instances can be used to store other kinds of data. [See below](#syncInstanceMods) for an example.

## Getting Started

### Prerequisites

Node.JS version 8.7.0 or above.

### Installing

```console
npm i node-kraken-api
```

### Testing

The following command will test the package for errors (using the jest library). Testing may take a few minutes to complete.

___Note:___ In order for authenticated testing to occur, a valid auth.json file must be available in the root directory of the package. Please see the [configuration](#configuration) instructions below.

__Creating an auth.json file for authenticated testing:__

_NOTE: replace 'nano' with your preferred editor_
_NOTE: use a read-only key to be safe_
```console
nano /path/to/node_modules/node-kraken-api/auth.json
```

__Installing the jest library:__
```console
npm i --prefix /path/to/node_modules/node-kraken-api jest
```

__Running the testing scripts:__

```console
npm test --prefix /path/to/node_modules/node-kraken-api
```

### Deployment

__Loading the module:__
```js
const kraken = require('node-kraken-api')
```

__Public client instantiation:__
```js
const api = kraken()
```

__Private client instantiation (with authenticated [configuration](#configuration)):__
```js
const api = kraken(require('./auth.json'))
```

Or:

```js
const api = kraken({ key: '****', secret: '****', tier: '****' })
```

__Instantiation with any number of configuration settings (see [configuration](#configuration)):__
```js
const api = kraken(require('./config.json'))
```

Or:

```js
const api = kraken(require('./config.js'))
```

Or:

```js
const api = kraken({ key: '****', secret: '****', tier: '****', parse: { dates: false } })
```

### Usage

__Making a single call:__

_Using promises:_
```js
api.call('Time')
  .then(data => console.log(data))
  .catch(err => console.error(err))
```

_Using callbacks:_
```js
api.call('Time', (err, data) => {
  if (err) console.error(err)
  else console.log(data)
})
```

_Using promises (with Kraken method options):_
```js
api.call('Depth', { pair: 'XXBTZUSD', count: 1 })
  .then(data => console.log(data))
  .catch(err => console.error(err))
```

_Using callbacks (with Kraken method options):_
```js
api.call('Depth', { pair: 'XXBTZUSD', count: 1 },
  (err, data) => {
    if (err) console.error(err)
    else console.log(data)
  }
)
```

<a name='syncing'></a>
__Working with data syncing:__

_Creating a sync object:_
```js
const timeSync = api.sync('Time')

// logs {}
console.log(timeSync.data)

// logs { unixtime: 1528607559000, rfc1123: 1528607559000 }
setTimeout(() => console.log(timeSync.data), 5000)
```

_Creating a sync object with a custom update interval:_
```js
// updates every second
const timeSync = api.sync('Time', 1000)

// logs {}
console.log(timeSync.data)

// logs { unixtime: 1528607559000, rfc1123: 1528607559000 }
setTimeout(() => console.log(timeSync.data), 5000)
```

_Using syncing promises:_
```js
const api = require('./')()
const timeSync = api.sync('Time')

let i = 0
const logUpdates = async () => {
  while(i++ < 20) {
    try {
      console.log(await timeSync.once())
    } catch(e) {
      console.error(e)
    }
  }
}

logUpdates()
```

_Creating a sync object (using a listener callback):_
```js
const timeSync = api.sync('Time',
  (err, data) => {
    if (err) console.error(err)
    else if (data) console.log(data)
  }
)
```

_Adding a listener callback after creation:_
```js
const timeSync = api.sync('Time')
timeSync.addListener((err, data) => {
  if (err) console.error(err)
  else if (data) console.log(data)
})
```

_Adding a once listener via Promises:_
```js
const timeSync = api.sync('Time')
timeSync.once()
  .then(data => console.log(data))
  .catch(err => console.error(err))
```

_Adding a once listener callback:_
```js
const timeSync = api.sync('Time')
timeSync.once((err, data) => {
  if (err) console.error(err)
  else if (data) console.log(data)
})
```

_Closing a sync operation:_
```js
const timeSync = api.sync('Time')
timeSync.addListener(
  (err, data) => {
    // stops executing (and syncing) after ~5000 ms
    if (err) console.error(err)
    else if (data) console.log(data)
  }
)
setTimeout(timeSync.close, 5000)
```

_Re-opening a sync operation:_
```js
const timeSync = api.sync('Time')
timeSync.addListener(
  (err, data) => {
    // stops executing (and syncing) after ~5000 ms
    // starts executing (and syncing) again after ~10000 ms
    if (err) console.error(err)
    else if (data) console.log(data)
  }
)
setTimeout(timeSync.close, 5000)
setTimeout(timeSync.open, 10000)
```

_Removing a sync listener callback:_
```js
const timeSync = api.sync('Time')
const listener = (err, data) => {
  // stops executing after ~5000 ms
  // (timeSync will continue to stay up to date)
  if (err) console.error(err)
  else if (data) console.log(data)
}
timeSync.addListener(listener)
setTimeout(() => timeSync.removeListener(listener), 5000)
```

<a name='syncUpdates'></a>__Updating Instance Options__

Using a listener within a sync instance may be used for tracking new data only.
For example, methods such as 'Trades' or 'OHLC' respond with a 'last' property to allow for querying new updates.

_Logging new trades only:_
```js
const tradesSync = api.sync(
  'Trades',
  { pair: 'XXBTZUSD' },
  (err, data, instance) => {
    // logs only new trades
    if (err) {
      console.error(err)
    } else if (data) {
      console.log(data)
      instance.options.since = data.last
    }
  }
)
```

<a name='syncInstanceMods'></a>__Custom Handling of Sync Data__

Sync object data may be custom tailored for various use cases by using an event listener. Event listeners are provided with a reference to the instance, so they can be defined to transform received data in any way and store it within a custom property.

_Creating a realtime historical trades tracker:_
```js
const tradesHistory = api.sync(
  'Trades',
  { pair: 'XXBTZUSD' },
  (err, data, instance) => {
    if (data) {
      if (!instance.hist) {
        instance.hist = []
      }
      if (data.last !== instance.options.since) {
        if (data.XXBTZUSD.forEach) {
          data.XXBTZUSD.forEach(trade => instance.hist.push(trade))
        }
        instance.options.since = data.last
      }
    }
  }
)

tradesHistory.once()
  .then(data => console.log(tradesHistory.hist))
  .catch(err => console.error(err))
```

_Creating a realtime simple moving average (with safe float operations):_

___NOTE:___ _OHLC calls are set to a 60s sync interval by default. This may be changed either in the settings configuration, during instance creation, or by changing the instance's <code>interval</code> property._

```js
const twentyPeriodSMA = api.sync(
  'OHLC',
  { pair: 'XXBTZUSD' },
  (err, data, instance) => {
    if (data) {
      if (!instance.bars) instance.bars = []
      if (data.last !== instance.options.since) {
        if (data.XXBTZUSD.forEach) {
          data.XXBTZUSD.forEach(bar => instance.bars.push(bar))
        }
        instance.options.since = data.last
      }
      instance.bars = instance.bars.slice(-20)
      instance.value = instance.bars.reduce(
        (sum, bar) => (
          sum + (
            (
              Math.floor(bar[1] * 100) +
              Math.floor(bar[2] * 100) +
              Math.floor(bar[3] * 100) +
              Math.floor(bar[4] * 100)
            ) / 4
          )
        ),
        0
      ) / instance.bars.length / 100
    }
  }
)

twentyPeriodSMA.once()
  .then(data => console.log(twentyPeriodSMA.value))
  .catch(err => console.error(err))
```

<a name='configuration'></a>
## Configuration

During creation of the API instance, a configuration object may be provided for authenticated calls and other options. This may be provided by using <code>require('./config.json')</code> if this file has been prepared already, or by simply providing an object programmatically.

Configuration specifications are detailed in the documentation [here](https://github.com/jpcx/node-kraken-api/blob/develop/docs/namespaces/Settings.md#~Config)

## Documentation

Please browse the [Kraken API docs](https://www.kraken.com/help/api#public-market-data) for information pertaining to call types and options.

Method names are found within the 'URL' subtitle in the Kraken API docs. For example: under 'Get server time', the text 'URL: https://api.kraken.com/0/public/Time' shows that the method name is 'Time'.

Alternatively, refer to the [default settings](https://github.com/jpcx/node-kraken-api/blob/develop/docs/namespaces/Settings.md#~Config) in the node-kraken-api documentation. Default method types are listed here (under the 'pubMethods' and 'privMethods' properties).

Method options are found under the 'Input:' section. For example, 'Get order book' lists the following:

```
pair = asset pair to get market depth for
count = maximum number of asks/bids (optional)
```

This translates to an object such as <code>{ pair: 'XXBTZUSD', count: 10 }</code>, which should be used when passing method options to API calls.

You may learn more about the types of options and response data by probing the API. Use the methods 'Assets' and 'AssetPairs' to discover the naming scheme for the assets tradable via Kraken.

### Internal:
  + [node-kraken-api](https://github.com/jpcx/node-kraken-api/blob/develop/docs/modules/node-kraken-api.md)
  + [API](https://github.com/jpcx/node-kraken-api/blob/develop/docs/namespaces/API.md)
    + [Calls](https://github.com/jpcx/node-kraken-api/blob/develop/docs/namespaces/API/Calls.md)
      + [GenRequestData](https://github.com/jpcx/node-kraken-api/blob/develop/docs/modules/API/Calls/GenRequestData.md)
      + [LoadCall](https://github.com/jpcx/node-kraken-api/blob/develop/docs/modules/API/Calls/LoadCall.md)
      + [SignRequest](https://github.com/jpcx/node-kraken-api/blob/develop/docs/modules/API/Calls/SignRequest.md)
    + [RateLimits](https://github.com/jpcx/node-kraken-api/blob/develop/docs/namespaces/API/RateLimits.md)
      + [LoadLimiter](https://github.com/jpcx/node-kraken-api/blob/develop/docs/modules/API/RateLimits/LoadLimiter.md)
    + [Syncing](https://github.com/jpcx/node-kraken-api/blob/develop/docs/namespaces/API/Syncing.md)
      + [LoadSync](https://github.com/jpcx/node-kraken-api/blob/develop/docs/modules/API/Syncing/LoadSync.md)
  + [Settings](https://github.com/jpcx/node-kraken-api/blob/develop/docs/namespaces/Settings.md)
    + [ParseSettings](https://github.com/jpcx/node-kraken-api/blob/develop/docs/modules/Settings/ParseSettings.md)
  + [Tools](https://github.com/jpcx/node-kraken-api/blob/develop/docs/namespaces/Tools.md)
    + [AlphabetizeNested](https://github.com/jpcx/node-kraken-api/blob/develop/docs/modules/Tools/AlphabetizeNested.md)
    + [ParseNested](https://github.com/jpcx/node-kraken-api/blob/develop/docs/modules/Tools/ParseNested.md)
  + [Kraken](https://github.com/jpcx/node-kraken-api/blob/develop/docs/namespaces/Kraken.md)


## Versioning

Versioned using [SemVer](http://semver.org/). For available versions, see the [Changelog](https://github.com/jpcx/node-kraken-api/blob/develop/CHANGELOG.md).

## Contribution

Please raise an issue if you find any. Pull requests are welcome!

## Author

  + **Justin Collier** - [jpcx](https://github.com/jpcx)
  
Inspired by [npm-kraken-api](https://github.com/nothingisdead/npm-kraken-api) ([_nothingisdead_](https://github.com/nothingisdead)).

___BTC donation address:___

3KZw9KTCo3T5MksE7byasq3J8btmLt5BTz

![donate](http://i66.tinypic.com/fc67o0.jpg)

## License

This project is licensed under the MIT License - see the [LICENSE](https://github.com/jpcx/node-kraken-api/blob/develop/LICENSE) file for details