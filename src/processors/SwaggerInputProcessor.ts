import { AbstractInputProcessor } from './AbstractInputProcessor';
import { JsonSchemaInputProcessor } from './JsonSchemaInputProcessor';
import { CommonInputModel, ProcessorOptions } from '../models';
import { Logger } from '../utils';
import SwaggerParser from '@apidevtools/swagger-parser';
import {OpenAPIV2} from 'openapi-types';
import { SwaggerV2Schema } from '../models/SwaggerV2Schema';

/**
 * Class for processing Swagger inputs
 */
export class SwaggerInputProcessor extends AbstractInputProcessor {
  static supportedVersions = ['2.0'];

  /**
   * Process the input as a Swagger document
   * 
   * @param input 
   */
  async process(input: Record<string, any>, options?: ProcessorOptions): Promise<CommonInputModel> {
    if (!this.shouldProcess(input)) {throw new Error('Input is not a Swagger document so it cannot be processed.');}

    Logger.debug('Processing input as a Swagger document');
    const common = new CommonInputModel();
    const api = await SwaggerParser.dereference(input as any) as OpenAPIV2.Document;
    common.originalInput = api;
    const convert = (operation: OpenAPIV2.OperationObject | undefined, path: string) => {
      if (operation) {
        const responses = operation.responses;
        for (const [responseName, response] of Object.entries(responses)) {
          if (response !== undefined) {
            const getOperationResponseSchema = (response as OpenAPIV2.ResponseObject).schema;
            if (getOperationResponseSchema !== undefined) { 
              const swaggerSchema = SwaggerInputProcessor.convertToInternalSchema(getOperationResponseSchema, `${path}_${responseName}`);
              const commonModels = JsonSchemaInputProcessor.convertSchemaToCommonModel(swaggerSchema);
              common.models = {...common.models, ...commonModels};
            }
          }
        }
      }
    };

    for (const [path, pathObject] of Object.entries(api.paths)) {
      //Remove all parameters from path
      let formattedPathName = path.replace(/(\/)?\{(.*)\}/gm, '');
      //Remove any pre-pending '/'
      formattedPathName = formattedPathName.replace(/\//, '');
      //Replace all segment separators '/'
      formattedPathName = formattedPathName.replace(/\//gm, '_');
      convert(pathObject.get, `${formattedPathName}_get`);
      convert(pathObject.put, `${formattedPathName}_put`);
      convert(pathObject.post, `${formattedPathName}_post`);
      convert(pathObject.options, `${formattedPathName}_options`);
      convert(pathObject.head, `${formattedPathName}_head`);
      convert(pathObject.patch, `${formattedPathName}_patch`);
    }
    return common;
  }
  
  /**
   * Converts a schema to the Common schema format.
   * 
   * @param schema to convert
   * @param name of the schema
   */
  static convertToInternalSchema(
    schema: OpenAPIV2.SchemaObject,
    name: string): SwaggerV2Schema {
    schema = JsonSchemaInputProcessor.reflectSchemaNames(schema, {}, name, true);
    return SwaggerV2Schema.toSchema(schema) as SwaggerV2Schema;
  }

  /**
	 * Figures out if an object is of type Swagger document and supported
	 * 
	 * @param input 
	 */
  shouldProcess(input: Record<string, any>) : boolean {
    const version = this.tryGetVersionOfDocument(input);
    if (!version) {return false;}
    return SwaggerInputProcessor.supportedVersions.includes(version);
  }

  /**
   * Try to find the AsyncAPI version from the input. If it cannot undefined are returned, if it can, the version is returned.
   * 
   * @param input 
   */
  tryGetVersionOfDocument(input: Record<string, any>) : string | undefined {
    return input && input.swagger;
  }
}
