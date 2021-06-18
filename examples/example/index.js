const fastify = require('fastify')
const { handlerWrapper, loggerFactory } = require('../../index')

const app = fastify({ logger: loggerFactory() })

app.get('/api/example', async (request, reply) => {
  request.log.info('req Setting the cookie')
  reply.log.info('res Setting the cookie')
  reply.header('Set-Cookie', 'i=love; path=/')
  return reply.send({ test: 'get example' })
})
app.post('/api/example', async (request, reply) => {
  return reply.send({ test: 'post example', ...request.body })
})
const handler = handlerWrapper(app, { logs: true })
module.exports = handler
