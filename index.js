module.exports = (app, options) => {
  options = options || {}
  const binaryMimes = options.binaryMimeTypes || []
  const handler = (context) => {
    const method = context.req.method
    const url = context.req.originalUrl
    const query = context.req.query
    const headers = context.req.headers
    const payload = context.req.body
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
        resolve(context)
      })
    })
    return prom
  }
  return handler
}
