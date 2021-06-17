# Azure Function Fastify

Inspired by the AWSLABS [aws-serverless-express](https://github.com/awslabs/aws-serverless-express) library tailor made for the [Fastify](https://www.fastify.io/) web framework.

**No use of internal sockets, makes use of Fastify's [inject](https://www.fastify.io/docs/latest/Testing/#testing-with-http-injection) function.**

## Options

| property        | description                    | default value |
| --------------- | ------------------------------ | ------------- |
| binaryMimeTypes | Mime types to handle as Binary | []            |

## Example

```js
const fastify = require('fastify');
const azureFunctionFastify = require('azure-function-fastify');

const app = fastify();
app.get('/example', async (request, reply) => {
  return reply.send({ test: 'get example' });
});
app.post('/example', async (request, reply) => {
  return reply.send({ test: 'post example', ...request.body });
});
const handler = azureFunctionFastify(app);
if (require.main === module) {
  // called directly i.e. "node app"
  app.listen(3000, (err) => {
    if (err) console.error(err)
  })
}
module.exports = handler;
```

## Notes
