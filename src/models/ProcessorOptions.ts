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
}
