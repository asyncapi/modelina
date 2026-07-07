import { ParseOptions } from '@asyncapi/parser';
import {
  JsonSchemaProcessorOptions,
  OpenAPIInputProcessorOptions,
  TypeScriptInputProcessorOptions
} from '../processors/index';

export interface ProcessorOptions {
  asyncapi?: ParseOptions;
  openapi?: OpenAPIInputProcessorOptions;
  typescript?: TypeScriptInputProcessorOptions;
  jsonSchema?: JsonSchemaProcessorOptions;
}
