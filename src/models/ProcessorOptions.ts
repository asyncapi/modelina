import { ParseOptions } from '@asyncapi/parser';
import { InterpreterOptions } from '../interpreter/Interpreter';
import {
  AsyncAPIInputProcessorOptions,
  JsonSchemaProcessorOptions,
  OpenAPIInputProcessorOptions,
  TypeScriptInputProcessorOptions
} from '../processors/index';

export interface ProcessorOptions {
  asyncapi?: AsyncAPIInputProcessorOptions;
  openapi?: OpenAPIInputProcessorOptions;
  typescript?: TypeScriptInputProcessorOptions;
  jsonSchema?: JsonSchemaProcessorOptions;
  /**
   * @deprecated Use the `jsonSchema` options instead of `interpreter`
   */
  interpreter?: InterpreterOptions;
}
