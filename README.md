# node-kraken-api

[![NPM](https://nodei.co/npm/node-kraken-api.png)](https://nodei.co/npm/node-kraken-api/)

Interfaces with the Kraken cryptocurrency exchange API. Observes rate limits. Parses response JSON, converts stringed numbers, and normalizes timestamps. Facilitates persistent data syncing.

Response data may be formatted in any way based on method and options by supplying a [DataFormatter](#dataFormatter) function.

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

___Creating an auth.json file for authenticated testing:___

___NOTE:___ Replace 'nano' with your preferred editor.

___NOTE:___ Use a read-only key to be safe.

```console
nano /path/to/node_modules/node-kraken-api/auth.json
```

___Installing the jest library:___

```console
npm i --prefix /path/to/node_modules/node-kraken-api jest
```

___Running the testing scripts:___

```console
npm test --prefix /path/to/node_modules/node-kraken-api
```

### Deployment

___Loading the module:___

```js
const kraken = require('node-kraken-api')
```

___Public client instantiation:___

```js
const api = kraken()
```

___Private client instantiation (with authenticated [configuration](#configuration)):___

```js
const api = kraken({
  key: '****',
  secret: '****',
  tier: '****'
})
```

Or:

___NOTE:___ In this example, OTP is set during instantiation. This is advisable only if the two-factor password for this API key is static. Otherwise, use [api.setOTP()](#setOTP).

```js
const api = kraken({
  key: '****',
  secret: '****',
  tier: '****',
  otp: '****'
})
```

___Instantiation with any number of configuration settings (see [configuration](#configuration)):___

```js
const api = kraken(require('./config.json'))
```

Or:

```js
const api = kraken({
  key: '****',
  secret: '****',
  tier: '****',
  parse: { dates: false }
})
```

### Usage

#### Making a single call

___Using promises:___

```js
api.call('Time')
  .then(data => console.log(data))
  .catch(err => console.error(err))
```

___Using callbacks:___

```js
api.call('Time', (err, data) => {
  if (err) console.error(err)
  else console.log(data)
})
```

___Using promises (with Kraken method options):___

```js
api.call('Depth', { pair: 'XXBTZUSD', count: 1 })
  .then(data => console.log(data))
  .catch(err => console.error(err))
```

___Using callbacks (with Kraken method options):___

```js
api.call('Depth', { pair: 'XXBTZUSD', count: 1 },
  (err, data) => {
    if (err) console.error(err)
    else console.log(data)
  }
)
```

<a name='setOTP'></a>

___Using a one-time password (if enabled):___

___NOTE:___ Due to call queueing functionality and rate limiting, OTP may need to be set again if the call has not been executed before the password decays. This shouldn't be a problem unless there have been a very large volume of calls sent to the queue.

Additionally, depending on settings.retryCt, calls with errors will be re-queued.

As such, it is best to continuously call setOTP with each new password until an error or response has been received.

```js
api.setOTP(158133)

api.call('AddOrder', {
  pair: 'XXBTZUSD',
  type: 'buy',
  price: 5000,
  volume: 1
}).then(console.log).catch(console.log)
```

<a name='dataFormatter'></a>

#### Custom formatting of response data

Response data may be formatted in any way based on method and options by setting a [DataFormatter](https://github.com/jpcx/node-kraken-api/blob/0.4.1/docs/namespaces/Settings.md#~DataFormatter) function during instantiation.

___NOTE:___ Any data returned from this function will be treated as the new data, and call responses will be undefined if it does not return anything.

___NOTE:___ Data formatter is applied to data post-parsing (strings to numbers, strings to dates, etc.), if enabled.

___Adding a time formatting rule:___

```js
const dataFormatter = (method, options, data) => {
  if (method === 'Time') {
    return data.unixtime
  } else {
    return data
  }
}

// instantiating with dataFormatter property in settings
const api = require('node-kraken-api')({ dataFormatter })

// logs 1529980568000
api.call('Time').then(
  x => console.log(x)
)
```

<a name='syncing'></a>

#### Working with data syncing

___Creating a sync object:___

```js
const timeSync = api.sync('Time')

// logs {}
console.log(timeSync.data)

// logs { unixtime: 1528607559000, rfc1123: 1528607559000 }
setTimeout(() => console.log(timeSync.data), 5000)
```

___Creating a sync object with a custom update interval:___

```js
// updates every 5 seconds
const timeSync = api.sync('Time', 5000)

// logs {}
console.log(timeSync.data)

// logs { unixtime: 1528607559000, rfc1123: 1528607559000 }
setTimeout(() => console.log(timeSync.data), 10000)
```

___Using syncing promises:___

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

___Creating a sync object (using a listener callback):___

```js
const timeSync = api.sync('Time',
  (err, data) => {
    if (err) console.error(err)
    else if (data) console.log(data)
  }
)
```

___Adding a listener callback after creation:___

```js
const timeSync = api.sync('Time')
timeSync.addListener((err, data) => {
  if (err) console.error(err)
  else if (data) console.log(data)
})
```

___Adding a once listener via Promises:___

```js
const timeSync = api.sync('Time')
timeSync.once()
  .then(data => console.log(data))
  .catch(err => console.error(err))
```

___Adding a once listener callback:___

```js
const timeSync = api.sync('Time')
timeSync.once((err, data) => {
  if (err) console.error(err)
  else if (data) console.log(data)
})
```

___Closing a sync operation:___

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

___Re-opening a sync operation:___

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

___Removing a sync listener callback:___

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

<a name='syncUpdates'></a>

#### Updating Instance Options

Using a listener within a sync instance may be used for tracking new data only.
For example, methods such as 'Trades' or 'OHLC' respond with a 'last' property to allow for querying new updates.

___Logging new trades only:___

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

<a name='syncInstanceMods'></a>

#### Custom Handling of Sync Data

Sync object data may be custom tailored for various use cases by using an event listener. Event listeners are provided with a reference to the instance, so they can be defined to transform received data in any way and store it within a custom property.

___Creating a realtime historical trades tracker:___

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
          data.XXBTZUSD.forEach(
            trade => instance.hist.push(trade)
          )
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

___Creating a realtime simple moving average (with safe float operations):___

___NOTE:___ OHLC calls are set to a 60s sync interval by default. This may be changed either in the settings configuration, during instance creation, or by changing the instance's `interval` property.

```js
const twentyPeriodSMA = api.sync(
  'OHLC',
  { pair: 'XXBTZUSD' },
  (err, data, instance) => {
    if (data) {
      if (!instance.bars) instance.bars = []
      if (data.last !== instance.options.since) {
        if (data.XXBTZUSD.forEach) {
          data.XXBTZUSD.forEach(
            bar => instance.bars.push(bar)
          )
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

During creation of the API instance, a configuration object may be provided for authenticated calls and other options.

Configuration specifications are detailed in the documentation [here](https://github.com/jpcx/node-kraken-api/blob/0.4.1/docs/namespaces/Settings.md#~Config)

Additionally, various settings may be modified during runtime by using the following functions:

```js
api.setOTP('new2fa')
// or
api.setOTP(232385)

api.setTimeout(10000)

api.setRetryCt(6)

api.setLimiter({ baseIntvl: 1000, minIntvl: 800 })
// or
api.setLimiter({ minIntvl: 500 })
```

## Documentation

Please browse the [Kraken API docs](https://www.kraken.com/help/api#public-market-data) for information pertaining to call types and options.

Method names are found within the 'URL' subtitle in the Kraken API docs. For example: 'Get server time', lists the URL as <https://api.kraken.com/0/public/Time>, which means that the method name is 'Time'.

Alternatively, refer to the [default settings](https://github.com/jpcx/node-kraken-api/blob/0.4.1/docs/namespaces/Settings.md#~Config) in the node-kraken-api documentation. Default method types are listed here (under the 'pubMethods' and 'privMethods' properties).

Method options are found under the 'Input:' section. For example, 'Get order book' lists the following:

```js
pair = asset pair to get market depth for
count = maximum number of asks/bids (optional)
```

This translates to an object such as `{ pair: 'XXBTZUSD', count: 10 }`, which should be used when passing method options to API calls.

You may learn more about the types of options and response data by probing the API. Use the methods 'Assets' and 'AssetPairs' to discover the naming scheme for the assets tradable via Kraken.

### Internal

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

## Versioning

Versioned using [SemVer](http://semver.org/). For available versions, see the [Changelog](https://github.com/jpcx/node-kraken-api/blob/0.4.1/CHANGELOG.md).

## Contribution

Please raise an issue if you find any. Pull requests are welcome!

## Author

**Justin Collier** - [jpcx](https://github.com/jpcx)

![bitcoin](http://i65.tinypic.com/34pkrib.jpg)

`bitcoin:bc1qla9wynkvmnmcnygls5snqeu3rj5dxr7tunwzp6`
  
Created using [npm-kraken-api](https://github.com/nothingisdead/npm-kraken-api) ([_nothingisdead_](https://github.com/nothingisdead)) for reference.

## License

This project is licensed under the MIT License - see the [LICENSE](https://github.com/jpcx/node-kraken-api/blob/0.4.1/LICENSE) file for details