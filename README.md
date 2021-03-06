# Azure Function Fastify

Inspired by the AWSLABS [aws-serverless-express](https://github.com/awslabs/aws-serverless-express) library tailor made for the [Fastify](https://www.fastify.io/) web framework.

**No use of internal sockets, makes use of Fastify's [inject](https://www.fastify.io/docs/latest/Testing/#testing-with-http-injection) function.**

## Usage

```js
const fastify = require('fastify');
const azureFunctionFastify = require('azure-function-fastify');

const app = fastify();
const opts = {
  binaryMimeTypes: ['image/jpg', 'image/png'],
};
const promiseHandler = azureFunctionFastify(app, opts);
const callbackHandler = azureFunctionFastify(app, opts, () => {
  console.log("I'm the callback");
});
```

### Options

| property        | description                                                                     | default value |
| --------------- | ------------------------------------------------------------------------------- | ------------- |
| binaryMimeTypes | Mime types to handle as Binary. Other mime types will be parsed as String Utf-8 | []            |

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
    if (err) console.error(err);
  });
}
module.exports = handler;
```

## Notes

- Stateless only
- Currently there is no proper way to log through the functions (as `context.log` is not available in the fasitfy app)
