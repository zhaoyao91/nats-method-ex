const logger = require('simple-json-logger')

module.exports = function (natsMethod) {
  return {
    define (name, handler) {
      natsMethod.define(name, handleError(processInput(handler)))
    },

    async call (name, input, timeout) {
      input = stringifyJSON(input)
      let output = await natsMethod.call(name, input, timeout)
      output = parseJSON(output)
      return output
    }
  }
}

function processInput (handler) {
  return async (input, subject) => {
    input = parseJSON(input)
    let output = await handler(input, subject)
    output = stringifyJSON(output)
    return output
  }
}

function handleError (handler) {
  return async (message, subject) => {
    try {
      return await handler(message, subject)
    }
    catch (err) {
      logger.error(err, 'internal method error', {message, subject})
      return JSON.stringify({ok: false, error: 'internal-method-error'})
    }
  }
}

function stringifyJSON (string) {
  // JSON.stringify will return undefined if string is undefined
  return JSON.stringify(string)
}

function parseJSON (json) {
  if (json === undefined || json === '') return undefined
  else return JSON.parse(json)
}

