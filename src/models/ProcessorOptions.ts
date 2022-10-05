import { ParseOptions } from '@asyncapi/parser';
import { TypeScriptInputProcessorOptions } from '../processors/index';

export interface ProcessorOptions {
  asyncapi?: ParseOptions,
  typescript?: TypeScriptInputProcessorOptions,
}
