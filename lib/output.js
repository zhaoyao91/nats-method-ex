const mod = {
  ok (data) {
    return new Output({
      ok: true,
      data,
    })
  },

  fail (error, message, details) {
    return new Output({
      ok: false,
      error,
      message,
      details
    })
  },

  adaptOutput (output) {
    if (!(output instanceof Output)) output = mod.ok(output)
    return output
  }
}

class Output {
  constructor (fields) {
    Object.assign(this, fields)
  }
}

module.exports = mod