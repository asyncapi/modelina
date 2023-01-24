import { ParserOptions } from '@asyncapi/parser';
import { TypeScriptInputProcessorOptions } from '../processors/index';

export interface ProcessorOptions {
  asyncapi?: ParserOptions,
  typescript?: TypeScriptInputProcessorOptions,
}
