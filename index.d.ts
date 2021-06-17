import { FastifyInstance } from 'fastify';
import { Context } from '@azure/functions';

export interface AzFastifyOption {
  binaryMimeTypes?: string[];
}
export type AzureFunctionImpl = (context: Context) => Context;

export default function azureFunctionFastify(
  app: FastifyInstance,
  options?: AzFastifyOption
): AzureFunctionImpl;

export type { Context } from '@azure/functions';
