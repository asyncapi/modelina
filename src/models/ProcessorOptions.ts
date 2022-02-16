import { ParserOptions } from '@asyncapi/parser';
import { TypeScriptInputProcessorOptions } from 'processors';

export interface ProcessorOptions {
  asyncapi?: ParserOptions,
  typescript?: TypeScriptInputProcessorOptions,
}
