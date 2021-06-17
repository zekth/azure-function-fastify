# Azure Function Fastify examples

Examples of use of the wrapper, using httpTrigger with and without segments. See [documentation](https://docs.microsoft.com/en-US/azure/azure-functions/functions-bindings-http-webhook-trigger?tabs=csharp#customize-the-http-endpoint)

## Prerequisites

- [azure-functions-core-tools](https://www.npmjs.com/package/azure-functions-core-tools)

## Run the example

```
npm start
```

In here 2 functions are launched through Azure Core Tools `example` and `example-all`. `example-all` uses segments to capture all the urls.
