const logger = require('simple-json-logger')

module.exports = function (natsMethod) {
  return {
    define (name, handler) {
      natsMethod.define(name, handleError(processInput(handler)))
    },

    async call (name, input, timeout) {
      const output = await natsMethod.call(name, input === undefined ? undefined : JSON.stringify(input), timeout)
      return !!output ? JSON.parse(output) : undefined
    }
  }
}

function processInput (handler) {
  return async (input, subject) => {
    input = !!input ? JSON.parse(input) : undefined
    const output = await handler(input, subject)
    return output === undefined ? undefined : JSON.stringify(output)
  }
}

function handleError (handler) {
  return async (message, subject) => {
    try {
      return await handler(message, subject)
    }
    catch (err) {
      logger.error(err, 'internal method error', {message, subject})
      return JSON.stringify({ok: false, error: 'internal method error'})
    }
  }
}