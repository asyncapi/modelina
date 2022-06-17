import { AbstractInputProcessor } from './AbstractInputProcessor';
import { JsonSchemaInputProcessor } from './JsonSchemaInputProcessor';
import { InputMetaModel, SwaggerV2Schema } from '../models';
import { Logger } from '../utils';
import SwaggerParser from '@apidevtools/swagger-parser';
import { OpenAPIV2 } from 'openapi-types';
import { convertToMetaModel } from '../helpers';

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
  async process(input: Record<string, any>): Promise<InputMetaModel> {
    if (!this.shouldProcess(input)) {throw new Error('Input is not a Swagger document so it cannot be processed.');}

    Logger.debug('Processing input as a Swagger document');
    const common = new InputMetaModel();
    common.originalInput = input;
    
    //Since we require that all references have been dereferenced, we cannot "simply" support already parsed inputs.
    const api = (await SwaggerParser.dereference(input as any) as unknown) as OpenAPIV2.Document;
    for (const [path, pathObject] of Object.entries(api.paths)) {
      //Remove all special chars from path
      let formattedPathName = path.replace(/[^\w\s*]+/g, '');
      //Remove any pre-pending '/'
      formattedPathName = formattedPathName.replace(/\//, '');
      //Replace all segment separators '/'
      formattedPathName = formattedPathName.replace(/\//gm, '_');
      this.processOperation(pathObject.get, `${formattedPathName}_get`, common);
      this.processOperation(pathObject.put, `${formattedPathName}_put`, common);
      this.processOperation(pathObject.post, `${formattedPathName}_post`, common);
      this.processOperation(pathObject.options, `${formattedPathName}_options`, common);
      this.processOperation(pathObject.head, `${formattedPathName}_head`, common);
      this.processOperation(pathObject.patch, `${formattedPathName}_patch`, common);
    }
    return common;
  }

  private processOperation(operation: OpenAPIV2.OperationObject | undefined, path: string, inputModel: InputMetaModel) {
    if (operation) {
      this.includeResponses(operation.responses, path, inputModel);
      this.includeParameters(operation.parameters, path, inputModel);
    }
  }

  private includeResponses(responses: OpenAPIV2.ResponsesObject, path: string, inputModel: InputMetaModel) {
    for (const [responseName, response] of Object.entries(responses)) {
      if (response !== undefined) {
        const getOperationResponseSchema = (response as OpenAPIV2.ResponseObject).schema;
        if (getOperationResponseSchema !== undefined) { 
          this.includeSchema(getOperationResponseSchema, `${path}_${responseName}`, inputModel);
        }
      }
    }
  }

  private includeParameters(parameters: OpenAPIV2.Parameters | undefined, path: string, inputModel: InputMetaModel) {
    for (const parameterObject of parameters || []) {
      const parameter = parameterObject as OpenAPIV2.Parameter;
      if (parameter.in === 'body') {
        const bodyParameterSchema = parameter.schema;
        this.includeSchema(bodyParameterSchema, `${path}_body`, inputModel);
      }
    }
  }

  private includeSchema(schema: OpenAPIV2.SchemaObject, name: string, inputModel: InputMetaModel) {
    const internalSchema = SwaggerInputProcessor.convertToInternalSchema(schema, name);
    const commonModels = JsonSchemaInputProcessor.convertSchemaToCommonModel(internalSchema);
    for (const [key, commonModel] of Object.entries(commonModels)) {
      inputModel.models[String(key)] = convertToMetaModel(commonModel);
    }
  }
  
  /**
   * Converts a Swagger 2.0 Schema to the internal schema format.
   * 
   * @param schema to convert
   * @param name of the schema
   */
  static convertToInternalSchema(
    schema: OpenAPIV2.SchemaObject,
    name: string): SwaggerV2Schema {
    schema = JsonSchemaInputProcessor.reflectSchemaNames(schema, {}, name, true);
    return SwaggerV2Schema.toSchema(schema);
  }

  /**
	 * Figures out if an object is of type Swagger document and supported
	 * 
	 * @param input 
	 */
  shouldProcess(input: Record<string, any>) : boolean {
    const version = this.tryGetVersionOfDocument(input);
    if (!version) { return false; }
    return SwaggerInputProcessor.supportedVersions.includes(version);
  }

  /**
   * Try to find the swagger version from the input. If it cannot, undefined are returned, if it can, the version is returned.
   * 
   * @param input 
   */
  tryGetVersionOfDocument(input: Record<string, any>) : string | undefined {
    return input && input.swagger;
  }
}
