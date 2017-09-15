const logger = require('simple-json-logger')
const connectMethod = require('nats-method')
const uuid = require('uuid').v4

const {ok, fail, adaptOutput} = require('./lib/output')

const connectMethodEx = function (...args) {
  const method = connectMethod(...args)
  const {define: originalDefine, call: originalCall, callAndForget: originalCallAndForget} = method

  // handler: func(data, input, subject) =>
  method.define = function (name, handler) {
    const wrapperHandler = async (msg, subject) => {
      let input
      try {
        input = JSON.parse(msg)
      }
      catch (err) {
        logger.error(err, 'input must be a JSON string', {input: msg})
        return JSON.stringify(fail('invalid-input', 'input must be a JSON string', {input: msg}))
      }

      if (!(typeof input === 'object' && input !== null && !Array.isArray(input))) {
        logger.error('input must be parsed as an object', {input: msg})
        return JSON.stringify(fail('invalid-input', 'input must be parsed as an object', {input: msg}))
      }

      const {requestId, data} = input
      let output
      try {
        output = await handler(data, input, subject)
      }
      catch (err) {
        logger.error(err, 'internal method error')
        output = fail('internal-method-error', err.toString())
      }
      output = adaptOutput(output)
      output = {requestId, ...output}
      output = JSON.stringify(output)
      return output
    }

    return originalDefine(name, wrapperHandler)
  }

  method.call = async function (name, data, options = {}) {
    const {timeout, requestId} = options
    const input = buildInput(data, requestId)
    let output = await originalCall(name, input, timeout)
    output = JSON.parse(output)
    return output
  }

  method.callAndForget = function (name, data, options = {}) {
    const {requestId} = options
    const input = buildInput(data, requestId)
    originalCallAndForget(name, input)
  }

  return method
}

module.exports = connectMethodEx

module.exports.ok = ok
module.exports.fail = fail

function buildInput (data, requestId) {
  let input = {
    requestId: requestId || uuid(),
    data
  }
  input = JSON.stringify(input)
  return input
}