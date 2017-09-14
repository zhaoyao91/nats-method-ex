# NATS Method EX

Make nats-method easier.

## Features

- Messages are delivered in JSON format.
- Default method error handler are enhanced.

## Usage

Install package:

```
npm install --save nats-method-ex
```

Import and use:

```
const connectMethod = require('nats-method')
const buildMethodEx = require('nats-method-ex')

const method = connectNats(...)
const methodEx = buildMethodEx(method)

// now you can use methodEx to define and call method

methodEx.define('test', (input) => {
  const {name, age} = input
  return {name, age}
})

const result = await methodEx.call('test', {name: 'Bob', age: 20})
console.log(result) // {name: 'Bob', age: 20}
```

## License

MIT