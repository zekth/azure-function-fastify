const fastify = require('fastify')
const azureFunctionFastify = require('../../index')

const app = fastify({ logger: false, disableRequestLogging: true })

app.get('/api/example', async (request, reply) => {
  request.log.info('req Setting the cookie')
  request.log.info('spread', 'operator')
  request.log.info({ obj: 'spread', foo: 'operator' })
  reply.log.info('Response log')
  reply.header('Set-Cookie', 'i=love; path=/')
  return reply.send({ test: 'get example' })
})
app.post('/api/example', async (request, reply) => {
  return reply.send({ test: 'post example', ...request.body })
})
const handler = azureFunctionFastify(app, { logs: true })
module.exports = handler
