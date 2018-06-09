# node-kraken-api

[![NPM](https://nodei.co/npm/node-kraken-api.png)](https://nodei.co/npm/node-kraken-api/)

Interfaces with the Kraken cryptocurrency exchange API. Observes rate limits. Parses response JSON, converts stringed numbers, and normalizes timestamps. Allows for persistent call scheduling.

## Getting Started

### Prerequisites

Node.JS version 8.7.0 or above.

### Installing

```console
npm install node-kraken-api
```

### Testing

The following command will test the package for errors. Testing provided by jest library.

___Note:___ In order for authenticated testing to occur, a valid config.js file must be available in the root directory. Please see the [configuration](#configuration) instructions below. An empty config.js file has been provided; please fill the 'key', 'secret', and 'tier' properties accordingly.

```console
npm i -d // install jest library
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
const api = kraken(require('./config.js'))
```

### Usage

__Making a single call:__

_Using promises:_
```js
api.call('Time').then(
  data => console.log(data)
).catch(
  err => console.error(err)
)
```

_Using callbacks:_
```js
api.call('Time', (err, data) => {
  if (err) {
    console.error(err)
  } else {
    console.log(data)
  }
})
```

_Using promises (with Kraken method options):_
```js
api.call('Depth', { pair: 'XXBTZUSD', count: 1 }).then(
  data => console.log(data)
).catch(
  err => console.error(err)
)
```

_Using callbacks (with Kraken method options):_
```js
api.call('Depth', { pair: 'XXBTZUSD', count: 1 }, (err, data) => {
  if (err) {
    console.error(err)
  } else {
    console.log(data)
  }
})
```

__Working with persistent call scheduling:__
```js
const timeID = api.schedule.add('Time', (err, data) => {
  if (err) {
    console.error(err)
  } else {
    console.log(data)
  }
})

const depthID = api.schedule.add(
  'Depth', { pair: 'XXBTZUSD', count: 1 }, (err, data) => {
    if (err) {
      console.error(err)
    } else {
      console.log(data)
    }
  }
)

// Example schedule deletion after a given period of time
setTimeout(() => {
  api.schedule.delete(timeID)
  api.schedule.delete(depthID)
}, 10000)

```

<a name='configuration'></a>
## Configuration

During creation of the API instance, a configuration object may be provided for authenticated calls and other options. This may be provided by using <code>require('./config.js')</code> if this file has been prepared already, or by simply providing an object programmatically.

Configuration specifications are detailed in the documentation [here](https://github.com/jpcx/node-kraken-api/blob/0.1.0/docs/namespaces/Settings.md)

## Documentation

### See:
  + [node-kraken-api](https://github.com/jpcx/node-kraken-api/blob/develop/docs/modules/node-kraken-api.md)
  + [API](https://github.com/jpcx/node-kraken-api/blob/develop/docs/namespaces/API.md)
    + [Calls](https://github.com/jpcx/node-kraken-api/blob/develop/docs/namespaces/API/Calls.md)
      + [genRequestData](https://github.com/jpcx/node-kraken-api/blob/develop/docs/modules/API/Calls/genRequestData.md)
      + [loadCall](https://github.com/jpcx/node-kraken-api/blob/develop/docs/modules/API/Calls/loadCall.md)
      + [signRequest](https://github.com/jpcx/node-kraken-api/blob/develop/docs/modules/API/Calls/signRequest.md)
    + [RateLimits](https://github.com/jpcx/node-kraken-api/blob/develop/docs/namespaces/API/RateLimits.md)
      + [limiter](https://github.com/jpcx/node-kraken-api/blob/develop/docs/modules/API/RateLimits/limiter.md)
    + [Schedules](https://github.com/jpcx/node-kraken-api/blob/develop/docs/namespaces/API/Schedules.md)
      + [loadSchedule](https://github.com/jpcx/node-kraken-api/blob/develop/docs/modules/API/Schedules/loadSchedule.md)
  + [Settings](https://github.com/jpcx/node-kraken-api/blob/develop/docs/namespaces/Settings.md)
    + [defaults](https://github.com/jpcx/node-kraken-api/blob/develop/docs/modules/Settings/defaults.md)
  + [Tools](https://github.com/jpcx/node-kraken-api/blob/develop/docs/namespaces/Tools.md)
    + [ms](https://github.com/jpcx/node-kraken-api/blob/develop/docs/modules/Tools/ms.md)
    + [parseNested](https://github.com/jpcx/node-kraken-api/blob/develop/docs/modules/Tools/parseNested.md)
    + [readFileJSON](https://github.com/jpcx/node-kraken-api/blob/develop/docs/modules/Tools/readFileJSON.md)
    + [tryDirectory](https://github.com/jpcx/node-kraken-api/blob/develop/docs/modules/Tools/tryDirectory.md)
    + [writeFileJSON](https://github.com/jpcx/node-kraken-api/blob/develop/docs/modules/Tools/writeFileJSON.md)
  + [Kraken](https://github.com/jpcx/node-kraken-api/blob/develop/docs/namespaces/Kraken.md)


## Versioning

Versioned using [SemVer](http://semver.org/). For available versions, see the [Changelog](https://github.com/jpcx/node-kraken-api/blob/develop/CHANGELOG.md).

## Contribution

Please raise an issue if you find any. Pull requests are welcome!

## Author

  + **Justin Collier** - [jpcx](https://github.com/jpcx)

## License

This project is licensed under the MIT License - see the [LICENSE](https://github.com/jpcx/node-kraken-api/blob/develop/LICENSE) file for details