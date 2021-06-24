import { FastifyInstance } from 'fastify';
import { Context } from '@azure/functions';

export interface AzFastifyOption {
  binaryMimeTypes?: string[];
  logs?: boolean;
}
export type PromiseHandler = (context: Context) => Promise<Context>;
export type CallbackHandler = (context: Context) => void;

export default function azureFunctionFastify(
  app: FastifyInstance,
  options?: AzFastifyOption
): PromiseHandler;

export default function azureFunctionFastify(
  app: FastifyInstance,
  options?: AzFastifyOption,
  callback?: (err?: Error, result?: Context) => void
): CallbackHandler;

export type { Context } from '@azure/functions';
