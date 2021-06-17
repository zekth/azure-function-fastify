const fastify = require('fastify')
const azureFunctionFastify = require('../../index')

const app = fastify()
app.get('/api/example', async (request, reply) => {
  console.log('set')
  reply.header('Set-Cookie', 'i=love; path=/')
  return reply.send({ test: 'get example' })
})
app.post('/api/example', async (request, reply) => {
  return reply.send({ test: 'post example', ...request.body })
})
const handler = azureFunctionFastify(app)
module.exports = handler
