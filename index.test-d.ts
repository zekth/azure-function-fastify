import fastify from 'fastify';
import azureFunctionFastify, { PromiseHandler, CallbackHandler } from '.';

import { expectType, expectError, expectAssignable } from 'tsd';

const app = fastify();

expectType<PromiseHandler>(azureFunctionFastify(app));
expectType<PromiseHandler>(azureFunctionFastify(app, {}));
expectType<PromiseHandler>(azureFunctionFastify(app, { binaryMimeTypes: [] }));
expectType<PromiseHandler>(
  azureFunctionFastify(app, { binaryMimeTypes: ['foo'] })
);
expectType<CallbackHandler>(
  azureFunctionFastify(app, { binaryMimeTypes: ['foo'] }, () => {})
);

expectError(azureFunctionFastify(app, { binaryMimeTypes: [2] }));
expectError(azureFunctionFastify());
expectError(azureFunctionFastify(app, { neh: 'definition' }));
