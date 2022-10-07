import { ParserOptions } from '@asyncapi/parser';
import { InterpreterOptions } from 'interpreter/Interpreter';
import { TypeScriptInputProcessorOptions } from '../processors/index';

export interface ProcessorOptions {
  asyncapi?: ParserOptions,
  typescript?: TypeScriptInputProcessorOptions,
  interpreter?: InterpreterOptions
}
