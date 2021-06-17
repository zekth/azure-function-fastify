import fastify from 'fastify';
import azureFunctionFastify, { AzureFunctionImpl } from '.';

import { expectType, expectError, expectAssignable } from 'tsd';

const app = fastify();

expectType<AzureFunctionImpl>(azureFunctionFastify(app));
expectType<AzureFunctionImpl>(azureFunctionFastify(app, {}));
expectType<AzureFunctionImpl>(
  azureFunctionFastify(app, { binaryMimeTypes: [] })
);
expectType<AzureFunctionImpl>(
  azureFunctionFastify(app, { binaryMimeTypes: ['foo'] })
);

expectError(azureFunctionFastify(app, { binaryMimeTypes: [2] }));
expectError(azureFunctionFastify());
expectError(azureFunctionFastify(app, { neh: 'definition' }));
