'use strict'

const contextCache = {}
const HEADER_INVOKE = 'x-az-fastify-id'

function _loggerFactory (invocationId) {
  const _invocation = invocationId
  function handleLog (verb, o, ...n) {
    if (contextCache[_invocation]) {
      console.log(_invocation)
      contextCache[_invocation].log[verb](o, ...n)
    }
  }
  const lInstance = {
    info: function (o, ...n) {
      handleLog('info', o, ...n)
    },
    warn: function (o, ...n) {
      handleLog('warn', o, ...n)
    },
    error: function (o, ...n) {
      handleLog('error', o, ...n)
    },
    fatal: function (o, ...n) {
      handleLog('error', o, ...n)
    },
    trace: function (o, ...n) {
      handleLog('verbose', o, ...n)
    },
    debug: function (o, ...n) {
      handleLog('verbose', o, ...n)
    },
    child: function (args) {
      const child = _loggerFactory(_invocation)
      return child
    }
  }
  return lInstance
}

function hooks (app) {
  app.addHook('onRequest', (req, res, done) => {
    const invocationId = req.headers[HEADER_INVOKE]
    if (invocationId) {
      req.log = _loggerFactory(invocationId)
      res.log = _loggerFactory(invocationId)
      res.header(HEADER_INVOKE, invocationId)
    }
    done()
  })
  app.addHook('onResponse', (req, res, done) => {
    const id = res.getHeader(HEADER_INVOKE)
    if (id) {
      res.removeHeader(HEADER_INVOKE)
      delete contextCache[id]
    }
    done()
  })
  app.addHook('onTimeout', (req, res, done) => {
    const id = res.getHeader(HEADER_INVOKE)
    if (id) {
      res.removeHeader(HEADER_INVOKE)
      delete contextCache[id]
    }
    done()
  })
}

const wrapper = (app, options, callback) => {
  options = options || {}
  const binaryMimes = options.binaryMimeTypes || []
  const activateLogging = options.logs || false
  if (activateLogging) {
    hooks(app)
  }

  const handler = (context) => {
    const method = context.req.method
    const url = context.req.originalUrl
    const query = context.req.query
    const headers = context.req.headers
    const payload = context.req.body
    if (activateLogging) {
      headers[HEADER_INVOKE] = context.invocationId
      contextCache[context.invocationId] = context
    }
    const prom = new Promise((resolve) => {
      app.inject({ method, url, query, payload, headers }, (err, res) => {
        if (err) {
          context.log.error(err)
          context.res = {
            status: 500,
            body: '',
            isRaw: true,
            headers: {}
          }
        } else {
          let payload
          if (binaryMimes.includes(res.headers['content-type'])) {
            payload = res.rawPayload
          } else {
            payload = res.payload
          }
          context.res = {
            status: res.statusCode,
            body: payload,
            headers: res.headers,
            isRaw: true,
            cookies: res.cookies
          }
          // This header has to be deleted otherwise we
          // end up having double `set-cookie` for each one
          delete context.res.headers['set-cookie']
        }
        context.done()
        delete contextCache[context.invocationId]
        resolve(context)
      })
    })
    if (!callback) return prom
    prom.then((_ctx) => callback(null, _ctx)).catch(callback)
  }
  return handler
}
module.exports = wrapper
module.exports.default = wrapper
module.exports.azureFunctionFastify = wrapper
