# Nats Method EX

Extends nats method with enforced protocol.

## Features

- Protocol enforced
- Default error handler

## Protocol

[protocol](docs/protocol.md)

## Usage

Install package:

```
npm install nats-method-ex
```

Import an use:

```ecmascript 6
const methodEx = require('nats-method-ex')('nats://localhost:4222')
```

Basic Usage:

```ecmascript 6
methodEx.define('sum', async ({a, b}) => a + b)

const output = await methodEx.call('sum', {a: 1, b: 2})
// output: {requestId: ..., ok: true, data: 3}
```

Failed case:

```ecmascript 6
const {fail} = require('nats-method-ex')

methodEx.define('sum', async ({a, b}) => {
  if (typeof a !== 'number' || typeof b !== number) {
    return fail('invalid-args', 'a and b must be numbers', {a, b})
  }
  else return a + b
})

const output = await methodEx.call('sum', {a: '1', b: '2'})
// output: {
//   requestId: ..., 
//   ok: false,
//   error: 'invalid-args',
//   message: 'a and b must be numbers',
//   details: {a: '1', b: '2'}
// }
```

Default error handler:

```ecmascript 6
methodEx.define('error', async () => {throw new Error('Wops!')})

const output = await methodEx.call('error')
// output: {
//   requestId: ..., 
//   ok: false,
//   error: 'internal-method-error',
//   message: 'Error: Wops!'
// }
```

## API

This module is based on [nats-method](https://github.com/zhaoyao91/nats-method),
and that module is based on [node-nats](https://github.com/nats-io/node-nats).
Please check their docs for more detailed apis.

#### module.exports

> func(options) => methodEx

- `options` could be:
  - an nats url string for single server, such as `nats://localhost:4222`
  - an nats url string for cluster servers, such as `nats://192.168.0.1:4222,nats://192.168.0.2:4222`
  - [nats connect options](https://github.com/nats-io/node-nats)
  
#### methodEx.define

> `func(name, handler)`

- `handler`: async (data, input, subject) => output
  - `output` could be any data or standard Output instance built by `module.exports.ok` or `module.exports.fail`

#### methodEx.call

> `async func(name, data, options) => response`

- `options` is optional, which may contains:
  - timeout: optional
  - requestId: optional
- `response`: see [protocol response](docs/protocol.md#response)
  
#### methodEx.callAndForget

> `func(name, data, options)`

- `options` is optional, which may contains:
  - requestId: optional