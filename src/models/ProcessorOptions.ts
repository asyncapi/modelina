import { ParseOptions } from '@asyncapi/parser';
import { InterpreterOptions } from '../interpreter/Interpreter';
import { TypeScriptInputProcessorOptions } from '../processors/index';

export interface ProcessorOptions {
  asyncapi?: ParseOptions;
  typescript?: TypeScriptInputProcessorOptions;
  interpreter?: InterpreterOptions;
}
