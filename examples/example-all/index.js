const fastify = require('fastify')
const azureFunctionFastify = require('../../index')
const fs = require('fs')
const path = require('path')

const app = fastify()

app.get('/api/example-all', async (request, reply) => {
  return reply.send({ test: 'get example-all' })
})
app.get('/api/example-all/img', async (request, reply) => {
  return fs.promises
    .readFile(path.join(__dirname, 'img.jpg'))
    .then((imgBuffer) => {
      return reply.type('image/jpeg').status(200).send(imgBuffer)
    })
})
app.post('/api/example-all', async (request, reply) => {
  return reply.send({ test: 'post example-all', ...request.body })
})
app.get('/api/example-all/error', async (request, reply) => {
  throw new Error('ERROR')
})

const handler = azureFunctionFastify(app, { binaryMimeTypes: ['image/jpeg'] })
module.exports = handler
